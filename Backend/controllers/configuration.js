const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Configuration = require("../models/Configuration");
const Commodity = require("../models/Commodity");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const moment = require("moment");
const schedule = require("node-schedule");
const User = require("../models/User");
const express = require("express");
const router = express.Router();
// @desc    Create Configuration 
// @route   POST /api/Configuration/
// @access  Public/Admin

exports.addConfiguration = asyncHandler(async (req, res, next) => {
  try {
    // Check if the 'commodity' field is provided in the request body
    if (!req.body.commodity) {
      return next(new ErrorResponse("Please provide the commodity", 400));
    }

    // Find the commodity by its ID
    const commodity = await Commodity.findById(req.body.commodity);

    // If the commodity is not found, return an error response
    if (!commodity) {
      return next(new ErrorResponse("Commodity does not exist", 400));
    }

    // Create a new configuration using the request body
    const configuration = await Configuration.create({
      commodity: req.body.commodity,
      effective_time: req.body.effective_time,
      effective_date: req.body.effective_date,
      new_price: req.body.new_price,
      previous_price: commodity.current_price, // Set previous_price to commodity's price
      reason_for_change: req.body.reason_for_change,
    });

    // Populate the 'commodity' field to get the commodity details
    await configuration.populate('commodity').execPopulate();

    // Send a success response with the created configuration
    res.status(201).json({
      success: true,
      data: configuration,
    });
  } catch (error) {
    // Handle any errors that occur during configuration creation
    return next(new ErrorResponse("Error creating configuration", 500));
  }
});

// @desc    Get all Configurations
// @route   GET /api/v1/configuration
// @access  Public/Admin
exports.getConfigurations = asyncHandler(async (req, res, next) => {
  // Convert configurations data to Mongoose documents
  const configurations = await Configuration.find().lean();

  // Populate the 'commodity' field to get the commodity details
  const populatedConfigurations = await Configuration.populate(configurations, {
    path: 'commodity',
    select: 'name description', // Assuming you want to select specific fields of the commodity
  });

  res.status(200).json({
    success: true,
    data: populatedConfigurations,
  });
});


// @desc    Delete a Configuration
// @route   DELETE /api/Configuration/:id
// @access  Private/Admin
exports.deleteConfiguration = asyncHandler(async (req, res) => {
  const configuration = await Configuration.findById(req.params.id);

  if (configuration) {
    await configuration.remove();
    res.json({ message: "Current Configuration Prices removed" });
  } else {
    res.status(404);
    throw new Error("Current Configuration Prices not found");
  }
});

// @desc    Update a Configuration
// @route   PUT /api/Configuration/:id
// @access  Private/Admin

exports.updateConfiguration = asyncHandler(async (req, res, next) => {
  try {
    const configurationId = req.params.id;

    // Find the configuration by its ID
    let configuration = await Configuration.findById(configurationId).populate('commodity');

    // If the configuration is not found, return an error response
    if (!configuration) {
      return next(new ErrorResponse("Configuration not found", 404));
    }

    // Update other fields if provided
    if (req.body.effective_time !== undefined) {
      configuration.effective_time = req.body.effective_time;
    }
    if (req.body.effective_date !== undefined) {
      configuration.effective_date = req.body.effective_date;
    }
    if (req.body.new_price !== undefined) {
      configuration.new_price = req.body.new_price;
    }
    if (req.body.reason_for_change !== undefined) {
      configuration.reason_for_change = req.body.reason_for_change;
    }

    // Update the previous_price with the latest commodity price
    if (configuration.commodity) {
      const commodity = await Commodity.findById(configuration.commodity);
      if (commodity) {
        configuration.commodity.current_price = configuration.new_price;
        configuration.commodity.previous_price = configuration.previous_price;

        await commodity.save();
      }
    }
    console.log(configuration.commodity.current_price)
    // Save the updated configuration
    // configuration = await configuration.save();
    configuration.status = 'Completed';
    await configuration.save();
    // Send a success response with the updated configuration
    res.status(200).json({
      success: true,
      data: configuration,
    });
  } catch (error) {
    // Handle any errors that occur during configuration update
    return next(new ErrorResponse("Error updating configuration", 500));
  }
});


// @desc      Get single Configuration
// @route     GET /api/v1/Configuration/:id
// @access    Public
exports.getConfiguration = asyncHandler(async (req, res, next) => {

  const configuration = await Configuration.findById(req.params.id);

  if (!configuration) {
    return next(new ErrorResponse(`Current Configuration Price not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: configuration
  });
});

// @desc      function to get the price change of a commodity within a year
// @access    Public

// Controller function to get the price change for each month
exports.getPriceChangeByMonth = asyncHandler(async (req, res, next) => {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Aggregate pipeline to group by month and calculate price change
    const pipeline = [
      {
        $match: {
          status: 'Completed', // Only consider completed configurations
          effective_date: {
            $gte: new Date(`${currentYear}-01-01`), // Start of the current year
            $lte: new Date(`${currentYear}-12-31`), // End of the current year
          }
        }
      },
      {
        $group: {
          _id: { $month: "$effective_date" }, // Group by month
          total_price_change: { $sum: { $subtract: ["$new_price", "$previous_price"] } } // Calculate total price change for the month
        }
      },
      {
        $sort: { "_id": 1 } // Sort by month
      }
    ];

    // Execute the aggregation pipeline
    const result = await Configuration.aggregate(pipeline);

    // Create an array to store the price change for each month
    const priceChangeByMonth = Array(12).fill(0); // Initialize with zeros for each month

    // Update the array with the calculated price changes
    result.forEach(item => {
      priceChangeByMonth[item._id - 1] = item.total_price_change; // Subtract 1 from month index to match array index
    });

    // Send the price change data in the response
    res.status(200).json({
      success: true,
      priceChangeByMonth: priceChangeByMonth,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});


// Function to get the total number of pending price updates
exports.getTotalPendingPriceUpdates = asyncHandler(async (req, res, next) => {
  try {
    // Count all configurations with status "Pending"
    const totalPendingPriceUpdates = await Configuration.countDocuments({ status: 'Pending' });

    // Send the total count of pending price updates in the response
    res.status(200).json({
      success: true,
      totalPendingPriceUpdates: totalPendingPriceUpdates
    });
  } catch (error) {
    // Handle error
    console.error('Error fetching total pending price updates:', error);
    return next(new Error('Error fetching total pending price updates'));
  }
});


// Function to get the total number of configurations
exports.getTotalConfigurations = asyncHandler(async (req, res, next) => {
  try {
    // Count the total number of configurations
    const totalConfigurations = await Configuration.countDocuments();

    // Send the total count of configurations in the response
    res.status(200).json({
      success: true,
      totalConfigurations: totalConfigurations
    });
  } catch (error) {
    // Handle error
    console.error('Error fetching total configurations:', error);
    return next(new Error('Error fetching total configurations'));
  }
});


// const date = new Date(2024, 1, 29, 12, 25, '00');

// schedule.scheduleJob(date, function(){
// console.log("Task complete" + new Date());
// });


// Define the schedule to run every minute
schedule.scheduleJob('* 1 * * *', async function () {

  try {
    const currentDateTime = new Date();

    console.log('Current Date and Time:', currentDateTime);

    // Test MongoDB Atlas connection
    console.log('Attempting to connect to MongoDB Atlas...');
    // const configurationsToUpdate = await Configuration.find({ 
    //status: 'Pending',
    const configurationsToUpdate = await Configuration.find(
      {

        status: 'Pending', // Only consider completed configurations

      },
      //effective_date: { $lte: currentDateTime }, // Ensure effective date is greater than current datetime
      //effective_time: { $lte: currentDateTime.getTime() } // Ensure effective time is greater than current timestamp
    ).populate('commodity');

    console.log('MongoDB Atlas connection successful.');
    console.log('Configurations to Update:', configurationsToUpdate);

    for (const config of configurationsToUpdate) {
      const commodity = config.commodity;
      const newPrice = config.new_price;
      const effectiveDateTime = new Date(`${config.effective_date}T${config.effective_time}`);
      // Check if the effective date and time have been reached
      if (currentDateTime >= effectiveDateTime) {
        // Update configuration status to 'Completed'
        config.status = 'Completed';
        await config.save();

        // Update commodity price
        commodity.previous_price = config.previous_price;
        commodity.current_price = newPrice;
        await commodity.save();

        console.log(`Updated price for commodity ${commodity.name} to ${newPrice}`);
      } else {
        console.log(`Effective date and time for configuration ${config._id} have not been reached yet.`);
      }
    }
  } catch (error) {
    console.error('Error updating configurations and prices:', error);
  }
});

// Function to get Price Alert
exports.getAlert = asyncHandler(async (req, res, next) => {
  try {

    const commodity = await Commodity.findById(req.user.alert)

    res.status(200).json({
      success: true,
      data: commodity
    });

  } catch (error) {
    // Handle error
    console.error('Error fetching alert:', error);
    return next(new Error('Error fetching alert'));
  }
});

// @desc    Get Reporting
// @route   GET /api/v1/configuration/reporting
// @access  Public/Admin
exports.getReporting = asyncHandler(async (req, res, next) => {
  // Convert configurations data to Mongoose documents
  const { month, year } = req.body;
  var Reportings;

  // Check if both month and year are undefined
  if (month === undefined && year === undefined) {
    Reportings = await Configuration.find().exec();
  } else {
    // Handle the case when either month or year is specified
    if (year !== undefined && month !== undefined) {
      Reportings = await Configuration.find({
        $and: [
          { $expr: { $eq: [{ $month: { $toDate: '$effective_date' } }, month] } },
          { $expr: { $eq: [{ $year: { $toDate: '$effective_date' } }, year] } }
        ]
      }).exec();
    } else if (year !== undefined) {
      Reportings = await Configuration.find({
        $expr: { $eq: [{ $year: { $toDate: '$effective_date' } }, year] }
      }).exec();
    } else {
      Reportings = await Configuration.find({
        $expr: { $eq: [{ $month: { $toDate: '$effective_date' } }, month] }
      }).exec();
    }
  }
  
  // Populate the 'commodity' field to get the commodity details
  const populatedReporting = await Configuration.populate(Reportings, {
    path: 'commodity',
    // Assuming you want to select specific fields of the commodity
  });
  
  res.status(200).json({
    success: true,
    data: populatedReporting,
  });
});

//db.collection.find({ "$expr": { "$eq": [{ "$month": "$createdAt" }, 1] }})


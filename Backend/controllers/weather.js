const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Commodity = require("../models/Commodity");
const User = require("../models/User");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const axios = require("axios");

// @desc    Get Reporting
// @route   GET /api/v1/configuration/reporting
// @access  Public/Admin

exports.getWeather = asyncHandler(async (req, res) => {
    const { longitude, latitude } = req.body;
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.API_KEY}`;
  
    try {
      const response = await axios.get(url);
      // Send weather data to the client
      res.json(response.data);
      console.log(response.data); // Log the weather data
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Send an error response to the client
      res.status(500).json({ error: 'Error fetching weather data' });
    }
}
);
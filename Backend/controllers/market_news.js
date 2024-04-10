const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const MarketNews = require("../models/Market_News");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");
const Market_News = require("../models/Market_News");

const {
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");
const azure = require("azure-storage");
const { BlobServiceClient } = require("@azure/storage-blob");

// @desc    create Market News
// @route   POST/api/v1/marketNews
// @access   Public/Admin
exports.addMarketNews = asyncHandler(async (req, res, next) => {
  try {
    // Check if a market news with the same title already exists
    const existingMarketNews = await Market_News.findOne({ title: req.body.title });
    if (existingMarketNews) {
      return res.status(400).json({ success: false, error: "Market news with this title already exists" });
    }

    // Check if an image is uploaded
    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, error: "Please upload an image" });
    }

    // Upload image to Azure Blob Storage
    const blobService = azure.createBlobService(
      process.env.CONTAINER_NAME,
      process.env.CONTAINER_KEY,
    );
    const containerName = "marketplace";
    const originalBlobName = req.files.image.name;
    const blobName = originalBlobName.replace(/\s+/g, '-'); // Replace spaces with dashes
    const stream = blobService.createWriteStreamToBlockBlob(
      containerName,
      blobName
    );

    stream.on("error", (error) => {
      console.error("Upload error:", error);
    });

    stream.on("finish", () => {
      console.log("Upload completed");
    });
    stream.end(req.files.image.data);
    req.body.image = `https://osstoragelban.blob.core.windows.net/marketplace/${blobName}`;

    // Create market news
    const marketNews = await Market_News.create(req.body);

    res.status(201).json({
      success: true,
      data: marketNews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});


// @desc    get all Market News
// @route   Get/api/v1/marketNews
// @access   Public/Admin
exports.getMarketNews= asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Delete a MarketNews
// @route   DELETE /api/marketNews/:id
// @access  Private/Admin
exports.deleteMarketNews = asyncHandler(async (req, res) => {
  const marketNews = await MarketNews.findById(req.params.id);

  if (marketNews) {
    await marketNews.remove();
    res.status(200).json({ success: true, message: "Market News removed successfully" });
  } else {
    res.status(404).json({ success: false, error: "Market News not found" });
  }  
});

// @desc    Update Market News
// @route   PUT /api/marketnews/:id
// @access  Public/Admin

exports.updateMarketNews = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Check if the market news exists
  let marketNews = await Market_News.findById(id);

  if (!marketNews) {
    return res.status(404).json({
      success: false,
      error: 'Market news not found',
    });
  }

  // Update market news fields
  if (req.body.title) {
    marketNews.title = req.body.title;
  }
  if (req.body.description) {
    marketNews.description = req.body.description;
  }
  if (req.files && req.files.image) {
    const blobService = azure.createBlobService(
      process.env.CONTAINER_NAME,
      process.env.CONTAINER_KEY,
    );

    const containerName = "marketplace";
    const originalBlobName = req.files.image.name;
    const blobName = originalBlobName.replace(/\s+/g, '-'); // Replace spaces with dashes
    const stream = blobService.createWriteStreamToBlockBlob(
      containerName,
      blobName
    );

    stream.on("error", (error) => {
      console.error("Upload error:", error);
    });

    stream.on("finish", () => {
      console.log("Upload completed");
    });

    stream.end(req.files.image.data);
    marketNews.image = `https://osstoragelban.blob.core.windows.net/marketplace/${blobName}`;
  }

  // Save the updated market news
  marketNews = await marketNews.save();

  res.status(200).json({
    success: true,
    data: marketNews,
  });
});



// @desc    get all Market News
// @route   get/api/v1/MarketNews
// @access   Public/Admin
exports.getMarketNews = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Delete a Market News
// @route   DELETE /api/MarketNews/:id
// @access  Private/Admin
exports.deleteMarketNews = asyncHandler(async (req, res) => {
  const marketnews = await MarketNews.findById(req.params.id);

  if (marketnews) {
    await marketnews.remove();
    res.json({ message: "Market News removed" });
  } else {
    res.status(404);
    throw new Error("Market News not found");
  }
});

// @desc    Update a Current Crop Prices
// @route   PUT /api/CurrentCropPrices/:id
// @access  Private/Admin

//exports.updateMarketNew = asyncHandler(async (req, res, next) => {
 // const marketnews = await MarketNews.findByIdAndUpdate(
 //     req.params.id,
  //    {
  //      name: req.body.name,
   //     quality_information: req.body.quality_information

   ///   },
   //   { new: true}
  //)
 
 // if(!marketnews)
 // return res.status(400).send('the Market News cannot be updated!')

 // res.status(200).json({
 //   success: true,
 //   data: marketnews
 // });
//})


// @desc      Get Market News
// @route     GET /api/v1/marketnews/:id
// @access    Public
exports.getMarketNew = asyncHandler(async (req, res, next) => {
    
  const marketnews = await MarketNews.findById(req.params.id);

  if (!marketnews) {
    return next(new ErrorResponse(`Market News not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
      success: true,
      data: marketnews
    });
  });

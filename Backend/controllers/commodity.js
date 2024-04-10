const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Commodity = require("../models/Commodity");
const User = require("../models/User");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");

const {
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");
const azure = require("azure-storage");
const { BlobServiceClient } = require("@azure/storage-blob");


// @desc    Create Commodity 
// @route   POST/api/Commodity
// @access   Public/Admin

exports.addCommodity = asyncHandler(async (req, res, next) => {
  try {
    // Check if a commodity with the same name already exists
    const existingCommodity = await Commodity.findOne({ name: req.body.name });
    if (existingCommodity) {
      return res.status(400).json({ success: false, error: "Commodity with this name already exists" });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, error: "Please upload an image" });
    }

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

    const commodity = await Commodity.create(req.body);

    res.status(201).json({
      success: true,
      data: commodity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});



// @desc    get all Commodity
// @route   POST/api/v1/Commodity
// @access   Public/Admin
exports.getCommodities = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Delete a Commodity
// @route   DELETE /api/Commodity/:id
// @access  Private/Admin
exports.deleteCommodity = asyncHandler(async (req, res) => {
  const commodity = await Commodity.findById(req.params.id);

  if (commodity) {
    await commodity.remove();
    res.status(200).json({ success: true, message: "Commodity removed successfully" });
  } else {
    res.status(404).json({ success: false, error: "Commodity not found" });
  }  
});

// @desc    Update Commodity 
// @route   PUT /api/Crp/:id
// @access  Public/Admin
exports.updateCommodity = asyncHandler(async (req, res, next) => {
  try {
    // Check if the request contains the commodity ID
    if (!req.params.id) {
      return res.status(400).json({ success: false, error: "Commodity ID is required" });
    }

    // Find the commodity by ID
    let commodity = await Commodity.findById(req.params.id);

    // If the commodity is not found, return an error
    if (!commodity) {
      return res.status(404).json({ success: false, error: "Commodity not found" });
    }

    // Check if a commodity with the updated name already exists
    if (req.body.name && req.body.name !== commodity.name) {
      const existingCommodity = await Commodity.findOne({ name: req.body.name });
      if (existingCommodity) {
        return res.status(400).json({ success: false, error: "Commodity with this name already exists" });
      }
    }

    // Update commodity fields
    commodity.name = req.body.name || commodity.name;
    commodity.description = req.body.description || commodity.description;

    // Upload new image if provided
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
      commodity.image = `https://osstoragelban.blob.core.windows.net/marketplace/${blobName}`;
    }

    // Save the updated commodity
    commodity = await commodity.save();

    res.status(200).json({
      success: true,
      data: commodity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});



// @desc      Get single Commodity
// @route     GET /api/v1/Commodity/:id
// @access    Public
exports.getCommodity = asyncHandler(async (req, res, next) => {
    
  const commodity = await Commodity.findById(req.params.id);

  if (!commodity) {
    return next(new ErrorResponse(`Current Commodity Price not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
      success: true,
      data: commodity
    });
  });

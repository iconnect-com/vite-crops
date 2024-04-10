const mongoose = require("mongoose");

const CommoditySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: { type: String },
    previous_price: {
      type: Number,
      required: true,
      default: 0,
    },
    current_price: {
      type: Number,
      required: true,
      default: 0,
    },
    analysis: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Commodity", CommoditySchema);

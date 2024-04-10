const mongoose = require("mongoose");

const Market_NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Market_News", Market_NewsSchema);

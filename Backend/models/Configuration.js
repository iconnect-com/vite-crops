const { date } = require("azure-storage");
const mongoose = require("mongoose");

const ConfigurationSchema = new mongoose.Schema(
  {
    commodity: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Commodity",
      },
    effective_time: {
      type: date,
      required: true,
      },
    effective_date: {
      type: date,
      required: true,
      },
    new_price: {
      type: Number,
      required: true,
      default: 0,
    },
    previous_price: {
      type: Number,
      required: true,
      default: 0,
    },
    reason_for_change: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: "Pending",
    },
    // priceHistory: [{
    //   price: Number,
    //   effective_date: date,
    //   month: string
    // }]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Configuration", ConfigurationSchema);

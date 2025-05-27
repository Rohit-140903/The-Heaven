const mongoose = require("mongoose");

const ReservedStockSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  items: [
    {
      id: String,
      quantity: Number,
    },
  ],
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ReservedStock", ReservedStockSchema);

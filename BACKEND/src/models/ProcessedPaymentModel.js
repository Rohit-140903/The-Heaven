const mongoose = require("mongoose");


const processedPaymentSchema = new mongoose.Schema({
    paymentIntent: {
      type: String,
      unique: true,
      required: true,
    },
    processed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const ProcessedPayment = mongoose.model(
    "ProcessedPayment",
    processedPaymentSchema
  );

  module.exports = ProcessedPayment;
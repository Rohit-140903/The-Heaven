const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userEmail: { type: String, unique: true },
  products: [
    {
      productId: { type: Number, required: true },
      name: String,
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      address: {
        fullName: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
      },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String, required: true },
  image: { type: String, required: true },
  image_public_id: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;

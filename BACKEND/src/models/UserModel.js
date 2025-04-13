const mongoose = require("mongoose");

// Temporary User Schema
const tempUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const TempUser = mongoose.model("TempUser", tempUserSchema);

// Main User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: Object,
  date: { type: Date, default: Date.now },
  address: {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { TempUser, User };

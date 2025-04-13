const mongoose = require("mongoose");

// Temporary Admin Schema
const tempAdminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const TempAdmin = mongoose.model("TempAdmin", tempAdminSchema);

// Main Admin Schema
const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = { TempAdmin, Admin };

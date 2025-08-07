const { User, TempUser } = require("../models/UserModel");
const { Admin, TempAdmin } = require("../models/AdminModel");
const jwt = require("jsonwebtoken");

exports.clientDetails = async (req,res) => {
  const address = req.body.address; // Identify user by email
  //console.log(req.user);

  //const email = req.user.email;
  //console.log(address);

  let userData = await User.findOne({ _id: req.user.id });
  //console.log(userData);

  const email = userData.email;


  console.log(email);

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { address } }, // Update the address field
      { new: true } // Return updated user
    );

    console.log(updatedUser);

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json({
      message: "Address updated successfully",
      address: updatedUser.address,
    });
  } catch (error) {
    console.log("error");
    res.status(500).json({ error: "Error updating address" });
  }
};


// Verify User not already in the signing process Email Before Signup
exports.verifyEmail = async (req, res) => {
  const user = req.body;

  if (!user.email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  try {
    // Check if email already exists in the temporary user collection
    const existingTempUser = await TempUser.findOne({ email: user.email });

    if (existingTempUser) {
      await TempUser.deleteOne({ email: user.email });
      return res.status(409).json({ success: false, message: "Something went wrong. Try again!" });
    }

    // Check if the email exists in the main user collection
    const foundUser = await User.findOne({ email: user.email });

    if (!foundUser) {
      // If not found, create a new temporary user
      const newUser = new TempUser({
        name: user.name,
        email: user.email,
        password: user.password,
      });

      await newUser.save();

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({
      success: false,
      errors: "Existing user found with the same email address",
    });
  } catch (error) {
    console.error("Error in email verification:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
exports.verifyEmailSignup = async (req, res) => {
  const adminCount = await Admin.countDocuments();

  if (adminCount >= 1) {
    return res.status(400).json({
      success: false,
      errors: "Admin Access Window Size Exceed",
    });
  }
  const admin = req.body;

  const foundUser = await Admin.findOne({ email: admin.email });
  console.log("foundUser", foundUser);

  if (foundUser === null || foundUser === undefined) {
    const newAdmin = new tempAdmin({
      name: admin.name,
      email: admin.email,
      password: admin.password,
    });
    await newAdmin.save();
    return res.status(200).json({
      success: true,
    });
  }
  await tempAdmin.deleteOne(foundUser);
  return res.status(400).json({
    success: false,
    errors: "Existing Admin found with the same email address",
  });
};

// User Signup
exports.signup = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    let check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({
        success: false,
        errors: "Existing user found with the same email address",
      });
    }

    // Check if user is in tempUser collection
    const user = await tempUser.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        errors: "User not found in tempUser database",
      });
    }

    // Fetch all products
    const totalProduct = await Product.find({});
    let cart = {};
    const len = totalProduct.length;

    for (let i = 1; i <= len; i++) {
      cart[i] = 0;
    }

    // Create a new user
    const newUser = new User({
      name: user.name,
      email: user.email,
      password: user.password, // Ensure password is stored in tempUser
      cartData: cart,
    });

    await newUser.save();
    await tempUser.deleteOne({ email: user.email });

    // Create JWT token
    const data = { user: { id: newUser.id } };
    const token = jwt.sign(data, process.env.SALT_KEY);

    res.json({ success: true, token });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, errors: "Internal Server Error" });
  }
};

// Admin Signup
exports.adminSignup = async (req, res) => {
  let check = await Admin.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: "Existing user found with the same email address",
    });
  }

  const admin = await tempAdmin.findOne({ email: req.body.email });

  const newAdmin = new Admin({
    name: admin.name,
    email: admin.email,
    password: admin.password,
  });
  await newAdmin.save();

  await tempAdmin.deleteOne(admin);

  const data = {
    user: {
      id: newAdmin.id,
    },
  };

  const token = jwt.sign(data, process.env.SALT_KEY); // salting
  res.json({ success: true, token });
};

// User Login
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && user.password === req.body.password) {
      const token = jwt.sign({ user: { id: user.id } }, process.env.SALT_KEY);
      res.json({ success: true, token });
    } else {
      res.json({
        success: false,
        errors: user ? "Wrong Password" : "Sign In First!",
      });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, errors: "Internal Server Error" });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (admin && admin.password === req.body.password) {
      const token = jwt.sign({ user: { id: admin.id } }, process.env.SALT_KEY);
      res.json({ success: true, token });
    } else {
      res.json({
        success: false,
        errors: admin ? "Wrong Password" : "Sign In First!",
      });
    }
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ success: false, errors: "Internal Server Error" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.password = newPassword; 
    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.ResetPassword = async(req,res) => {
  const {email} = req.body;
  
  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.json({ success: false, error: "User not found" });
    }
    
    const name = user.name;
    const password = user.password;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'The-Heaven Reset-Password Request',
      html: `
        <p>Hello ${name || "Customer"},</p>
        <p>You have made a Reset-Password request for your account Password on which is <strong>${password}</strong></p>
        <br/>
        <p>Thank you for Choosing Us</p>
      `,
    });

    res.json({success: true });
  } catch (err) {
    console.error("Error sending email:", err);
    res.json({ success: false, error: err.message });
  }
};


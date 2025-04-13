const { TempUser, User } = require("../models/UserModel");

// Verify Email (Check if the email exists before proceeding)
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

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Victim = require("../models/victim");
const Session = require("../models/session");
const sendEmail = require("../utils/sendEmail");
const EmailToken = require("../models/emailToken");
const crypto = require("crypto");
const { generatePasswordResetEmail } = require("../utils/mailTemplates");

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  const victim = await Victim.findOne({ email });

  if (!victim)
    return res.status(400).json({ message: "Victim not found" });
  if (!victim.isVerified)
    return res
      .status(403)
      .json({ message: "Account is not verified." });

  const isMatch = await bcrypt.compare(password, victim.password);
  if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

  // ✅ Generate JWT Token
  const token = jwt.sign({ victim: victim }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // ✅ Store session in MongoDB
  await Session.create({ victimId: victim._id, token });

  // ✅ Set token in HTTP-only cookies
  res.cookie("autoKey", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const { password: pwd, ...victimData } = victim.toObject(); // Exclude password

  res.status(200).json({
    success: true,
    message: "Login successful",
    victim: victimData,
    token: token,
  });
};

module.exports.verifySession = async (req, res) => {
  // ✅ Check if victim is authenticated
  if (!req.victim) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const victim = await Victim.findById(req.victim._id);
  if (!victim) {
    return res.status(404).json({ message: "Victim not found" });
  }

  const { password, ...victimData } = victim.toObject();
  // ✅ Return victim info
  res.status(200).json({ success: true, victim: victimData });
};

module.exports.logout = async (req, res) => {
  // ✅ Delete the session from MongoDB
  await Session.deleteOne({ victimId: req.victim._id, token: req.token });

  // ✅ Clear the authentication cookie
  res.clearCookie("autoKey", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const victim = await Victim.findOne({ email });
  if (!victim) return res.status(400).json({ message: "Victim not found" });

  // delete old token if exists
  await EmailToken.deleteOne({ email });

  // generate token
  const token = crypto.randomBytes(32).toString("hex");
  await EmailToken.create({ email, token });

  // build reset link
  const resetLink = `${
    process.env.FRONTEND_URL
  }/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  // send email
  const htmlContent = generatePasswordResetEmail(victim.name, resetLink);

  await sendEmail(email, "Reset Your Password", {
    text: "You requested to reset your password.",
    html: htmlContent,
  });

  res
    .status(200)
    .json({ success: true, message: "Password reset link sent to email" });
};

module.exports.forgotPasswordMobile = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const victim = await Victim.findOne({ email });
  if (!victim) return res.status(400).json({ message: "Victim not found" });

  // delete old token if exists
  await EmailToken.deleteOne({ email });

  // generate token
  const token = crypto.randomBytes(32).toString("hex");
  await EmailToken.create({ email, token });

  // build reset link
  const resetLink = `auth-app://reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  // send email
  const htmlContent = generatePasswordResetEmail(victim.name, resetLink);

  await sendEmail(email, "Reset Your Password", {
    text: "You requested to reset your password.",
    html: htmlContent,
  });

  res
    .status(200)
    .json({ success: true, message: "Password reset link sent to email" });
};

module.exports.resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;

  if (!token || !email || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const record = await EmailToken.findOne({ token, email });
  if (!record)
    return res.status(400).json({ message: "Invalid or expired token" });

  const victim = await Victim.findOne({ email });
  if (!victim) return res.status(404).json({ message: "Victim not found" });

  // hash new password
  const hashed = await bcrypt.hash(newPassword, 10);
  victim.password = hashed;
  await victim.save();

  // delete token after reset
  await EmailToken.deleteOne({ token, email });

  res.status(200).json({
    success: true,
    message: "Password reset successful. Please log in.",
  });
};

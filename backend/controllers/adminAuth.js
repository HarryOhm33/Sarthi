const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const AdminSession = require("../models/adminSession");
const Victim = require("../models/victim");
const Analytics = require("../models/analytics");
const { runAnalyticsJob, runAnalyticsForVictim } = require("../jobs/analyticsJob");

// 📌 1. Admin Login (adminLogin)
module.exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Admin email and password are required" });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) {
    return res.status(401).json({ message: "Invalid administrator credentials" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid administrator credentials" });
  }

  // Generate Admin JWT Token
  const token = jwt.sign(
    {
      admin: {
        _id: admin._id,
        email: admin.email,
        role: admin.role,
        name: admin.name,
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Store Admin Session in MongoDB
  await AdminSession.create({ adminId: admin._id, token });

  // Set Cookie named adminToken (readable by client for session persistence)
  res.cookie("adminToken", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "lax",
    path: "/",
  });
  // Also keep adminKey for backward compatibility
  res.cookie("adminKey", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
    path: "/",
  });

  const { password: pwd, ...adminData } = admin.toObject();

  res.status(200).json({
    success: true,
    message: "Admin authentication successful",
    admin: adminData,
    adminToken: token,
    token: token,
  });
};

// 📌 2. Verify Admin Session
module.exports.adminVerifySession = async (req, res) => {
  if (!req.admin) {
    return res.status(401).json({ message: "Unauthorized admin" });
  }
  res.status(200).json({ success: true, admin: req.admin });
};

// 📌 3. Admin Logout
module.exports.adminLogout = async (req, res) => {
  if (req.admin && req.adminToken) {
    await AdminSession.deleteOne({
      adminId: req.admin._id,
      token: req.adminToken,
    });
  }

  res.clearCookie("adminToken", {
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  res.clearCookie("adminKey", {
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ success: true, message: "Admin logged out successfully" });
};

// 📌 4. Dashboard Stats & Analytics Aggregation
module.exports.getDashboardStats = async (req, res) => {
  const totalVictims = await Victim.countDocuments();
  const allAnalytics = await Analytics.find().sort({ createdAt: -1 });

  // Find latest analytics record for each victim to avoid double-counting
  const latestByVictim = new Map();
  for (const item of allAnalytics) {
    const vId = item.victim?.toString();
    if (vId && !latestByVictim.has(vId)) {
      latestByVictim.set(vId, item);
    }
  }

  const latestRecords = Array.from(latestByVictim.values());

  const criticalRiskCount = latestRecords.filter(
    (a) => a.riskLevel === "CRITICAL" || a.riskLevel === "HIGH"
  ).length;

  const activeThreatsCount = latestRecords.filter(
    (a) => a.threatIndicator === true
  ).length;

  const distressScores = latestRecords
    .map((a) => a.distressScore)
    .filter((s) => typeof s === "number");

  const avgDistressScore =
    distressScores.length > 0
      ? Math.round(
          distressScores.reduce((sum, val) => sum + val, 0) /
            distressScores.length
        )
      : 0;

  const sentimentCounts = {
    POSITIVE: latestRecords.filter((a) => a.sentiment === "POSITIVE").length,
    NEUTRAL: latestRecords.filter((a) => a.sentiment === "NEUTRAL").length,
    NEGATIVE: latestRecords.filter((a) => a.sentiment === "NEGATIVE").length,
  };

  res.status(200).json({
    success: true,
    stats: {
      totalVictims,
      evaluatedVictims: latestRecords.length,
      criticalRiskCount,
      activeThreatsCount,
      avgDistressScore,
      sentimentCounts,
    },
  });
};

// 📌 5. Get Analytics Feed with Populated Victim Info
module.exports.getAnalyticsFeed = async (req, res) => {
  const records = await Analytics.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("victim", "name email district caseType caseStatus createdAt");

  res.status(200).json({
    success: true,
    analytics: records,
  });
};

// 📌 6. Get Victim Directory
module.exports.getVictimDirectory = async (req, res) => {
  const victims = await Victim.find()
    .select("-password")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    victims,
  });
};

// 📌 7. Trigger Manual Gemini Analytics from Admin Dashboard
module.exports.triggerManualAnalytics = async (req, res) => {
  try {
    const result = await runAnalyticsJob();
    res.status(200).json({
      success: true,
      message: "Gemini Clinical & Legal Analytics Job executed successfully",
      result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to run analytics job",
      error: err.message,
    });
  }
};

// 📌 8. Regenerate Analytics for a Single Victim
module.exports.regenerateVictimAnalytics = async (req, res) => {
  const { victimId } = req.params;

  if (!victimId) {
    return res.status(400).json({ success: false, message: "Victim ID is required" });
  }

  try {
    const analytics = await runAnalyticsForVictim(victimId);
    res.status(200).json({
      success: true,
      message: "Analytics regenerated successfully for victim",
      analytics,
    });
  } catch (err) {
    console.error(`Error regenerating analytics for victim ${victimId}:`, err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to regenerate analytics for victim",
    });
  }
};

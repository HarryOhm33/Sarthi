const jwt = require("jsonwebtoken");
const AdminSession = require("../models/adminSession");
const Admin = require("../models/admin");

const adminAuthenticate = async (req, res, next) => {
  try {
    let authHeader = req.header("Authorization") || req.header("authorization");
    let token = null;

    if (authHeader) {
      token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader.trim();
    } else {
      token = req.cookies?.adminToken || req.cookies?.adminKey;
    }

    if (!token) {
      return res.status(401).json({ message: "Admin authorization required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.admin || !decoded.admin._id) {
      return res.status(401).json({ message: "Invalid admin token" });
    }

    // Verify session exists in MongoDB admin sessions
    const session = await AdminSession.findOne({
      adminId: decoded.admin._id,
      token,
    });

    if (!session) {
      return res
        .status(401)
        .json({ message: "Admin session expired, please log in again" });
    }

    // Fetch fresh admin data
    const currentAdmin = await Admin.findById(decoded.admin._id).select(
      "-password"
    );

    if (!currentAdmin) {
      return res.status(401).json({ message: "Administrator account not found" });
    }

    req.admin = currentAdmin;
    req.adminToken = token;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Admin authentication failed" });
  }
};

module.exports = adminAuthenticate;

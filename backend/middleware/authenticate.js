const jwt = require("jsonwebtoken");
const Session = require("../models/session");

const authenticate = async (req, res, next) => {
  try {
    let token = req.cookies.autoKey || req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Handle "Bearer " prefix if the token is sent in the Authorization header
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    // ✅ Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // console.log("Decoded JWT:", decoded);

    // ✅ Check if the token exists in MongoDB sessions
    const session = await Session.findOne({ victimId: decoded.victim._id, token });
    if (!session) {
      return res
        .status(401)
        .json({ message: "Session expired, Please log in again" });
    }

    req.victim = decoded.victim; // Attach victim info to the request
    req.token = token; // Attach token to the request
    next(); // Move to the next middleware/controller
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = authenticate;

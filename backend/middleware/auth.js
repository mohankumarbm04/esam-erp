// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("\n🔐 ===== AUTH MIDDLEWARE =====");
  console.log("📨 Headers:", req.headers);

  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      console.log("❌ No Authorization header");
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");
    console.log(
      "🔑 Token received (first 20 chars):",
      token.substring(0, 20) + "...",
    );

    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "esam-erp-secret-key-2026",
    );

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.username || decoded.name || undefined,
    };
    console.log("✅ User set:", req.user);
    console.log("🔐 ===== AUTH SUCCESS =====\n");

    next();
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    console.log("🔐 ===== AUTH FAILED =====\n");
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;

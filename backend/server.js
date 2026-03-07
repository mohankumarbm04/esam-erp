// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// 🔍 DEBUG: Check if MONGODB_URI is being read
console.log("🔍 Environment variables loaded");
console.log("🔍 MONGODB_URI exists:", !!process.env.MONGODB_URI);
if (process.env.MONGODB_URI) {
  console.log(
    "🔍 MONGODB_URI starts with:",
    process.env.MONGODB_URI.substring(0, 30) + "...",
  );
} else {
  console.log("❌ MONGODB_URI is NOT set in environment!");
}

// Create Express app
const app = express();

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== ROUTES ==========
app.use("/api/auth", require("./routes/auth"));
app.use("/api/test", require("./routes/test"));
app.use("/api/departments", require("./routes/departments"));
app.use("/api/teachers", require("./routes/teachers"));
app.use("/api/students", require("./routes/students"));
app.use("/api/subjects", require("./routes/subjects"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/marks", require("./routes/marks"));

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/esam-erp";

console.log("🔍 Attempting to connect to MongoDB...");

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Basic test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to ESAM-ERP API",
    endpoints: {
      auth: "/api/auth",
      test: "/api/test",
    },
  });
});

// Start server - FIXED LINE
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Auth routes available at /api/auth`);
});

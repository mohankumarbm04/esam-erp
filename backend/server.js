// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const { initBackupScheduler } = require("./utils/backupScheduler");

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

// Ensure uploads directory exists and serve uploaded files (e.g. logo)
const uploadsDir = path.join(process.cwd(), "backend", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// ========== ROUTES ==========
app.use("/api/auth", require("./routes/auth"));
app.use("/api/departments", require("./routes/departments"));
app.use("/api/teachers", require("./routes/teachers"));
app.use("/api/students", require("./routes/students"));
app.use("/api/subjects", require("./routes/subjects"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/marks", require("./routes/marks"));
app.use("/api/hod", require("./routes/hod"));
app.use("/api/students", require("./routes/students"));
app.use("/api/parent", require("./routes/parent"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/fees", require("./routes/fees"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/admin/reports", require("./routes/adminReports"));
app.use("/api/admin/settings", require("./routes/settings"));

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/esam-erp";

console.log("🔍 Attempting to connect to MongoDB...");

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .then(async () => {
    try {
      await initBackupScheduler();
      console.log("✅ Backup scheduler initialized");
    } catch (e) {
      console.error("❌ Backup scheduler init error:", e.message);
    }
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Basic test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to ESAM-ERP API",
    endpoints: {
      auth: "/api/auth",
    },
  });
});

// Start server - FIXED LINE
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Auth routes available at /api/auth`);
});

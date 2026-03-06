// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// ========== MIDDLEWARE - THESE MUST COME FIRST ==========
app.use(cors());
app.use(express.json()); // ✅ Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// ========== ROUTES - THESE COME AFTER MIDDLEWARE ==========
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

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Auth routes available at /api/auth`);
});

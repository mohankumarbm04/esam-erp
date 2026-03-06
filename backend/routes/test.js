// backend/routes/test.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/create-user", async (req, res) => {
  try {
    console.log("📝 POST request received at /create-user");
    console.log("1️⃣ Creating new user object...");

    const newUser = new User({
      username: "testadmin",
      email: "admin@test.com",
      password: "password123",
      role: "admin",
    });

    console.log("2️⃣ User object created, attempting to save...");
    await newUser.save();
    console.log("3️⃣ User saved successfully!");

    res.json({
      success: true,
      message: "User created successfully!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("❌ ERROR in create-user:", error);
    console.error("❌ Error name:", error.name);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);

    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/users", async (req, res) => {
  try {
    console.log("📝 GET request received at /users");
    const users = await User.find().select("-password");
    console.log(`Found ${users.length} users`);

    res.json({
      success: true,
      count: users.length,
      users: users,
    });
  } catch (error) {
    console.error("Error in get users:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

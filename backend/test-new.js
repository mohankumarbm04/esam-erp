// backend/test-new.js
const mongoose = require("mongoose");
const User = require("./models/User-new");

async function testNew() {
  try {
    console.log("Connecting...");
    await mongoose.connect("mongodb://localhost:27017/esam-erp");
    console.log("Connected ✅");

    // Use timestamp to create unique username
    const uniqueId = Date.now();
    const user = new User({
      username: `new-test-${uniqueId}`,
      email: `new${uniqueId}@test.com`,
      password: "password123",
      role: "admin",
    });

    console.log("Saving...");
    await user.save();
    console.log("✅ SUCCESS! User saved with ID:", user._id);
    console.log("Username:", user.username);
  } catch (error) {
    console.error("ERROR:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected ✅");
  }
}

testNew();

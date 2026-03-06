// backend/test-direct.js
const mongoose = require("mongoose");
const User = require("./models/User");

async function testDirect() {
  try {
    console.log("1️⃣ Connecting to MongoDB...");
    await mongoose.connect("mongodb://localhost:27017/esam-erp");
    console.log("2️⃣ Connected to MongoDB ✅");

    console.log("3️⃣ Creating user directly...");
    const user = new User({
      username: "direct-test",
      email: "direct@test.com",
      password: "password123",
      role: "admin",
    });

    console.log("4️⃣ Saving user...");
    await user.save();
    console.log("5️⃣ User saved successfully! ✅");
    console.log("6️⃣ User:", user);
  } catch (error) {
    console.error("❌ ERROR:", error);
  } finally {
    console.log("7️⃣ Disconnecting from MongoDB...");
    await mongoose.disconnect();
    console.log("8️⃣ Disconnected ✅");
  }
}

testDirect();

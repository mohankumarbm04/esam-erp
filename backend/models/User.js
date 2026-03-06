// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["admin", "hod", "teacher", "student", "parent"],
      required: [true, "Role is required"],
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    studentId: {
      type: String,
      ref: "Student",
    },
    parentId: {
      type: String,
      ref: "Parent",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// ===== FIXED MIDDLEWARE =====
// Use UserSchema (not userSchema)
UserSchema.pre("save", async function () {
  console.log("🔐 Pre-save middleware running");

  if (this.isModified("password")) {
    console.log("🔑 Hashing password...");
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("✅ Password hashed successfully");
  } else {
    console.log("⏭️ Password not modified, skipping hash");
  }
});

// Compare password method - FIXED
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    console.log("🔍 Comparing password...");

    // Make sure this.password exists
    if (!this.password) {
      console.error("❌ No password stored for user");
      return false;
    }

    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log(`✅ Password match: ${isMatch}`);
    return isMatch;
  } catch (error) {
    console.error("❌ Error comparing password:", error);
    throw error;
  }
};

// Check if account is locked
UserSchema.methods.isLocked = function () {
  const locked = !!(this.lockUntil && this.lockUntil > Date.now());
  console.log(`🔒 Account locked: ${locked}`);
  return locked;
};

// Check login attempts and lock account if needed
UserSchema.methods.incLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  if (this.loginAttempts + 1 >= 5) {
    updates.$set = { lockUntil: Date.now() + 15 * 60 * 1000 };
  }

  return this.updateOne(updates);
};

// Use UserSchema (not userSchema)
const User = mongoose.model("User", UserSchema);
module.exports = User;

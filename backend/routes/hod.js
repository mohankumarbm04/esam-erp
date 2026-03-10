// backend/routes/hod.js
const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Department = require("../models/Department");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const { isHOD, isAdmin } = require("../middleware/rbac");

// @route   GET /api/hod/department
// @desc    Get HOD's department details
// @access  Private (HOD only)
router.get("/department", authMiddleware, isHOD, async (req, res) => {
  try {
    // Get HOD's department (assuming user has departmentId)
    const department = await Department.findOne({ hodId: req.user.id });

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json({ department });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// @route   GET /api/hod/stats
// @desc    Get department statistics
// @access  Private (HOD only)
router.get("/stats", authMiddleware, isHOD, async (req, res) => {
  try {
    const department = await Department.findOne({ hodId: req.user.id });

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const [teachers, students, subjects] = await Promise.all([
      Teacher.countDocuments({ departmentId: department._id }),
      Student.countDocuments({ departmentId: department._id }),
      Subject.countDocuments({ departmentId: department._id }),
    ]);

    const lowAttendance = 0;

    res.json({
      teachers,
      students,
      subjects,
      lowAttendance,
      pendingApprovals: 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// @route   GET /api/hod/teachers
// @desc    Get department teachers
// @access  Private (HOD only)
router.get("/teachers", authMiddleware, isHOD, async (req, res) => {
  try {
    const department = await Department.findOne({ hodId: req.user.id });

    const teachers = await Teacher.find({
      departmentId: department._id,
    }).populate("userId", "username email");

    res.json({ teachers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// @route   GET /api/hod/students
// @desc    Get department students
// @access  Private (HOD only)
router.get("/students", authMiddleware, isHOD, async (req, res) => {
  try {
    const department = await Department.findOne({ hodId: req.user.id });

    const students = await Student.find({ departmentId: department._id });

    res.json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================
// HOD USERS (Admin aliases required by spec)
// ============================================================

// @route   PUT /api/hod/:id
// @desc    Update HOD user account
// @access  Private (Admin only)
router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { username, email, password, isActive } = req.body;

    const hod = await User.findById(req.params.id);
    if (!hod || hod.role !== "hod") {
      return res.status(404).json({ error: "HOD not found" });
    }

    if (typeof username === "string") hod.username = username.trim();
    if (typeof email === "string") hod.email = email.toLowerCase().trim();
    if (typeof isActive === "boolean") hod.isActive = isActive;
    if (password) hod.password = password;

    await hod.save();

    const cleaned = await User.findById(hod._id).select("-password");
    res.json({ message: "HOD updated successfully", hod: cleaned });
  } catch (error) {
    console.error("❌ Error updating HOD:", error);
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/hod/:id
// @desc    Delete HOD user account (and unassign from departments)
// @access  Private (Admin only)
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const hod = await User.findById(req.params.id);
    if (!hod || hod.role !== "hod") {
      return res.status(404).json({ error: "HOD not found" });
    }

    await Department.updateMany(
      { hodId: hod._id },
      { $set: { hodId: null, hodName: null } },
    );

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "HOD deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting HOD:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

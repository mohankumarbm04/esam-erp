// backend/routes/hod.js
const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Department = require("../models/Department");
const authMiddleware = require("../middleware/auth");
const { isHOD } = require("../middleware/rbac");

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

    // Get low attendance count (you'll need to implement this)
    const lowAttendance = 0; // Placeholder

    res.json({
      teachers,
      students,
      subjects,
      lowAttendance,
      pendingApprovals: 0, // Placeholder
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

module.exports = router;

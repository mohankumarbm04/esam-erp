// backend/routes/parent.js
const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// @route   GET /api/parent/children
// @desc    Get all children linked to parent
// @access  Private (Parent only)
router.get("/children", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching children for parent:", req.user.id);

    // Find parent user
    const parent = await User.findById(req.user.id);
    if (!parent) {
      return res.status(404).json({
        success: false,
        error: "Parent not found",
      });
    }

    // Find students linked to this parent
    // This assumes you have a parentId field in Student model
    const students = await Student.find({ parentId: req.user.id }).populate(
      "departmentId",
      "name code",
    );

    res.json({
      success: true,
      children: students.map((s) => ({
        id: s._id,
        name: s.name,
        usn: s.usn,
        department: s.departmentId?.name,
        semester: s.semester,
        section: s.section,
        attendance: null,
        sgpa: null,
        cgpa: null,
        lastActive: null,
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching children:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/parent/alerts
// @desc    Get alerts for parent's children
// @access  Private (Parent only)
router.get("/alerts", authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      alerts: [],
    });
  } catch (error) {
    console.error("❌ Error fetching alerts:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/parent/notifications
// @desc    Get notifications for parent
// @access  Private (Parent only)
router.get("/notifications", authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      notifications: [],
    });
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/parent/child/:childId/attendance
// @desc    Get attendance for a specific child
// @access  Private (Parent only)
router.get("/child/:childId/attendance", authMiddleware, async (req, res) => {
  try {
    const { childId } = req.params;
    const { semester } = req.query;

    // Verify child belongs to this parent
    const student = await Student.findOne({
      _id: childId,
      parentId: req.user.id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    // Fetch attendance data
    // This would come from Attendance model

    res.json({
      success: true,
      attendance: [],
      summary: {
        overall: 85,
        present: 45,
        absent: 8,
        total: 53,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching child attendance:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/parent/child/:childId/marks
// @desc    Get marks for a specific child
// @access  Private (Parent only)
router.get("/child/:childId/marks", authMiddleware, async (req, res) => {
  try {
    const { childId } = req.params;
    const { semester } = req.query;

    // Verify child belongs to this parent
    const student = await Student.findOne({
      _id: childId,
      parentId: req.user.id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    res.json({
      success: true,
      marks: [],
      sgpa: 8.2,
    });
  } catch (error) {
    console.error("❌ Error fetching child marks:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

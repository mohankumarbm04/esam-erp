// backend/routes/subjects.js
const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const Department = require("../models/Department");
const Teacher = require("../models/Teacher");
const authMiddleware = require("../middleware/auth");
const { isAdmin, isHOD } = require("../middleware/rbac");

// @route   POST /api/subjects
// @desc    Create a new subject
// @access  Private (Admin or HOD)
router.post("/", authMiddleware, isHOD, async (req, res) => {
  try {
    console.log("📝 Creating new subject:", req.body);

    const {
      subjectCode,
      subjectName,
      departmentId,
      semester,
      credits,
      type,
      hoursPerWeek,
      internalMarks,
      externalMarks,
      totalMarks,
      isElective,
      syllabus,
    } = req.body;

    // Validation
    if (
      !subjectCode ||
      !subjectName ||
      !departmentId ||
      !semester ||
      !credits ||
      !type ||
      !hoursPerWeek
    ) {
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields",
      });
    }

    // Check if department exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(400).json({
        success: false,
        error: "Department not found",
      });
    }

    // Check if subject already exists
    const existingSubject = await Subject.findOne({
      $or: [{ subjectCode }, { subjectName, departmentId, semester }],
    });

    if (existingSubject) {
      return res.status(400).json({
        success: false,
        error:
          "Subject with this code already exists in this department and semester",
      });
    }

    // Create subject
    const subject = new Subject({
      subjectCode: subjectCode.toUpperCase(),
      subjectName,
      departmentId,
      semester,
      credits,
      type,
      hoursPerWeek,
      internalMarks: internalMarks || (type === "Lab" ? 50 : 50),
      externalMarks: externalMarks || (type === "Lab" ? 50 : 100),
      totalMarks: totalMarks || (type === "Lab" ? 100 : 150),
      isElective: isElective || false,
      syllabus: syllabus || "Not uploaded",
    });

    await subject.save();

    console.log("✅ Subject created:", subject.subjectCode);

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    console.error("❌ Error creating subject:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/subjects
// @desc    Get all subjects
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching all subjects");

    const subjects = await Subject.find()
      .populate("departmentId", "name code")
      .populate("teachers", "name")
      .sort({ semester: 1, subjectCode: 1 });

    console.log(`✅ Found ${subjects.length} subjects`);

    res.json({
      success: true,
      count: subjects.length,
      subjects,
    });
  } catch (error) {
    console.error("❌ Error fetching subjects:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/subjects/department/:deptId
// @desc    Get subjects by department
// @access  Private
router.get("/department/:deptId", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching subjects for department:", req.params.deptId);

    const subjects = await Subject.find({
      departmentId: req.params.deptId,
      isActive: true,
    })
      .populate("departmentId", "name code")
      .populate("teachers", "name")
      .sort({ semester: 1, subjectCode: 1 });

    res.json({
      success: true,
      count: subjects.length,
      subjects,
    });
  } catch (error) {
    console.error("❌ Error fetching subjects by department:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/subjects/semester/:sem
// @desc    Get subjects by semester
// @access  Private
router.get("/semester/:sem", authMiddleware, async (req, res) => {
  try {
    const semester = parseInt(req.params.sem);

    if (semester < 1 || semester > 8) {
      return res.status(400).json({
        success: false,
        error: "Invalid semester. Must be between 1 and 8",
      });
    }

    const subjects = await Subject.find({
      semester,
      isActive: true,
    })
      .populate("departmentId", "name code")
      .populate("teachers", "name");

    res.json({
      success: true,
      count: subjects.length,
      subjects,
    });
  } catch (error) {
    console.error("❌ Error fetching subjects by semester:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/subjects/:id
// @desc    Get single subject by ID or code
// @access  Private
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching subject:", req.params.id);

    let subject;
    if (
      req.params.id.length === 24 &&
      /^[0-9a-fA-F]{24}$/.test(req.params.id)
    ) {
      subject = await Subject.findById(req.params.id)
        .populate("departmentId", "name code")
        .populate("teachers", "name email");
    } else {
      subject = await Subject.findOne({
        subjectCode: req.params.id.toUpperCase(),
      })
        .populate("departmentId", "name code")
        .populate("teachers", "name email");
    }

    if (!subject) {
      return res.status(404).json({
        success: false,
        error: "Subject not found",
      });
    }

    res.json({
      success: true,
      subject,
    });
  } catch (error) {
    console.error("❌ Error fetching subject:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   PUT /api/subjects/:id
// @desc    Update subject
// @access  Private (Admin only)
router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    console.log("📝 Updating subject:", req.params.id);

    let subject;
    if (
      req.params.id.length === 24 &&
      /^[0-9a-fA-F]{24}$/.test(req.params.id)
    ) {
      subject = await Subject.findById(req.params.id);
    } else {
      subject = await Subject.findOne({
        subjectCode: req.params.id.toUpperCase(),
      });
    }

    if (!subject) {
      return res.status(404).json({
        success: false,
        error: "Subject not found",
      });
    }

    // Update fields
    const updates = [
      "subjectName",
      "credits",
      "hoursPerWeek",
      "syllabus",
      "isActive",
      "teachers",
    ];

    updates.forEach((field) => {
      if (req.body[field] !== undefined) {
        subject[field] = req.body[field];
      }
    });

    await subject.save();

    console.log("✅ Subject updated:", subject.subjectCode);

    res.json({
      success: true,
      message: "Subject updated successfully",
      subject,
    });
  } catch (error) {
    console.error("❌ Error updating subject:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   DELETE /api/subjects/:id
// @desc    Delete subject
// @access  Private (Admin only)
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    console.log("🗑️ Deleting subject:", req.params.id);

    let subject;
    if (
      req.params.id.length === 24 &&
      /^[0-9a-fA-F]{24}$/.test(req.params.id)
    ) {
      subject = await Subject.findById(req.params.id);
    } else {
      subject = await Subject.findOne({
        subjectCode: req.params.id.toUpperCase(),
      });
    }

    if (!subject) {
      return res.status(404).json({ success: false, error: "Subject not found" });
    }

    await Subject.deleteOne({ _id: subject._id });
    res.json({ success: true, message: "Subject deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting subject:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/subjects/:id/assign-teacher
// @desc    Assign teacher to subject
// @access  Private (Admin or HOD)
router.post("/:id/assign-teacher", authMiddleware, isHOD, async (req, res) => {
  try {
    const { teacherId } = req.body;

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        error: "Please provide teacher ID",
      });
    }

    // Check if teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: "Teacher not found",
      });
    }

    let subject;
    if (
      req.params.id.length === 24 &&
      /^[0-9a-fA-F]{24}$/.test(req.params.id)
    ) {
      subject = await Subject.findById(req.params.id);
    } else {
      subject = await Subject.findOne({
        subjectCode: req.params.id.toUpperCase(),
      });
    }

    if (!subject) {
      return res.status(404).json({
        success: false,
        error: "Subject not found",
      });
    }

    // Add teacher if not already assigned
    if (!subject.teachers.includes(teacherId)) {
      subject.teachers.push(teacherId);
      await subject.save();
    }

    res.json({
      success: true,
      message: "Teacher assigned to subject successfully",
      subject,
    });
  } catch (error) {
    console.error("❌ Error assigning teacher:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

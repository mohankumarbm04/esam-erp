// backend/routes/marks.js
const express = require("express");
const router = express.Router();
const Marks = require("../models/Marks");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const SGPACalculator = require("../utils/sgpaCalculator");
const authMiddleware = require("../middleware/auth");
const { isTeacher, isHOD, isAdmin } = require("../middleware/rbac");
// SIMPLE TEST ROUTE - ADD THIS
router.get("/ping", (req, res) => {
  console.log("🏓 Ping route hit!");
  res.json({ message: "Marks route is working!" });
});

// @route   POST /api/marks
// @desc    Enter or update marks for a student
// @access  Private (Teacher only)
router.post("/", authMiddleware, isTeacher, async (req, res) => {
  console.log("🔥🔥🔥 POST /marks route HIT!");
  console.log("🔍 req.user:", req.user);
  console.log("🔍 req.body:", req.body);
  try {
    console.log("📝 Entering marks:", req.body);

    const {
      studentId,
      subjectId,
      semester,
      ia1,
      ia2,
      ia3,
      labInternal,
      semesterExam,
      remarks,
    } = req.body;

    // Validation
    if (!studentId || !subjectId || !semester) {
      return res.status(400).json({
        success: false,
        error: "Please provide student ID, subject ID and semester",
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    // Check if subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        error: "Subject not found",
      });
    }

    // Find existing marks or create new
    let marks = await Marks.findOne({
      studentId,
      subjectId,
      semester,
    });

    if (marks) {
      // Update existing
      if (ia1 !== undefined) marks.ia1 = ia1;
      if (ia2 !== undefined) marks.ia2 = ia2;
      if (ia3 !== undefined) marks.ia3 = ia3;
      if (labInternal !== undefined) marks.labInternal = labInternal;
      if (semesterExam !== undefined) marks.semesterExam = semesterExam;
      if (remarks !== undefined) marks.remarks = remarks;
      marks.updatedBy = req.user.id;
    } else {
      // Create new
      marks = new Marks({
        studentId,
        subjectId,
        semester,
        ia1,
        ia2,
        ia3,
        labInternal,
        semesterExam,
        remarks,
        updatedBy: req.user.id,
      });
    }

    // Save (triggers auto-calculation)
    await marks.save();

    console.log("✅ Marks saved for student:", student.usn);

    res.json({
      success: true,
      message: "Marks saved successfully",
      marks,
    });
  } catch (error) {
    console.error("❌ Error saving marks:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/marks/student/:studentId
// @desc    Get marks for a student
// @access  Private
router.get("/student/:studentId", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching marks for student:", req.params.studentId);

    const { semester } = req.query;

    // Build query
    const query = { studentId: req.params.studentId };
    if (semester) query.semester = parseInt(semester);

    const marks = await Marks.find(query)
      .populate("subjectId", "subjectCode subjectName credits type")
      .populate("updatedBy", "username")
      .sort({ semester: 1, "subjectId.subjectCode": 1 });

    // Calculate SGPA if semester provided
    let sgpa = null;
    if (semester) {
      sgpa = await SGPACalculator.calculateSGPA(
        req.params.studentId,
        parseInt(semester),
      );
    }

    res.json({
      success: true,
      count: marks.length,
      marks,
      sgpa,
    });
  } catch (error) {
    console.error("❌ Error fetching marks:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/marks/subject/:subjectId
// @desc    Get marks for a subject (all students)
// @access  Private (Teacher, HOD, Admin)
router.get(
  "/subject/:subjectId",
  authMiddleware,
  isTeacher,
  async (req, res) => {
    try {
      console.log("📝 Fetching marks for subject:", req.params.subjectId);

      const { semester } = req.query;

      // Build query
      const query = { subjectId: req.params.subjectId };
      if (semester) query.semester = parseInt(semester);

      const marks = await Marks.find(query)
        .populate("studentId", "usn name semester section")
        .populate("subjectId", "subjectCode subjectName")
        .sort({ "studentId.usn": 1 });

      res.json({
        success: true,
        count: marks.length,
        marks,
      });
    } catch (error) {
      console.error("❌ Error fetching marks:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

// @route   GET /api/marks/sgpa/:studentId
// @desc    Calculate SGPA for a student
// @access  Private
router.get("/sgpa/:studentId", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Calculating SGPA for student:", req.params.studentId);

    const { semester } = req.query;

    if (!semester) {
      return res.status(400).json({
        success: false,
        error: "Please provide semester",
      });
    }

    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    const sgpaData = await SGPACalculator.calculateSGPA(
      req.params.studentId,
      parseInt(semester),
    );

    res.json({
      success: true,
      student: {
        id: student._id,
        usn: student.usn,
        name: student.name,
        semester: parseInt(semester),
      },
      sgpa: sgpaData,
    });
  } catch (error) {
    console.error("❌ Error calculating SGPA:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/marks/cgpa/:studentId
// @desc    Calculate CGPA for a student
// @access  Private
router.get("/cgpa/:studentId", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Calculating CGPA for student:", req.params.studentId);

    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    const cgpaData = await SGPACalculator.calculateCGPA(req.params.studentId);

    res.json({
      success: true,
      student: {
        id: student._id,
        usn: student.usn,
        name: student.name,
      },
      cgpa: cgpaData,
    });
  } catch (error) {
    console.error("❌ Error calculating CGPA:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/marks/transcript/:studentId
// @desc    Get complete transcript for a student
// @access  Private (Student, Parent, HOD, Admin)
router.get("/transcript/:studentId", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Generating transcript for student:", req.params.studentId);

    const student = await Student.findById(req.params.studentId).populate(
      "departmentId",
      "name code",
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    const transcript = await SGPACalculator.getTranscript(req.params.studentId);

    res.json({
      success: true,
      student: {
        id: student._id,
        usn: student.usn,
        name: student.name,
        department: student.departmentId,
        batch: student.admissionYear,
      },
      transcript,
    });
  } catch (error) {
    console.error("❌ Error generating transcript:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

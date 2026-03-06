// backend/routes/students.js
const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Department = require("../models/Department");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const { isAdmin, isHOD, isTeacher } = require("../middleware/rbac");

// @route   POST /api/students
// @desc    Create a new student
// @access  Private (Admin or HOD)
router.post("/", authMiddleware, isHOD, async (req, res) => {
  try {
    console.log("📝 Creating new student:", req.body);

    const {
      usn,
      name,
      email,
      phone,
      dob,
      gender,
      bloodGroup,
      departmentId,
      semester,
      section,
      admissionYear,
      parentName,
      parentPhone,
      parentEmail,
      address,
    } = req.body;

    // Validation
    if (
      !usn ||
      !name ||
      !email ||
      !phone ||
      !dob ||
      !gender ||
      !departmentId ||
      !semester ||
      !section ||
      !admissionYear ||
      !parentName ||
      !parentPhone
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

    // Check if student already exists
    const existingStudent = await Student.findOne({
      $or: [{ usn }, { email }],
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        error: "Student with this USN or email already exists",
      });
    }

    // Create student
    const student = new Student({
      usn: usn.toUpperCase(),
      name,
      email,
      phone,
      dob,
      gender,
      bloodGroup,
      departmentId,
      semester,
      section,
      admissionYear,
      parentName,
      parentPhone,
      parentEmail,
      address: address || {},
    });

    await student.save();

    // Update department student count
    department.totalStudents += 1;
    await department.save();

    console.log("✅ Student created:", student.name, student.usn);

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student,
    });
  } catch (error) {
    console.error("❌ Error creating student:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/students
// @desc    Get all students
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching all students");

    const students = await Student.find()
      .populate("departmentId", "name code")
      .sort({ usn: 1 });

    console.log(`✅ Found ${students.length} students`);

    res.json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/students/department/:deptId
// @desc    Get students by department
// @access  Private
router.get("/department/:deptId", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching students for department:", req.params.deptId);

    const students = await Student.find({
      departmentId: req.params.deptId,
      isActive: true,
    }).populate("departmentId", "name code");

    res.json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("❌ Error fetching students by department:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/students/semester/:sem
// @desc    Get students by semester
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

    const students = await Student.find({
      semester,
      isActive: true,
    }).populate("departmentId", "name code");

    res.json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("❌ Error fetching students by semester:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/students/:id
// @desc    Get single student by ID or USN
// @access  Private
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching student:", req.params.id);

    // Check if param is USN or MongoDB ID
    let student;
    if (
      req.params.id.length === 24 &&
      /^[0-9a-fA-F]{24}$/.test(req.params.id)
    ) {
      student = await Student.findById(req.params.id)
        .populate("departmentId", "name code")
        .populate("userId", "username email");
    } else {
      student = await Student.findOne({ usn: req.params.id.toUpperCase() })
        .populate("departmentId", "name code")
        .populate("userId", "username email");
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    res.json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("❌ Error fetching student:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private (Admin, HOD, or Teacher)
router.put("/:id", authMiddleware, isTeacher, async (req, res) => {
  try {
    console.log("📝 Updating student:", req.params.id);

    let student;
    if (
      req.params.id.length === 24 &&
      /^[0-9a-fA-F]{24}$/.test(req.params.id)
    ) {
      student = await Student.findById(req.params.id);
    } else {
      student = await Student.findOne({ usn: req.params.id.toUpperCase() });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    // Update fields (only allowed fields)
    const updates = [
      "name",
      "phone",
      "bloodGroup",
      "semester",
      "section",
      "address",
      "parentPhone",
      "parentEmail",
      "isActive",
    ];

    updates.forEach((field) => {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field];
      }
    });

    await student.save();

    console.log("✅ Student updated:", student.name);

    res.json({
      success: true,
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    console.error("❌ Error updating student:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   POST /api/students/:id/assign-user
// @desc    Assign user account to student
// @access  Private (Admin only)
router.post("/:id/assign-user", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "Please provide user ID",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    let student;
    if (
      req.params.id.length === 24 &&
      /^[0-9a-fA-F]{24}$/.test(req.params.id)
    ) {
      student = await Student.findById(req.params.id);
    } else {
      student = await Student.findOne({ usn: req.params.id.toUpperCase() });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    student.userId = userId;
    await student.save();

    res.json({
      success: true,
      message: "User assigned to student successfully",
      student,
    });
  } catch (error) {
    console.error("❌ Error assigning user:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

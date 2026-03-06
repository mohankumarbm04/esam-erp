// backend/routes/teachers.js
const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");
const Department = require("../models/Department");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const { isAdmin, isHOD } = require("../middleware/rbac");

// @route   POST /api/teachers
// @desc    Create a new teacher
// @access  Private (Admin only)
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    console.log("📝 Creating new teacher:", req.body);

    const {
      teacherId,
      name,
      email,
      phone,
      departmentId,
      designation,
      qualification,
      specialization,
      experience,
      joiningDate,
      address,
    } = req.body;

    // Validation
    if (
      !teacherId ||
      !name ||
      !email ||
      !phone ||
      !departmentId ||
      !designation
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

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({
      $or: [{ teacherId }, { email }],
    });

    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        error: "Teacher with this ID or email already exists",
      });
    }

    // Create teacher
    const teacher = new Teacher({
      teacherId,
      name,
      email,
      phone,
      departmentId,
      designation,
      qualification,
      specialization,
      experience: experience || 0,
      joiningDate: joiningDate || Date.now(),
      address: address || {},
    });

    await teacher.save();

    // Update department teacher count
    department.totalTeachers += 1;
    await department.save();

    console.log("✅ Teacher created:", teacher.name);

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      teacher,
    });
  } catch (error) {
    console.error("❌ Error creating teacher:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/teachers
// @desc    Get all teachers
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching all teachers");

    const teachers = await Teacher.find()
      .populate("departmentId", "name code")
      .sort({ name: 1 });

    console.log(`✅ Found ${teachers.length} teachers`);

    res.json({
      success: true,
      count: teachers.length,
      teachers,
    });
  } catch (error) {
    console.error("❌ Error fetching teachers:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/teachers/department/:deptId
// @desc    Get teachers by department
// @access  Private
router.get("/department/:deptId", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching teachers for department:", req.params.deptId);

    const teachers = await Teacher.find({
      departmentId: req.params.deptId,
      isActive: true,
    }).populate("departmentId", "name code");

    res.json({
      success: true,
      count: teachers.length,
      teachers,
    });
  } catch (error) {
    console.error("❌ Error fetching teachers by department:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/teachers/:id
// @desc    Get single teacher by ID
// @access  Private
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching teacher:", req.params.id);

    const teacher = await Teacher.findById(req.params.id)
      .populate("departmentId", "name code")
      .populate("userId", "username email");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: "Teacher not found",
      });
    }

    res.json({
      success: true,
      teacher,
    });
  } catch (error) {
    console.error("❌ Error fetching teacher:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   PUT /api/teachers/:id
// @desc    Update teacher
// @access  Private (Admin or HOD)
router.put("/:id", authMiddleware, isHOD, async (req, res) => {
  try {
    console.log("📝 Updating teacher:", req.params.id);

    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: "Teacher not found",
      });
    }

    // Update fields
    const updates = [
      "name",
      "phone",
      "designation",
      "qualification",
      "specialization",
      "experience",
      "address",
      "isActive",
    ];

    updates.forEach((field) => {
      if (req.body[field] !== undefined) {
        teacher[field] = req.body[field];
      }
    });

    await teacher.save();

    console.log("✅ Teacher updated:", teacher.name);

    res.json({
      success: true,
      message: "Teacher updated successfully",
      teacher,
    });
  } catch (error) {
    console.error("❌ Error updating teacher:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   POST /api/teachers/:id/assign-user
// @desc    Assign user account to teacher
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

    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: "Teacher not found",
      });
    }

    teacher.userId = userId;
    await teacher.save();

    res.json({
      success: true,
      message: "User assigned to teacher successfully",
      teacher,
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

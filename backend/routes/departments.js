// backend/routes/departments.js
const express = require("express");
const router = express.Router();
const Department = require("../models/Department");
const authMiddleware = require("../middleware/auth");
const { isAdmin, isHOD } = require("../middleware/rbac");

// @route   POST /api/departments
// @desc    Create a new department
// @access  Private (Admin only)
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    console.log("📝 Creating new department:", req.body);

    const { name, code, description, establishedYear } = req.body;

    // Validation
    if (!name || !code) {
      return res.status(400).json({
        success: false,
        error: "Please provide department name and code",
      });
    }

    // Check if department already exists
    const existingDept = await Department.findOne({
      $or: [{ name }, { code }],
    });

    if (existingDept) {
      return res.status(400).json({
        success: false,
        error: "Department with this name or code already exists",
      });
    }

    // Create department
    const department = new Department({
      name,
      code: code.toUpperCase(),
      description,
      establishedYear,
    });

    await department.save();

    console.log("✅ Department created:", department.name);

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    console.error("❌ Error creating department:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/departments
// @desc    Get all departments
// @access  Private (Admin, HOD, Teacher)
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching all departments");

    const departments = await Department.find()
      .sort({ name: 1 })
      .select("-__v");

    console.log(`✅ Found ${departments.length} departments`);

    res.json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    console.error("❌ Error fetching departments:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/departments/:id
// @desc    Get single department by ID
// @access  Private
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching department:", req.params.id);

    const department = await Department.findById(req.params.id).select("-__v");

    if (!department) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }

    res.json({
      success: true,
      department,
    });
  } catch (error) {
    console.error("❌ Error fetching department:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   PUT /api/departments/:id
// @desc    Update department
// @access  Private (Admin only)
router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    console.log("📝 Updating department:", req.params.id);

    const {
      name,
      code,
      description,
      establishedYear,
      hodId,
      hodName,
      isActive,
    } = req.body;

    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }

    // Update fields
    if (name) department.name = name;
    if (code) department.code = code.toUpperCase();
    if (description !== undefined) department.description = description;
    if (establishedYear) department.establishedYear = establishedYear;
    if (hodId) department.hodId = hodId;
    if (hodName) department.hodName = hodName;
    if (isActive !== undefined) department.isActive = isActive;

    await department.save();

    console.log("✅ Department updated:", department.name);

    res.json({
      success: true,
      message: "Department updated successfully",
      department,
    });
  } catch (error) {
    console.error("❌ Error updating department:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   DELETE /api/departments/:id
// @desc    Delete department
// @access  Private (Admin only)
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    console.log("📝 Deleting department:", req.params.id);

    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }

    // Soft delete - just mark as inactive
    department.isActive = false;
    await department.save();

    // Or hard delete - uncomment to actually remove
    // await Department.findByIdAndDelete(req.params.id);

    console.log("✅ Department deactivated:", department.name);

    res.json({
      success: true,
      message: "Department deactivated successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting department:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   POST /api/departments/:id/assign-hod
// @desc    Assign HOD to department
// @access  Private (Admin only)
router.post("/:id/assign-hod", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { hodId, hodName } = req.body;

    if (!hodId || !hodName) {
      return res.status(400).json({
        success: false,
        error: "Please provide HOD ID and name",
      });
    }

    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }

    department.hodId = hodId;
    department.hodName = hodName;
    await department.save();

    res.json({
      success: true,
      message: "HOD assigned successfully",
      department,
    });
  } catch (error) {
    console.error("❌ Error assigning HOD:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

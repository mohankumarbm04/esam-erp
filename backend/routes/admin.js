const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Department = require("../models/Department");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const User = require("../models/User");
const { isAdmin } = require("../middleware/rbac");

console.log("🟢 Loading admin routes...");

// Apply auth to all routes
router.use(auth);
console.log("✅ Auth middleware applied to admin routes");

// Admin-only for all /api/admin/*
router.use(isAdmin);

// @route   GET /api/admin/departments
router.get("/departments", async (req, res) => {
  console.log("\n📋 ===== DEPARTMENTS API =====");
  console.log("👤 User from auth:", req.user);

  try {
    // Get departments from database
    const departments = await Department.find()
      .populate("hodId", "name email")
      .sort({ name: 1 });

    console.log(`✅ Found ${departments.length} departments in database`);

    res.json({ departments });
  } catch (error) {
    console.error("❌ Error fetching departments:", error);
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/admin/departments
router.post("/departments", async (req, res) => {
  console.log("\n📝 ===== CREATE DEPARTMENT =====");
  console.log("📦 Request body:", req.body);

  try {
    // Validate required fields
    if (!req.body.name || !req.body.code) {
      return res.status(400).json({
        error: "Name and code are required",
      });
    }

    // Check if department with same code already exists
    const existingDept = await Department.findOne({
      code: req.body.code.toUpperCase(),
    });

    if (existingDept) {
      return res.status(400).json({
        error: "Department with this code already exists",
      });
    }

    // Create new department in database
    const newDepartment = new Department({
      name: req.body.name,
      code: req.body.code.toUpperCase(),
      description: req.body.description || "",
      establishedYear: req.body.establishedYear || new Date().getFullYear(),
      hodName: req.body.hodName || "Not Assigned",
      hodId: req.body.hodId || null,
      totalStudents: 0,
      totalTeachers: 0,
      totalClasses: 0,
      isActive: true,
    });

    const savedDepartment = await newDepartment.save();
    console.log("✅ Department saved to database:", savedDepartment);

    res.status(201).json({
      message: "Department created successfully",
      department: savedDepartment,
    });
  } catch (error) {
    console.error("❌ Error creating department:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: messages.join(", ") });
    }

    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/admin/departments/:id
router.put("/departments/:id", async (req, res) => {
  console.log("\n📝 ===== UPDATE DEPARTMENT =====");
  console.log("📦 ID:", req.params.id);
  console.log("📦 Body:", req.body);

  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        code: req.body.code?.toUpperCase(),
        description: req.body.description,
        establishedYear: req.body.establishedYear,
        hodName: req.body.hodName || "Not Assigned",
        hodId: req.body.hodId || null,
        isActive: req.body.isActive,
      },
      { new: true, runValidators: true },
    ).populate("hodId", "name email");

    if (!updatedDepartment) {
      return res.status(404).json({ error: "Department not found" });
    }

    console.log("✅ Department updated:", updatedDepartment);
    res.json({
      message: "Department updated successfully",
      department: updatedDepartment,
    });
  } catch (error) {
    console.error("❌ Error updating department:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: messages.join(", ") });
    }

    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/admin/departments/:id
router.delete("/departments/:id", async (req, res) => {
  console.log("\n🗑️ ===== DELETE DEPARTMENT =====");
  console.log("📦 ID:", req.params.id);

  try {
    const deletedDepartment = await Department.findByIdAndDelete(req.params.id);

    if (!deletedDepartment) {
      return res.status(404).json({ error: "Department not found" });
    }

    console.log("✅ Department deleted:", deletedDepartment);
    res.json({
      message: "Department deleted successfully",
      department: deletedDepartment,
    });
  } catch (error) {
    console.error("❌ Error deleting department:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// TEACHERS (Admin)
// ============================================================

router.get("/teachers", async (req, res) => {
  try {
    const teachers = await Teacher.find({ isActive: { $ne: false } })
      .populate("departmentId", "name code")
      .sort({ name: 1 });

    res.json({ success: true, teachers });
  } catch (error) {
    console.error("❌ Error fetching teachers:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/teachers", async (req, res) => {
  try {
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

    if (
      !teacherId ||
      !name ||
      !email ||
      !phone ||
      !departmentId ||
      !designation ||
      !qualification ||
      !specialization ||
      !joiningDate
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide all required fields" });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res
        .status(400)
        .json({ success: false, error: "Department not found" });
    }

    const existing = await Teacher.findOne({
      $or: [{ teacherId }, { email: String(email).toLowerCase() }],
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Teacher with this ID or email already exists",
      });
    }

    const teacher = new Teacher({
      teacherId: String(teacherId).trim(),
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      phone: String(phone).trim(),
      departmentId,
      designation,
      qualification,
      specialization,
      experience: experience ? Number(experience) : 0,
      joiningDate,
      address: address || {},
      isActive: true,
    });

    await teacher.save();

    department.totalTeachers = Math.max(0, (department.totalTeachers || 0) + 1);
    await department.save();

    const populated = await Teacher.findById(teacher._id).populate(
      "departmentId",
      "name code",
    );

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      teacher: populated,
    });
  } catch (error) {
    console.error("❌ Error creating teacher:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put("/teachers/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, error: "Teacher not found" });
    }

    const oldDeptId = teacher.departmentId?.toString();
    const nextDeptId =
      req.body.departmentId !== undefined ? String(req.body.departmentId) : null;

    const updatable = [
      "teacherId",
      "name",
      "email",
      "phone",
      "designation",
      "qualification",
      "specialization",
      "experience",
      "joiningDate",
      "address",
      "isActive",
    ];

    updatable.forEach((field) => {
      if (req.body[field] !== undefined) teacher[field] = req.body[field];
    });

    if (nextDeptId && nextDeptId !== oldDeptId) {
      const newDept = await Department.findById(nextDeptId);
      if (!newDept) {
        return res
          .status(400)
          .json({ success: false, error: "Department not found" });
      }
      teacher.departmentId = nextDeptId;

      const [oldDept] = await Promise.all([
        oldDeptId ? Department.findById(oldDeptId) : null,
      ]);
      if (oldDept) {
        oldDept.totalTeachers = Math.max(0, (oldDept.totalTeachers || 0) - 1);
        await oldDept.save();
      }
      newDept.totalTeachers = Math.max(0, (newDept.totalTeachers || 0) + 1);
      await newDept.save();
    }

    await teacher.save();

    const populated = await Teacher.findById(teacher._id).populate(
      "departmentId",
      "name code",
    );

    res.json({
      success: true,
      message: "Teacher updated successfully",
      teacher: populated,
    });
  } catch (error) {
    console.error("❌ Error updating teacher:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/teachers/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, error: "Teacher not found" });
    }

    const deptId = teacher.departmentId?.toString();
    await Teacher.findByIdAndDelete(req.params.id);

    if (deptId) {
      const dept = await Department.findById(deptId);
      if (dept) {
        dept.totalTeachers = Math.max(0, (dept.totalTeachers || 0) - 1);
        await dept.save();
      }
    }

    res.json({ success: true, message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting teacher:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// STUDENTS (Admin)
// ============================================================

router.get("/students", async (req, res) => {
  try {
    const students = await Student.find({ isActive: { $ne: false } })
      .populate("departmentId", "name code")
      .sort({ usn: 1 });

    res.json({ success: true, students });
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/students", async (req, res) => {
  try {
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
      return res
        .status(400)
        .json({ success: false, error: "Please provide all required fields" });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res
        .status(400)
        .json({ success: false, error: "Department not found" });
    }

    const existing = await Student.findOne({
      $or: [{ usn: String(usn).toUpperCase() }, { email: String(email).toLowerCase() }],
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Student with this USN or email already exists",
      });
    }

    const student = new Student({
      usn: String(usn).toUpperCase().trim(),
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      phone: String(phone).trim(),
      dob,
      gender,
      bloodGroup,
      departmentId,
      semester: Number(semester),
      section,
      admissionYear: Number(admissionYear),
      parentName,
      parentPhone,
      parentEmail,
      address: address || {},
      isActive: true,
    });

    await student.save();

    department.totalStudents = Math.max(0, (department.totalStudents || 0) + 1);
    await department.save();

    const populated = await Student.findById(student._id).populate(
      "departmentId",
      "name code",
    );

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student: populated,
    });
  } catch (error) {
    console.error("❌ Error creating student:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put("/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, error: "Student not found" });
    }

    const oldDeptId = student.departmentId?.toString();
    const nextDeptId =
      req.body.departmentId !== undefined ? String(req.body.departmentId) : null;

    const updatable = [
      "usn",
      "name",
      "email",
      "phone",
      "dob",
      "gender",
      "bloodGroup",
      "semester",
      "section",
      "admissionYear",
      "parentName",
      "parentPhone",
      "parentEmail",
      "address",
      "isActive",
    ];

    updatable.forEach((field) => {
      if (req.body[field] !== undefined) student[field] = req.body[field];
    });

    if (nextDeptId && nextDeptId !== oldDeptId) {
      const newDept = await Department.findById(nextDeptId);
      if (!newDept) {
        return res
          .status(400)
          .json({ success: false, error: "Department not found" });
      }
      student.departmentId = nextDeptId;

      const oldDept = oldDeptId ? await Department.findById(oldDeptId) : null;
      if (oldDept) {
        oldDept.totalStudents = Math.max(0, (oldDept.totalStudents || 0) - 1);
        await oldDept.save();
      }
      newDept.totalStudents = Math.max(0, (newDept.totalStudents || 0) + 1);
      await newDept.save();
    }

    await student.save();

    const populated = await Student.findById(student._id).populate(
      "departmentId",
      "name code",
    );

    res.json({
      success: true,
      message: "Student updated successfully",
      student: populated,
    });
  } catch (error) {
    console.error("❌ Error updating student:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, error: "Student not found" });
    }

    const deptId = student.departmentId?.toString();
    await Student.findByIdAndDelete(req.params.id);

    if (deptId) {
      const dept = await Department.findById(deptId);
      if (dept) {
        dept.totalStudents = Math.max(0, (dept.totalStudents || 0) - 1);
        await dept.save();
      }
    }

    res.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting student:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// SUBJECTS (Admin)
// ============================================================

router.get("/subjects", async (req, res) => {
  try {
    const subjects = await Subject.find({ isActive: { $ne: false } })
      .populate("departmentId", "name code")
      .populate("teachers", "name")
      .sort({ semester: 1, subjectCode: 1 });

    res.json({ success: true, subjects });
  } catch (error) {
    console.error("❌ Error fetching subjects:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/subjects", async (req, res) => {
  try {
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
      teacherIds = [],
    } = req.body;

    if (
      !subjectCode ||
      !subjectName ||
      !departmentId ||
      !semester ||
      !credits ||
      !type ||
      !hoursPerWeek
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide all required fields" });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res
        .status(400)
        .json({ success: false, error: "Department not found" });
    }

    const existing = await Subject.findOne({
      $or: [
        { subjectCode: String(subjectCode).toUpperCase() },
        { subjectName, departmentId, semester: Number(semester) },
      ],
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        error:
          "Subject with this code already exists in this department and semester",
      });
    }

    const teacherObjectIds = Array.isArray(teacherIds)
      ? teacherIds.filter(Boolean)
      : [];

    const subject = new Subject({
      subjectCode: String(subjectCode).toUpperCase().trim(),
      subjectName: String(subjectName).trim(),
      departmentId,
      semester: Number(semester),
      credits: Number(credits),
      type,
      hoursPerWeek: Number(hoursPerWeek),
      internalMarks: internalMarks !== undefined ? Number(internalMarks) : 50,
      externalMarks: externalMarks !== undefined ? Number(externalMarks) : 100,
      totalMarks: totalMarks !== undefined ? Number(totalMarks) : 150,
      isElective: !!isElective,
      syllabus: syllabus || "Not uploaded",
      teachers: teacherObjectIds,
      isActive: true,
    });

    await subject.save();

    const populated = await Subject.findById(subject._id)
      .populate("departmentId", "name code")
      .populate("teachers", "name");

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      subject: populated,
    });
  } catch (error) {
    console.error("❌ Error creating subject:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put("/subjects/:id", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res
        .status(404)
        .json({ success: false, error: "Subject not found" });
    }

    const oldDeptId = subject.departmentId?.toString();
    const nextDeptId =
      req.body.departmentId !== undefined ? String(req.body.departmentId) : null;

    const updatable = [
      "subjectCode",
      "subjectName",
      "semester",
      "credits",
      "type",
      "hoursPerWeek",
      "internalMarks",
      "externalMarks",
      "totalMarks",
      "isElective",
      "syllabus",
      "isActive",
    ];

    updatable.forEach((field) => {
      if (req.body[field] !== undefined) subject[field] = req.body[field];
    });

    if (req.body.teacherIds !== undefined) {
      subject.teachers = Array.isArray(req.body.teacherIds)
        ? req.body.teacherIds.filter(Boolean)
        : [];
    }

    if (nextDeptId && nextDeptId !== oldDeptId) {
      const newDept = await Department.findById(nextDeptId);
      if (!newDept) {
        return res
          .status(400)
          .json({ success: false, error: "Department not found" });
      }
      subject.departmentId = nextDeptId;
    }

    if (subject.subjectCode) {
      subject.subjectCode = String(subject.subjectCode).toUpperCase().trim();
    }

    await subject.save();

    const populated = await Subject.findById(subject._id)
      .populate("departmentId", "name code")
      .populate("teachers", "name");

    res.json({
      success: true,
      message: "Subject updated successfully",
      subject: populated,
    });
  } catch (error) {
    console.error("❌ Error updating subject:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/subjects/:id", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res
        .status(404)
        .json({ success: false, error: "Subject not found" });
    }
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Subject deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting subject:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// HOD Users (Admin) - list/manage
// ============================================================

router.get("/hods", async (req, res) => {
  try {
    const hods = await User.find({ role: "hod", isActive: { $ne: false } })
      .select("-password")
      .sort({ username: 1 });
    res.json({ success: true, hods });
  } catch (error) {
    console.error("❌ Error fetching HODs:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/hods", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide username, email and password",
      });
    }

    const existing = await User.findOne({
      $or: [{ username }, { email: String(email).toLowerCase() }],
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "User already exists with this email or username",
      });
    }

    const user = new User({
      username: String(username).trim(),
      email: String(email).toLowerCase().trim(),
      password,
      role: "hod",
      isActive: true,
    });
    await user.save();

    res.status(201).json({
      success: true,
      message: "HOD created successfully",
      hod: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("❌ Error creating HOD:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put("/hods/:id", async (req, res) => {
  try {
    const hod = await User.findById(req.params.id);
    if (!hod || hod.role !== "hod") {
      return res.status(404).json({ success: false, error: "HOD not found" });
    }

    const updatable = ["username", "email", "isActive"];
    updatable.forEach((field) => {
      if (req.body[field] !== undefined) hod[field] = req.body[field];
    });
    if (req.body.password) hod.password = req.body.password;

    await hod.save();

    res.json({
      success: true,
      message: "HOD updated successfully",
      hod: { id: hod._id, username: hod.username, email: hod.email, role: hod.role, isActive: hod.isActive },
    });
  } catch (error) {
    console.error("❌ Error updating HOD:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/hods/:id", async (req, res) => {
  try {
    const hod = await User.findById(req.params.id);
    if (!hod || hod.role !== "hod") {
      return res.status(404).json({ success: false, error: "HOD not found" });
    }

    await User.findByIdAndDelete(req.params.id);

    // Unassign this HOD from any departments
    await Department.updateMany(
      { hodId: req.params.id },
      { $set: { hodId: null, hodName: "Not Assigned" } },
    );

    res.json({ success: true, message: "HOD deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting HOD:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const [departments, teachers, students, subjects] = await Promise.all([
      Department.countDocuments({ isActive: true }),
      Teacher.countDocuments({ isActive: true }),
      Student.countDocuments({ isActive: true }),
      Subject.countDocuments({ isActive: true }),
    ]);

    const stats = { departments, teachers, students, subjects };
    console.log("✅ Sending stats:", stats);
    res.json(stats);
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

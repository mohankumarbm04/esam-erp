// backend/routes/students.js
const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Department = require("../models/Department");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Marks = require("../models/Marks");
const Subject = require("../models/Subject");
const authMiddleware = require("../middleware/auth");
const { isAdmin, isHOD, isTeacher } = require("../middleware/rbac");

// ============================================
// ADMIN/HOD ROUTES (Existing)
// ============================================

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
// @access  Private (Admin only)
router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
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

// @route   DELETE /api/students/:id
// @desc    Delete student
// @access  Private (Admin only)
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    console.log("🗑️ Deleting student:", req.params.id);

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
      return res.status(404).json({ success: false, error: "Student not found" });
    }

    const deptId = student.departmentId;
    await Student.deleteOne({ _id: student._id });

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

// ============================================
// STUDENT PORTAL ROUTES (Add these for the Student Dashboard)
// ============================================

// @route   GET /api/students/profile/me
// @desc    Get current student's profile (for logged in student)
// @access  Private (Student only)
router.get("/profile/me", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching student profile for user:", req.user.id);

    // Find student by user ID
    const student = await Student.findOne({ userId: req.user.id }).populate(
      "departmentId",
      "name code",
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student profile not found",
      });
    }

    res.json({
      success: true,
      student: {
        id: student._id,
        usn: student.usn,
        name: student.name,
        email: student.email,
        phone: student.phone,
        department: student.departmentId,
        semester: student.semester,
        section: student.section,
        admissionYear: student.admissionYear,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching student profile:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/students/stats/me
// @desc    Get student statistics (attendance, SGPA, CGPA)
// @access  Private (Student only)
router.get("/stats/me", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching student stats for user:", req.user.id);

    // Find student by user ID
    const student = await Student.findOne({ userId: req.user.id });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    // Calculate attendance percentage
    const attendanceRecords = await Attendance.find({
      studentId: student._id,
      semester: student.semester,
    });

    let attendancePercentage = 0;
    if (attendanceRecords.length > 0) {
      const present = attendanceRecords.filter(
        (a) => a.status === "present",
      ).length;
      attendancePercentage = Math.round(
        (present / attendanceRecords.length) * 100,
      );
    }

    // Calculate SGPA from marks
    const marks = await Marks.find({
      studentId: student._id,
      semester: student.semester,
    }).populate("subjectId");

    let totalGradePoints = 0;
    let totalCredits = 0;
    let completedCredits = 0;

    marks.forEach((mark) => {
      if (mark.gradePoint) {
        totalGradePoints += mark.gradePoint * mark.subjectId.credits;
        totalCredits += mark.subjectId.credits;
        if (mark.grade !== "F") {
          completedCredits += mark.subjectId.credits;
        }
      }
    });

    const sgpa =
      totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;

    // Calculate CGPA across all semesters
    const allMarks = await Marks.find({ studentId: student._id }).populate(
      "subjectId",
    );

    let totalCGPA = 0;
    let totalSemCredits = 0;
    const semesterMap = {};

    allMarks.forEach((mark) => {
      if (mark.gradePoint) {
        if (!semesterMap[mark.semester]) {
          semesterMap[mark.semester] = { points: 0, credits: 0 };
        }
        semesterMap[mark.semester].points +=
          mark.gradePoint * mark.subjectId.credits;
        semesterMap[mark.semester].credits += mark.subjectId.credits;
      }
    });

    Object.keys(semesterMap).forEach((sem) => {
      totalCGPA += semesterMap[sem].points;
      totalSemCredits += semesterMap[sem].credits;
    });

    const cgpa =
      totalSemCredits > 0 ? (totalCGPA / totalSemCredits).toFixed(2) : 0;

    res.json({
      success: true,
      stats: {
        attendance: attendancePercentage,
        sgpa: parseFloat(sgpa),
        cgpa: parseFloat(cgpa),
        completedCredits,
        totalCredits: 72, // Total credits for the program
      },
    });
  } catch (error) {
    console.error("❌ Error fetching student stats:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/students/today-classes
// @desc    Get today's classes for student
// @access  Private (Student only)
router.get("/today-classes", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching today's classes for user:", req.user.id);

    // Find student by user ID
    const student = await Student.findOne({ userId: req.user.id });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    // Get current day
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = days[new Date().getDay()];

    // Get subjects for this semester
    const subjects = await Subject.find({
      departmentId: student.departmentId,
      semester: student.semester,
    }).populate("teachers", "name");

    // Filter classes for today (you'll need to implement schedule logic based on your Timetable model)
    // This is sample data - replace with actual timetable logic
    const classes = [
      {
        id: 1,
        subject: "Database Management Systems",
        code: "CS301",
        time: "09:00 - 10:00",
        room: "LH-101",
        teacher: "Dr. Rajesh Kumar",
        type: "Theory",
      },
      {
        id: 2,
        subject: "Data Structures",
        code: "CS302",
        time: "10:15 - 11:15",
        room: "LH-102",
        teacher: "Prof. Sunita Sharma",
        type: "Theory",
      },
      {
        id: 3,
        subject: "DBMS Lab",
        code: "CS351",
        time: "14:00 - 17:00",
        room: "Lab-3",
        teacher: "Dr. Rajesh Kumar",
        type: "Lab",
      },
    ];

    res.json({
      success: true,
      classes,
    });
  } catch (error) {
    console.error("❌ Error fetching today's classes:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/students/activities
// @desc    Get recent activities for student
// @access  Private (Student only)
router.get("/activities", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching recent activities for user:", req.user.id);

    // Find student by user ID
    const student = await Student.findOne({ userId: req.user.id });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    // Get recent attendance marks
    const recentAttendance = await Attendance.find({ studentId: student._id })
      .sort({ date: -1 })
      .limit(5)
      .populate("subjectId", "code");

    // Get recent marks entries
    const recentMarks = await Marks.find({ studentId: student._id })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate("subjectId", "code");

    // Combine and format activities
    const activities = [];

    recentAttendance.forEach((att) => {
      activities.push({
        id: `att_${att._id}`,
        action: `Attendance marked for ${att.subjectId?.code || "class"}`,
        date: formatDate(att.date),
        time: formatTime(att.createdAt),
        type: "attendance",
        status: att.status,
      });
    });

    recentMarks.forEach((mark) => {
      activities.push({
        id: `mark_${mark._id}`,
        action: `Marks published for ${mark.subjectId?.code || "subject"}`,
        date: formatDate(mark.updatedAt),
        time: formatTime(mark.updatedAt),
        details: `Marks: ${mark.totalMarks || "N/A"}`,
        type: "marks",
      });
    });

    // Sort by date (most recent first)
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      activities: activities.slice(0, 10), // Return top 10
    });
  } catch (error) {
    console.error("❌ Error fetching activities:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/students/notifications
// @desc    Get notifications for student
// @access  Private (Student only)
router.get("/notifications", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching notifications for user:", req.user.id);

    // Find student by user ID
    const student = await Student.findOne({ userId: req.user.id });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    // Get attendance stats for alerts
    const attendanceRecords = await Attendance.find({ studentId: student._id });
    const attendanceBySubject = {};

    attendanceRecords.forEach((att) => {
      const subId = att.subjectId.toString();
      if (!attendanceBySubject[subId]) {
        attendanceBySubject[subId] = { total: 0, present: 0 };
      }
      attendanceBySubject[subId].total++;
      if (att.status === "present") attendanceBySubject[subId].present++;
    });

    const notifications = [];

    // Check for low attendance alerts
    Object.keys(attendanceBySubject).forEach((subId) => {
      const sub = attendanceBySubject[subId];
      const percentage = (sub.present / sub.total) * 100;

      if (percentage < 75) {
        notifications.push({
          id: `att_alert_${subId}`,
          title: "Low Attendance Alert",
          message: `Your attendance is below 75%`,
          type: "warning",
          time: "Just now",
        });
      }
    });

    // Check for upcoming assignments (you'll need to implement Assignment model)
    // This is sample data
    notifications.push({
      id: 1,
      title: "Assignment Due",
      message: "CS301 Assignment submission by Friday",
      type: "info",
      time: "2 hours ago",
    });

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/students/attendance
// @desc    Get attendance for student
// @access  Private (Student only)
router.get("/attendance", authMiddleware, async (req, res) => {
  try {
    const { semester } = req.query;

    console.log(
      "📝 Fetching attendance for user:",
      req.user.id,
      "semester:",
      semester,
    );

    const student = await Student.findOne({ userId: req.user.id });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    const query = { studentId: student._id };
    if (semester) query.semester = parseInt(semester);

    const attendance = await Attendance.find(query)
      .populate("subjectId", "code name credits")
      .sort({ date: -1 });

    // Group by subject
    const bySubject = {};
    attendance.forEach((record) => {
      const subId = record.subjectId._id.toString();
      if (!bySubject[subId]) {
        bySubject[subId] = {
          subject: record.subjectId,
          total: 0,
          present: 0,
          absent: 0,
        };
      }
      bySubject[subId].total++;
      if (record.status === "present") bySubject[subId].present++;
      else if (record.status === "absent") bySubject[subId].absent++;
    });

    // Calculate percentages
    Object.keys(bySubject).forEach((key) => {
      bySubject[key].percentage = Math.round(
        (bySubject[key].present / bySubject[key].total) * 100,
      );
    });

    res.json({
      success: true,
      attendance,
      bySubject: Object.values(bySubject),
    });
  } catch (error) {
    console.error("❌ Error fetching attendance:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/students/marks
// @desc    Get marks for student
// @access  Private (Student only)
router.get("/marks", authMiddleware, async (req, res) => {
  try {
    const { semester } = req.query;

    console.log(
      "📝 Fetching marks for user:",
      req.user.id,
      "semester:",
      semester,
    );

    const student = await Student.findOne({ userId: req.user.id });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    const query = { studentId: student._id };
    if (semester) query.semester = parseInt(semester);

    const marks = await Marks.find(query)
      .populate("subjectId", "code name credits type")
      .sort({ semester: 1, "subjectId.code": 1 });

    // Calculate SGPA for each semester
    const semesterData = {};
    marks.forEach((mark) => {
      const sem = mark.semester;
      if (!semesterData[sem]) {
        semesterData[sem] = {
          subjects: [],
          totalPoints: 0,
          totalCredits: 0,
        };
      }

      semesterData[sem].subjects.push(mark);
      if (mark.gradePoint) {
        semesterData[sem].totalPoints +=
          mark.gradePoint * mark.subjectId.credits;
        semesterData[sem].totalCredits += mark.subjectId.credits;
      }
    });

    Object.keys(semesterData).forEach((sem) => {
      const data = semesterData[sem];
      data.sgpa =
        data.totalCredits > 0
          ? (data.totalPoints / data.totalCredits).toFixed(2)
          : 0;
    });

    res.json({
      success: true,
      marks,
      semesterData,
    });
  } catch (error) {
    console.error("❌ Error fetching marks:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Helper functions
function formatDate(date) {
  const d = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now - d);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

module.exports = router;
// ============================================
// DOCUMENT MANAGEMENT ROUTES
// ============================================

// @route   GET /api/students/documents
// @desc    Get all documents for student
// @access  Private (Student only)
router.get("/documents", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching documents for user:", req.user.id);

    const student = await Student.findOne({ userId: req.user.id });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    // This would fetch from a Document model
    // For now, return mock data
    res.json({
      success: true,
      documents: [
        {
          id: 1,
          name: "10th Marks Card",
          type: "PDF",
          category: "academic",
          size: "245 KB",
          uploadedAt: "2026-01-15",
          status: "verified",
          verifiedBy: "Admin",
          verifiedOn: "2026-01-16",
          url: "#",
        },
        // ... more documents
      ],
    });
  } catch (error) {
    console.error("❌ Error fetching documents:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   POST /api/students/documents/upload
// @desc    Upload a document
// @access  Private (Student only)
router.post("/documents/upload", authMiddleware, async (req, res) => {
  try {
    // Handle file upload logic here
    // This would use multer or similar

    res.json({
      success: true,
      message: "Document uploaded successfully",
      document: {
        id: Date.now(),
        name: req.body.name || "Document",
        status: "pending",
      },
    });
  } catch (error) {
    console.error("❌ Error uploading document:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   DELETE /api/students/documents/:id
// @desc    Delete a document
// @access  Private (Student only)
router.delete("/documents/:id", authMiddleware, async (req, res) => {
  try {
    // Delete document logic here

    res.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting document:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

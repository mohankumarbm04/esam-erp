// backend/routes/attendance.js
const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const authMiddleware = require("../middleware/auth");
const { isTeacher, isHOD, isAdmin } = require("../middleware/rbac");

// @route   POST /api/attendance/mark
// @desc    Mark attendance for multiple students
// @access  Private (Teacher only)
router.post("/mark", authMiddleware, isTeacher, async (req, res) => {
  try {
    console.log("📝 Marking attendance:", req.body);

    const { subjectId, date, semester, attendanceList } = req.body;

    // Validation
    if (
      !subjectId ||
      !date ||
      !semester ||
      !attendanceList ||
      !attendanceList.length
    ) {
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields",
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

    // Process each attendance record
    const results = [];
    const errors = [];

    for (const item of attendanceList) {
      try {
        const { studentId, status } = item;

        // Check if student exists
        const student = await Student.findById(studentId);
        if (!student) {
          errors.push({ studentId, error: "Student not found" });
          continue;
        }

        // Check if attendance already marked for this date
        const existing = await Attendance.findOne({
          studentId,
          subjectId,
          date: new Date(date),
        });

        if (existing) {
          // Update existing
          existing.status = status;
          existing.markedBy = req.user.id;
          await existing.save();
          results.push(existing);
        } else {
          // Create new
          const attendance = new Attendance({
            studentId,
            subjectId,
            date: new Date(date),
            status,
            semester,
            markedBy: req.user.id,
          });
          await attendance.save();
          results.push(attendance);
        }
      } catch (error) {
        errors.push({ studentId: item.studentId, error: error.message });
      }
    }

    console.log(
      `✅ Attendance marked: ${results.length} successful, ${errors.length} failed`,
    );

    res.json({
      success: true,
      message: `Attendance marked: ${results.length} successful`,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("❌ Error marking attendance:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/attendance/student/:studentId
// @desc    Get attendance for a student
// @access  Private (Student, Parent, Teacher, HOD, Admin)
router.get("/student/:studentId", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Fetching attendance for student:", req.params.studentId);

    const { subjectId, semester } = req.query;

    // Build query
    const query = { studentId: req.params.studentId };
    if (subjectId) query.subjectId = subjectId;
    if (semester) query.semester = parseInt(semester);

    const attendance = await Attendance.find(query)
      .populate("subjectId", "subjectCode subjectName credits")
      .sort({ date: -1 });

    // Calculate summary per subject
    const summary = {};
    for (const record of attendance) {
      const subId = record.subjectId._id.toString();
      if (!summary[subId]) {
        summary[subId] = {
          subject: record.subjectId,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
        };
      }
      summary[subId].total++;
      if (record.status === "present") summary[subId].present++;
      else if (record.status === "absent") summary[subId].absent++;
      else if (record.status === "late") summary[subId].late++;
    }

    // Calculate percentages
    Object.keys(summary).forEach((key) => {
      const s = summary[key];
      s.percentage = Math.round((s.present / s.total) * 100 * 100) / 100;
      s.isEligible = s.percentage >= 75;
    });

    res.json({
      success: true,
      count: attendance.length,
      attendance,
      summary: Object.values(summary),
    });
  } catch (error) {
    console.error("❌ Error fetching attendance:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/attendance/subject/:subjectId
// @desc    Get attendance for a subject
// @access  Private (Teacher, HOD, Admin)
router.get(
  "/subject/:subjectId",
  authMiddleware,
  isTeacher,
  async (req, res) => {
    try {
      console.log("📝 Fetching attendance for subject:", req.params.subjectId);

      const { date, semester } = req.query;

      // Build query
      const query = { subjectId: req.params.subjectId };
      if (date) query.date = new Date(date);
      if (semester) query.semester = parseInt(semester);

      const attendance = await Attendance.find(query)
        .populate("studentId", "usn name semester section")
        .sort({ date: -1 });

      // Group by date
      const byDate = {};
      attendance.forEach((record) => {
        const dateKey = record.date.toISOString().split("T")[0];
        if (!byDate[dateKey]) {
          byDate[dateKey] = {
            date: dateKey,
            total: 0,
            present: 0,
            absent: 0,
            records: [],
          };
        }
        byDate[dateKey].total++;
        if (record.status === "present") byDate[dateKey].present++;
        else if (record.status === "absent") byDate[dateKey].absent++;
        byDate[dateKey].records.push(record);
      });

      res.json({
        success: true,
        count: attendance.length,
        byDate: Object.values(byDate),
      });
    } catch (error) {
      console.error("❌ Error fetching attendance:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

// @route   GET /api/attendance/summary/:studentId
// @desc    Get attendance summary with percentage for a student
// @access  Private
router.get("/summary/:studentId", authMiddleware, async (req, res) => {
  try {
    console.log(
      "📝 Generating attendance summary for student:",
      req.params.studentId,
    );

    const { semester } = req.query;

    // Get all subjects for this student's semester
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    const targetSemester = semester || student.semester;

    const subjects = await Subject.find({
      departmentId: student.departmentId,
      semester: targetSemester,
    });

    // Calculate attendance for each subject
    const summary = [];
    for (const subject of subjects) {
      const stats = await Attendance.calculatePercentage(
        req.params.studentId,
        subject._id,
        targetSemester,
      );

      summary.push({
        subject: {
          _id: subject._id,
          subjectCode: subject.subjectCode,
          subjectName: subject.subjectName,
          credits: subject.credits,
        },
        ...stats,
      });
    }

    // Overall percentage
    const overall = {
      totalClasses: summary.reduce((acc, s) => acc + s.total, 0),
      totalPresent: summary.reduce((acc, s) => acc + s.present, 0),
    };
    overall.percentage =
      overall.totalClasses > 0
        ? Math.round(
            (overall.totalPresent / overall.totalClasses) * 100 * 100,
          ) / 100
        : 0;
    overall.isEligible = overall.percentage >= 75;
    overall.isDetained = overall.percentage < 65;

    res.json({
      success: true,
      student: {
        id: student._id,
        usn: student.usn,
        name: student.name,
        semester: targetSemester,
      },
      summary,
      overall,
    });
  } catch (error) {
    console.error("❌ Error generating summary:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @route   GET /api/attendance/low-attendance
// @desc    Get students with low attendance (<75%)
// @access  Private (HOD, Admin)
router.get("/low-attendance", authMiddleware, isHOD, async (req, res) => {
  try {
    console.log("📝 Fetching students with low attendance");

    const { departmentId, semester, threshold = 75 } = req.query;

    // Build query for students
    const studentQuery = {};
    if (departmentId) studentQuery.departmentId = departmentId;
    if (semester) studentQuery.semester = parseInt(semester);

    const students = await Student.find(studentQuery);

    const lowAttendanceStudents = [];

    for (const student of students) {
      // Get all subjects for this student's semester
      const subjects = await Subject.find({
        departmentId: student.departmentId,
        semester: student.semester,
      });

      let totalClasses = 0;
      let totalPresent = 0;

      for (const subject of subjects) {
        const stats = await Attendance.calculatePercentage(
          student._id,
          subject._id,
          student.semester,
        );
        totalClasses += stats.total;
        totalPresent += stats.present;
      }

      const overallPercentage =
        totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 100;

      if (overallPercentage < threshold) {
        lowAttendanceStudents.push({
          student: {
            _id: student._id,
            usn: student.usn,
            name: student.name,
            semester: student.semester,
            section: student.section,
            parentPhone: student.parentPhone,
            parentEmail: student.parentEmail,
          },
          attendance: Math.round(overallPercentage * 100) / 100,
          totalClasses,
          totalPresent,
          isEligible: overallPercentage >= 75,
          isDetained: overallPercentage < 65,
        });
      }
    }

    // Sort by attendance (lowest first)
    lowAttendanceStudents.sort((a, b) => a.attendance - b.attendance);

    res.json({
      success: true,
      count: lowAttendanceStudents.length,
      threshold,
      students: lowAttendanceStudents,
    });
  } catch (error) {
    console.error("❌ Error fetching low attendance students:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

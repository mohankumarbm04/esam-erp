const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/rbac");

const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Marks = require("../models/Marks");
const Subject = require("../models/Subject");
const Department = require("../models/Department");

// All admin report routes require admin access
router.use(auth, isAdmin);

// GET /api/admin/reports/attendance
// Query params: departmentId, year, semester, section, fromDate, toDate
router.get("/attendance", async (req, res) => {
  try {
    const {
      departmentId,
      year,
      semester,
      section,
      fromDate,
      toDate,
    } = req.query;

    const studentFilter = {};
    if (departmentId) studentFilter.departmentId = departmentId;
    if (year) studentFilter.admissionYear = Number(year);
    if (semester) studentFilter.semester = Number(semester);
    if (section) studentFilter.section = section;

    const students = await Student.find(studentFilter)
      .select("_id usn name departmentId semester section")
      .populate("departmentId", "code name");

    if (!students.length) {
      return res.json([]);
    }

    const studentIds = students.map((s) => s._id);
    const dateFilter = {};
    if (fromDate) dateFilter.$gte = new Date(fromDate);
    if (toDate) dateFilter.$lte = new Date(toDate);

    const attendanceFilter = { studentId: { $in: studentIds } };
    if (fromDate || toDate) {
      attendanceFilter.date = dateFilter;
    }

    const aggregates = await Attendance.aggregate([
      { $match: attendanceFilter },
      {
        $group: {
          _id: "$studentId",
          present: {
            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
          },
          absent: {
            $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] },
          },
          late: { $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] } },
          total: { $sum: 1 },
        },
      },
    ]);

    const byId = new Map(aggregates.map((a) => [String(a._id), a]));

    const rows = students.map((s) => {
      const agg = byId.get(String(s._id)) || {
        present: 0,
        absent: 0,
        late: 0,
        total: 0,
      };
      const percentage =
        agg.total > 0 ? Math.round((agg.present / agg.total) * 100) : 0;

      return {
        rollNo: s.usn,
        name: s.name,
        department: s.departmentId?.code || "",
        present: agg.present,
        absent: agg.absent,
        late: agg.late,
        percentage,
        section: s.section,
        semester: s.semester,
      };
    });

    res.json(rows);
  } catch (error) {
    console.error("❌ Attendance report error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/reports/marks
// Query params: departmentId, semester, section, subjectId
router.get("/marks", async (req, res) => {
  try {
    const { departmentId, semester, section, subjectId } = req.query;

    const studentFilter = {};
    if (departmentId) studentFilter.departmentId = departmentId;
    if (semester) studentFilter.semester = Number(semester);
    if (section) studentFilter.section = section;

    const students = await Student.find(studentFilter)
      .select("_id usn name departmentId semester section")
      .populate("departmentId", "code name");

    if (!students.length) {
      return res.json([]);
    }

    const studentIds = students.map((s) => s._id);
    const marksFilter = {
      studentId: { $in: studentIds },
    };
    if (semester) marksFilter.semester = Number(semester);
    if (subjectId) marksFilter.subjectId = subjectId;

    const marks = await Marks.find(marksFilter)
      .populate("subjectId", "code name credits")
      .populate("studentId", "usn name");

    const rows = marks.map((m) => {
      return {
        rollNo: m.studentId?.usn || "",
        name: m.studentId?.name || "",
        subjectCode: m.subjectId?.code || "",
        subjectName: m.subjectId?.name || "",
        internal: m.bestIa ?? null,
        labInternal: m.labInternal ?? null,
        semesterExam: m.semesterExam ?? null,
        totalMarks: m.totalMarks ?? null,
        grade: m.grade ?? "",
        gradePoint: m.gradePoint ?? null,
        credits: m.creditsEarned ?? m.subjectId?.credits ?? null,
      };
    });

    res.json(rows);
  } catch (error) {
    console.error("❌ Marks report error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


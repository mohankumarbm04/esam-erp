const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/rbac");

const Department = require("../models/Department");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Subject = require("../models/Subject");

// GET /api/dashboard/stats
// Admin dashboard statistics (live DB data)
router.get("/stats", auth, isAdmin, async (req, res) => {
  try {
    const [
      totalDepartments,
      totalTeachers,
      totalStudents,
      totalSubjects,
      activeStudents,
      avgSemesterAgg,
    ] = await Promise.all([
      Department.countDocuments({ isActive: { $ne: false } }),
      Teacher.countDocuments({ isActive: { $ne: false } }),
      Student.countDocuments({}),
      Subject.countDocuments({ isActive: { $ne: false } }),
      Student.countDocuments({ isActive: { $ne: false } }),
      Student.aggregate([
        { $match: { isActive: { $ne: false }, semester: { $type: "number" } } },
        { $group: { _id: null, avgSemester: { $avg: "$semester" } } },
      ]),
    ]);

    const avgSemester =
      Array.isArray(avgSemesterAgg) && avgSemesterAgg.length > 0
        ? Number(avgSemesterAgg[0].avgSemester) || 0
        : 0;

    res.json({
      totalStudents,
      totalTeachers,
      totalDepartments,
      totalSubjects,
      activeStudents,
      avgSemester: Math.round(avgSemester * 10) / 10,
    });
  } catch (error) {
    console.error("❌ Dashboard stats error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/rbac");
const Department = require("../models/Department");
const Student = require("../models/Student");
const FeeStructure = require("../models/FeeStructure");
const FeePayment = require("../models/FeePayment");
const { sendNotification } = require("../utils/notificationService");

router.use(auth, isAdmin);

// ============ Fee structures ============

router.get("/structures", async (_req, res) => {
  const items = await FeeStructure.find()
    .populate("departmentId", "name code")
    .sort({ dueDate: 1 });
  res.json({ structures: items });
});

router.post("/structures", async (req, res) => {
  const { name, departmentId, semester, amount, dueDate } = req.body;
  if (!name || !departmentId || !semester || !amount || !dueDate) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const dept = await Department.findById(departmentId);
  if (!dept) return res.status(400).json({ error: "Department not found" });

  const doc = await FeeStructure.create({
    name: String(name).trim(),
    departmentId,
    semester: Number(semester),
    amount: Number(amount),
    dueDate: new Date(dueDate),
  });

  const populated = await doc.populate("departmentId", "name code");
  res.status(201).json({ message: "Fee structure created", structure: populated });
});

router.put("/structures/:id", async (req, res) => {
  const doc = await FeeStructure.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Fee structure not found" });

  const { name, departmentId, semester, amount, dueDate, isActive } = req.body;
  if (typeof name === "string" && name.trim()) doc.name = name.trim();
  if (departmentId) {
    const dept = await Department.findById(departmentId);
    if (!dept) return res.status(400).json({ error: "Department not found" });
    doc.departmentId = departmentId;
  }
  if (semester !== undefined) doc.semester = Number(semester);
  if (amount !== undefined) doc.amount = Number(amount);
  if (dueDate) doc.dueDate = new Date(dueDate);
  if (typeof isActive === "boolean") doc.isActive = isActive;

  await doc.save();
  const populated = await doc.populate("departmentId", "name code");
  res.json({ message: "Fee structure updated", structure: populated });
});

router.delete("/structures/:id", async (req, res) => {
  const doc = await FeeStructure.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: "Fee structure not found" });
  res.json({ message: "Fee structure deleted" });
});

// ============ Fee collection & payments ============

// Find student by USN or name (simple helper)
router.get("/students/search", async (req, res) => {
  const { q } = req.query;
  if (!q || !q.trim()) return res.json({ students: [] });

  const regex = new RegExp(q.trim(), "i");
  const students = await Student.find({
    $or: [{ usn: regex }, { name: regex }],
  })
    .limit(20)
    .populate("departmentId", "name code");

  res.json({ students });
});

// Get structures applicable to a student
router.get("/students/:id/structures", async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });

  const structures = await FeeStructure.find({
    departmentId: student.departmentId,
    semester: student.semester,
    isActive: true,
  }).sort({ dueDate: 1 });

  res.json({ student, structures });
});

router.post("/payments", async (req, res) => {
  const {
    studentId,
    feeStructureId,
    amount,
    method,
    paymentDate,
    transactionId,
    notes,
  } = req.body;

  if (!studentId || !feeStructureId || !amount || !method) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  const student = await Student.findById(studentId).populate(
    "departmentId",
    "name code",
  );
  if (!student) return res.status(400).json({ error: "Student not found" });

  const structure = await FeeStructure.findById(feeStructureId).populate(
    "departmentId",
    "name code",
  );
  if (!structure) return res.status(400).json({ error: "Fee structure not found" });

  const doc = await FeePayment.create({
    studentId,
    feeStructureId,
    amount: Number(amount),
    method,
    paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
    transactionId,
    notes,
    createdBy: req.user.id,
  });

  const populated = await doc
    .populate("studentId", "name usn email")
    .populate("feeStructureId", "name amount");

  // Optional: send notification to student (if userId exists)
  if (student.userId) {
    try {
      await sendNotification({
        userId: student.userId,
        key: "fee_paid",
        data: {
          name: student.name,
          usn: student.usn,
          feeName: structure.name,
          amount: populated.amount,
          method: populated.method,
        },
      });
    } catch (e) {
      // log but don't fail payment
      console.error("Failed to send fee payment notification", e.message || e);
    }
  }

  res.status(201).json({ message: "Payment recorded", payment: populated });
});

// Payment history with filters
router.get("/payments", async (req, res) => {
  const { studentId, departmentId, from, to } = req.query;

  const match = {};
  if (from || to) {
    match.paymentDate = {};
    if (from) match.paymentDate.$gte = new Date(from);
    if (to) match.paymentDate.$lte = new Date(to);
  }

  if (studentId) {
    match.studentId = studentId;
  }

  const pipeline = [
    { $match: match },
    {
      $lookup: {
        from: "students",
        localField: "studentId",
        foreignField: "_id",
        as: "student",
      },
    },
    { $unwind: "$student" },
  ];

  if (departmentId) {
    pipeline.push({
      $match: { "student.departmentId": new require("mongoose").Types.ObjectId(departmentId) },
    });
  }

  pipeline.push(
    {
      $lookup: {
        from: "feestructures",
        localField: "feeStructureId",
        foreignField: "_id",
        as: "structure",
      },
    },
    { $unwind: "$structure" },
    {
      $lookup: {
        from: "departments",
        localField: "student.departmentId",
        foreignField: "_id",
        as: "department",
      },
    },
    { $unwind: "$department" },
    { $sort: { paymentDate: -1 } },
  );

  const payments = await FeePayment.aggregate(pipeline);
  res.json({ payments });
});

// ============ Due payments ============

router.get("/dues", async (req, res) => {
  const today = new Date();
  const { departmentId } = req.query;

  const structures = await FeeStructure.find({
    isActive: true,
    dueDate: { $lte: today },
    ...(departmentId ? { departmentId } : {}),
  }).lean();

  if (!structures.length) return res.json({ dues: [] });

  const structIds = structures.map((s) => s._id);

  const students = await Student.find({
    departmentId: departmentId || { $exists: true },
    isActive: { $ne: false },
  })
    .populate("departmentId", "name code")
    .lean();

  const payments = await FeePayment.aggregate([
    { $match: { feeStructureId: { $in: structIds } } },
    {
      $group: {
        _id: { studentId: "$studentId", feeStructureId: "$feeStructureId" },
        paid: { $sum: "$amount" },
      },
    },
  ]);

  const paidMap = new Map();
  for (const p of payments) {
    paidMap.set(`${p._id.studentId}_${p._id.feeStructureId}`, p.paid);
  }

  const dues = [];
  for (const s of students) {
    const applicable = structures.filter(
      (f) =>
        String(f.departmentId) === String(s.departmentId._id) &&
        f.semester === s.semester,
    );
    for (const f of applicable) {
      const paid =
        paidMap.get(`${s._id.toString()}_${f._id.toString()}`) || 0;
      const due = f.amount - paid;
      if (due > 0) {
        dues.push({
          studentId: s._id,
          feeStructureId: f._id,
          studentName: s.name,
          usn: s.usn,
          departmentName: s.departmentId.name,
          amountDue: due,
          totalAmount: f.amount,
          dueDate: f.dueDate,
          feeName: f.name,
        });
      }
    }
  }

  res.json({ dues });
});

// Send reminder notification for a due (optional, uses notification templates)
router.post("/dues/:studentId/:feeStructureId/remind", async (req, res) => {
  const student = await Student.findById(req.params.studentId).populate(
    "departmentId",
    "name code",
  );
  if (!student) return res.status(404).json({ error: "Student not found" });

  const structure = await FeeStructure.findById(
    req.params.feeStructureId,
  ).populate("departmentId", "name code");
  if (!structure)
    return res.status(404).json({ error: "Fee structure not found" });

  if (!student.userId) {
    return res.status(400).json({ error: "Student has no linked user account" });
  }

  const today = new Date();
  const payments = await FeePayment.aggregate([
    {
      $match: {
        studentId: student._id,
        feeStructureId: structure._id,
      },
    },
    {
      $group: {
        _id: null,
        paid: { $sum: "$amount" },
      },
    },
  ]);

  const paid = payments[0]?.paid || 0;
  const due = structure.amount - paid;

  try {
    await sendNotification({
      userId: student.userId,
      key: "fee_due",
      data: {
        name: student.name,
        usn: student.usn,
        feeName: structure.name,
        amountDue: due,
        dueDate: structure.dueDate.toISOString().slice(0, 10),
        department: student.departmentId.name,
        today: today.toISOString().slice(0, 10),
      },
    });
  } catch (e) {
    console.error("Failed to send fee due reminder", e.message || e);
    return res.status(500).json({ error: "Failed to send reminder" });
  }

  res.json({ message: "Reminder sent" });
});

// ============ Fee reports ============

router.get("/reports/summary", async (req, res) => {
  const { from, to } = req.query;
  const match = {};
  if (from || to) {
    match.paymentDate = {};
    if (from) match.paymentDate.$gte = new Date(from);
    if (to) match.paymentDate.$lte = new Date(to);
  }

  const totalCollectedAgg = await FeePayment.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalCollected: { $sum: "$amount" },
      },
    },
  ]);
  const totalCollected = totalCollectedAgg[0]?.totalCollected || 0;

  const structures = await FeeStructure.find({ isActive: true }).lean();
  const totalExpected = structures.reduce((sum, s) => sum + s.amount, 0); // per structure; for simplicity

  const pending = Math.max(totalExpected - totalCollected, 0);

  // Department-wise
  const deptAgg = await FeePayment.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "students",
        localField: "studentId",
        foreignField: "_id",
        as: "student",
      },
    },
    { $unwind: "$student" },
    {
      $group: {
        _id: "$student.departmentId",
        totalCollected: { $sum: "$amount" },
      },
    },
    {
      $lookup: {
        from: "departments",
        localField: "_id",
        foreignField: "_id",
        as: "department",
      },
    },
    { $unwind: "$department" },
    {
      $project: {
        _id: 0,
        departmentId: "$department._id",
        departmentName: "$department.name",
        totalCollected: 1,
      },
    },
  ]);

  // Monthly collection
  const monthlyAgg = await FeePayment.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          year: { $year: "$paymentDate" },
          month: { $month: "$paymentDate" },
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.json({
    totalCollected,
    totalExpected,
    pending,
    byDepartment: deptAgg,
    monthly: monthlyAgg,
  });
});

module.exports = router;


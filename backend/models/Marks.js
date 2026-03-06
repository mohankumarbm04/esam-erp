// backend/models/Marks.js
const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student ID is required"],
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject ID is required"],
    },
    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: 1,
      max: 8,
    },
    // Internal Assessment marks (3 IAs)
    ia1: {
      type: Number,
      min: 0,
      max: 30,
      default: null,
    },
    ia2: {
      type: Number,
      min: 0,
      max: 30,
      default: null,
    },
    ia3: {
      type: Number,
      min: 0,
      max: 30,
      default: null,
    },
    // Best of 2 IAs (calculated)
    bestIa: {
      type: Number,
      min: 0,
      max: 30,
      default: null,
    },
    // Lab internal marks (if applicable)
    labInternal: {
      type: Number,
      min: 0,
      max: 25,
      default: null,
    },
    // Semester End Exam marks
    semesterExam: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    // Total marks (calculated)
    totalMarks: {
      type: Number,
      min: 0,
      max: 200,
      default: null,
    },
    // Grade (calculated)
    grade: {
      type: String,
      enum: ["O", "A+", "A", "B+", "B", "C", "P", "F", null],
      default: null,
    },
    // Grade points (calculated)
    gradePoint: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },
    // Credits earned
    creditsEarned: {
      type: Number,
      default: 0,
    },
    // Status
    isCompleted: {
      type: Boolean,
      default: false,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// Ensure one marks record per student per subject per semester
marksSchema.index(
  { studentId: 1, subjectId: 1, semester: 1 },
  { unique: true },
);

// Method to calculate best of 3 IAs
marksSchema.methods.calculateBestIa = function () {
  const iaMarks = [this.ia1, this.ia2, this.ia3].filter((m) => m !== null);
  if (iaMarks.length >= 2) {
    // Sort descending and take top 2
    iaMarks.sort((a, b) => b - a);
    this.bestIa = (iaMarks[0] + iaMarks[1]) / 2;
  } else if (iaMarks.length === 1) {
    this.bestIa = iaMarks[0];
  } else {
    this.bestIa = null;
  }
};

// Method to calculate total marks
marksSchema.methods.calculateTotal = function () {
  let total = 0;

  // Add best IA (max 30)
  if (this.bestIa) total += this.bestIa;

  // Add lab internal (max 25)
  if (this.labInternal) total += this.labInternal;

  // Add semester exam (max 100)
  if (this.semesterExam) total += this.semesterExam;

  this.totalMarks = total > 0 ? total : null;
};

// Method to calculate grade based on VTU/Autonomous system
marksSchema.methods.calculateGrade = function () {
  if (!this.totalMarks) {
    this.grade = null;
    this.gradePoint = null;
    this.creditsEarned = 0;
    return;
  }

  // Grade calculation logic
  if (this.totalMarks >= 90) {
    this.grade = "O";
    this.gradePoint = 10;
  } else if (this.totalMarks >= 80) {
    this.grade = "A+";
    this.gradePoint = 9;
  } else if (this.totalMarks >= 70) {
    this.grade = "A";
    this.gradePoint = 8;
  } else if (this.totalMarks >= 60) {
    this.grade = "B+";
    this.gradePoint = 7;
  } else if (this.totalMarks >= 55) {
    this.grade = "B";
    this.gradePoint = 6;
  } else if (this.totalMarks >= 50) {
    this.grade = "C";
    this.gradePoint = 5;
  } else if (this.totalMarks >= 40) {
    this.grade = "P";
    this.gradePoint = 4;
  } else {
    this.grade = "F";
    this.gradePoint = 0;
  }

  // Credits earned only if passed
  this.creditsEarned = this.grade !== "F" ? 1 : 0;
};

// ===== FIXED PRE-SAVE MIDDLEWARE =====
// Using async function without next parameter
marksSchema.pre("save", async function () {
  console.log("📊 Pre-save middleware running for:", this._id);

  try {
    // Calculate all values
    this.calculateBestIa();
    this.calculateTotal();
    this.calculateGrade();

    console.log("✅ Calculations complete:", {
      bestIa: this.bestIa,
      totalMarks: this.totalMarks,
      grade: this.grade,
      gradePoint: this.gradePoint,
    });

    // No need to call next() - async middleware doesn't require it
  } catch (error) {
    console.error("❌ Error in pre-save calculations:", error);
    throw error; // Throw error to fail the save operation
  }
});

// Ensure virtuals are included in JSON
marksSchema.set("toJSON", { virtuals: true });
marksSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Marks", marksSchema);

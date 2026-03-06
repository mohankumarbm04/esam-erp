// backend/models/Attendance.js
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "holiday"],
      required: [true, "Attendance status is required"],
    },
    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: 1,
      max: 8,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Marked by is required"],
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

// Ensure one attendance record per student per subject per day
attendanceSchema.index(
  { studentId: 1, subjectId: 1, date: 1 },
  { unique: true },
);

// Virtual for formatted date
attendanceSchema.virtual("formattedDate").get(function () {
  return this.date.toISOString().split("T")[0];
});

// Static method to calculate attendance percentage
attendanceSchema.statics.calculatePercentage = async function (
  studentId,
  subjectId,
  semester,
) {
  const totalClasses = await this.countDocuments({
    studentId,
    subjectId,
    semester,
  });

  const presentClasses = await this.countDocuments({
    studentId,
    subjectId,
    semester,
    status: "present",
  });

  const percentage =
    totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

  return {
    total: totalClasses,
    present: presentClasses,
    percentage: Math.round(percentage * 100) / 100,
    isEligible: percentage >= 75,
    isDetained: percentage < 65,
  };
};

// Ensure virtuals are included in JSON
attendanceSchema.set("toJSON", { virtuals: true });
attendanceSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Attendance", attendanceSchema);

// backend/models/Department.js
const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      unique: true,
    },
    code: {
      type: String,
      required: [true, "Department code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    hodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    hodName: {
      type: String,
      default: "Not Assigned",
    },
    totalStudents: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalTeachers: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalClasses: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    establishedYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear(),
    },
  },
  {
    timestamps: true,
  },
);

// Virtual for department info
departmentSchema.virtual("info").get(function () {
  return `${this.name} (${this.code}) - Established: ${this.establishedYear || "N/A"}`;
});

// Ensure virtuals are included in JSON output
departmentSchema.set("toJSON", { virtuals: true });
departmentSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Department", departmentSchema);

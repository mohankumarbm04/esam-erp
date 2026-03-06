// backend/models/Subject.js
const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    subjectCode: {
      type: String,
      required: [true, "Subject code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    subjectName: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: 1,
      max: 8,
    },
    credits: {
      type: Number,
      required: [true, "Credits are required"],
      min: 1,
      max: 5,
    },
    type: {
      type: String,
      enum: ["Theory", "Lab", "Project", "Internship"],
      required: [true, "Subject type is required"],
    },
    hoursPerWeek: {
      type: Number,
      required: [true, "Hours per week is required"],
      min: 1,
      max: 6,
    },
    internalMarks: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    externalMarks: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    totalMarks: {
      type: Number,
      default: 150,
      min: 0,
      max: 200,
    },
    isElective: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    syllabus: {
      type: String,
      default: "Not uploaded",
    },
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Virtual for subject info
subjectSchema.virtual("info").get(function () {
  return `${this.subjectCode} - ${this.subjectName} (${this.credits} credits)`;
});

// Ensure virtuals are included in JSON
subjectSchema.set("toJSON", { virtuals: true });
subjectSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Subject", subjectSchema);

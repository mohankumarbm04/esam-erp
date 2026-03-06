// backend/models/Teacher.js
const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    teacherId: {
      type: String,
      required: [true, "Teacher ID is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Teacher name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
    designation: {
      type: String,
      enum: [
        "Professor",
        "Associate Professor",
        "Assistant Professor",
        "Senior Lecturer",
        "Lecturer",
      ],
      required: [true, "Designation is required"],
    },
    qualification: {
      type: String,
      required: [true, "Qualification is required"],
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
    },
    experience: {
      type: Number,
      min: 0,
      default: 0,
    },
    joiningDate: {
      type: Date,
      required: [true, "Joining date is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
  },
  {
    timestamps: true,
  },
);

// Virtual for full address
teacherSchema.virtual("fullAddress").get(function () {
  if (!this.address) return "Not provided";
  const { street, city, state, pincode } = this.address;
  return `${street || ""}, ${city || ""}, ${state || ""} - ${pincode || ""}`
    .replace(/, ,/g, ",")
    .replace(/,$/, "");
});

// Ensure virtuals are included in JSON
teacherSchema.set("toJSON", { virtuals: true });
teacherSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Teacher", teacherSchema);

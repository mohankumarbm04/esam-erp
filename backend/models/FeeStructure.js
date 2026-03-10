const mongoose = require("mongoose");

const feeStructureSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "B.E CSE Sem 5 Tuition"
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    semester: { type: Number, required: true, min: 1, max: 8 },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

feeStructureSchema.index({ departmentId: 1, semester: 1, name: 1 });

module.exports = mongoose.model("FeeStructure", feeStructureSchema);


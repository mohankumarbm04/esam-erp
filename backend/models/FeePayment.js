const mongoose = require("mongoose");

const feePaymentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    feeStructureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeStructure",
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    method: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Bank Transfer"],
      required: true,
    },
    paymentDate: { type: Date, required: true, default: Date.now },
    transactionId: { type: String, trim: true },
    notes: { type: String, trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

feePaymentSchema.index({ studentId: 1, feeStructureId: 1, paymentDate: -1 });

module.exports = mongoose.model("FeePayment", feePaymentSchema);


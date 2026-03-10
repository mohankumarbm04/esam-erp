const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

holidaySchema.index({ date: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Holiday", holidaySchema);


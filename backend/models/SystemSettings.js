const mongoose = require("mongoose");

const systemSettingsSchema = new mongoose.Schema(
  {
    institutionName: { type: String, default: "ESAM-ERP" },
    logoUrl: { type: String, default: "" },
    timezone: { type: String, default: "Asia/Kolkata" },
    language: { type: String, default: "en" },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SystemSettings", systemSettingsSchema);


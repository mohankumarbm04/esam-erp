const mongoose = require("mongoose");

const backupSettingsSchema = new mongoose.Schema(
  {
    schedule: {
      type: String,
      enum: ["off", "daily", "weekly"],
      default: "off",
    },
    lastBackupAt: { type: Date, default: null },
    lastBackupStatus: {
      type: String,
      enum: ["never", "success", "failed"],
      default: "never",
    },
    lastBackupMessage: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("BackupSettings", backupSettingsSchema);


const mongoose = require("mongoose");

const notificationSettingsSchema = new mongoose.Schema(
  {
    inAppEnabled: { type: Boolean, default: true },
    emailEnabled: { type: Boolean, default: false },
    smsEnabled: { type: Boolean, default: false },
    pushEnabled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("NotificationSettings", notificationSettingsSchema);


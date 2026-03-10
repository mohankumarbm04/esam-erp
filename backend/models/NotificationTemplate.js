const mongoose = require("mongoose");

const notificationTemplateSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true }, // e.g. "student_created"
    channel: {
      type: String,
      required: true,
      enum: ["inapp", "email", "sms", "push"],
    },
    name: { type: String, default: "" }, // human label
    subject: { type: String, default: "" }, // used by email/push
    body: { type: String, required: true, default: "" },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true },
);

notificationTemplateSchema.index({ key: 1, channel: 1 }, { unique: true });

module.exports = mongoose.model("NotificationTemplate", notificationTemplateSchema);


const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    channel: {
      type: String,
      enum: ["inapp", "email", "sms", "push"],
      default: "inapp",
    },
    key: { type: String, default: "" }, // template key
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Object, default: {} },
    readAt: { type: Date, default: null },
  },
  { timestamps: true },
);

notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);


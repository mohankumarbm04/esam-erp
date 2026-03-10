const mongoose = require("mongoose");

const emailSettingsSchema = new mongoose.Schema(
  {
    smtpHost: { type: String, default: "" },
    smtpPort: { type: Number, default: 587 },
    username: { type: String, default: "" },
    passwordEnc: { type: String, default: "" },
    senderEmail: { type: String, default: "" },
    secure: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("EmailSettings", emailSettingsSchema);


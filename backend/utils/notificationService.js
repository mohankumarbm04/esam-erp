const nodemailer = require("nodemailer");
const User = require("../models/User");
const NotificationSettings = require("../models/NotificationSettings");
const NotificationTemplate = require("../models/NotificationTemplate");
const Notification = require("../models/Notification");
const EmailSettings = require("../models/EmailSettings");
const { decrypt } = require("./crypto");

function renderTemplate(str, data = {}) {
  if (!str) return "";
  return String(str).replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) =>
    data[key] !== undefined && data[key] !== null ? String(data[key]) : "",
  );
}

async function getSettings() {
  const doc =
    (await NotificationSettings.findOne()) ||
    (await NotificationSettings.create({ inAppEnabled: true }));
  return doc;
}

async function getEmailTransport() {
  const email = await EmailSettings.findOne();
  if (!email || !email.smtpHost || !email.smtpPort || !email.username || !email.passwordEnc) {
    throw new Error("SMTP settings are incomplete");
  }

  return nodemailer.createTransport({
    host: email.smtpHost,
    port: email.smtpPort,
    secure: !!email.secure,
    auth: {
      user: email.username,
      pass: decrypt(email.passwordEnc),
    },
  });
}

async function sendEmailNotification(user, subject, body) {
  const settings = await getSettings();
  if (!settings.emailEnabled) return;
  if (!user.email) return;

  const email = await EmailSettings.findOne();
  if (!email) return;

  const transporter = await getEmailTransport();

  await transporter.sendMail({
    from: email.senderEmail || email.username,
    to: user.email,
    subject,
    text: body,
  });
}

async function sendInAppNotification(user, title, message, key, data) {
  const settings = await getSettings();
  if (!settings.inAppEnabled) return;

  await Notification.create({
    userId: user._id,
    channel: "inapp",
    key,
    title,
    message,
    data: data || {},
  });
}

// Stubs – you can later plug Twilio / FCM etc.
async function sendSmsNotification(_user, _body) {
  const settings = await getSettings();
  if (!settings.smsEnabled) return;
  // TODO: integrate SMS provider here
}

async function sendPushNotification(_user, _title, _body) {
  const settings = await getSettings();
  if (!settings.pushEnabled) return;
  // TODO: integrate FCM / web push here
}

/**
 * Send notification using a template key.
 *
 * options: {
 *   userId or email,
 *   key,
 *   channels?: ['inapp','email','sms','push'],
 *   data?: object
 * }
 */
async function sendNotification(options) {
  const { userId, email, key, channels, data = {} } = options || {};
  if (!key) throw new Error("Notification key is required");

  let user = null;
  if (userId) {
    user = await User.findById(userId);
  } else if (email) {
    user = await User.findOne({ email });
  }
  if (!user) throw new Error("Target user not found");

  const activeChannels = channels && channels.length ? channels : ["inapp", "email"];

  const templates = await NotificationTemplate.find({
    key,
    channel: { $in: activeChannels },
    enabled: { $ne: false },
  });

  if (!templates.length) {
    // Fallback simple in-app message
    const title = renderTemplate(key.replace(/_/g, " "), data);
    const msg = renderTemplate("You have a new notification.", data);
    await sendInAppNotification(user, title, msg, key, data);
    return;
  }

  for (const tpl of templates) {
    const title = renderTemplate(tpl.subject || tpl.name || key, data);
    const body = renderTemplate(tpl.body, data);

    if (tpl.channel === "inapp") {
      await sendInAppNotification(user, title, body, key, data);
    } else if (tpl.channel === "email") {
      await sendEmailNotification(user, title, body);
    } else if (tpl.channel === "sms") {
      await sendSmsNotification(user, body);
    } else if (tpl.channel === "push") {
      await sendPushNotification(user, title, body);
    }
  }
}

module.exports = {
  sendNotification,
  renderTemplate,
};


const express = require("express");
const router = express.Router();
const path = require("path");

const multer = require("multer");
const nodemailer = require("nodemailer");

const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/rbac");

const SystemSettings = require("../models/SystemSettings");
const EmailSettings = require("../models/EmailSettings");
const BackupSettings = require("../models/BackupSettings");
const Role = require("../models/Role");
const AcademicYear = require("../models/AcademicYear");
const Holiday = require("../models/Holiday");
const NotificationSettings = require("../models/NotificationSettings");
const NotificationTemplate = require("../models/NotificationTemplate");

const Department = require("../models/Department");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Attendance = require("../models/Attendance");
const Marks = require("../models/Marks");

const { encrypt, decrypt } = require("../utils/crypto");
const { refreshSchedule } = require("../utils/backupScheduler");

router.use(auth, isAdmin);

async function getSingleton(Model, defaults = {}) {
  let doc = await Model.findOne();
  if (!doc) {
    doc = await Model.create(defaults);
  }
  return doc;
}

// -------------------------
// Logo upload
// -------------------------
const uploadsDir = path.join(process.cwd(), "backend", "uploads");
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^\w.\-]/g, "_");
    cb(null, `${Date.now()}_${safe}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// -------------------------
// System settings
// -------------------------
router.get("/system", async (_req, res) => {
  const doc = await getSingleton(SystemSettings);
  res.json({ settings: doc });
});

router.put("/system", async (req, res) => {
  const doc = await getSingleton(SystemSettings);
  const { institutionName, timezone, language, theme } = req.body;

  if (typeof institutionName === "string") doc.institutionName = institutionName.trim();
  if (typeof timezone === "string") doc.timezone = timezone.trim();
  if (typeof language === "string") doc.language = language.trim();
  if (theme === "light" || theme === "dark") doc.theme = theme;

  await doc.save();
  res.json({ message: "System settings updated", settings: doc });
});

router.post("/system/logo", upload.single("logo"), async (req, res) => {
  const doc = await getSingleton(SystemSettings);
  const file = req.file;
  if (!file) return res.status(400).json({ error: "Logo file is required" });

  doc.logoUrl = `/uploads/${file.filename}`;
  await doc.save();
  res.json({ message: "Logo uploaded", logoUrl: doc.logoUrl, settings: doc });
});

// -------------------------
// Email settings
// -------------------------
router.get("/email", async (_req, res) => {
  const doc = await getSingleton(EmailSettings);
  res.json({
    settings: {
      smtpHost: doc.smtpHost,
      smtpPort: doc.smtpPort,
      username: doc.username,
      senderEmail: doc.senderEmail,
      secure: doc.secure,
      hasPassword: !!doc.passwordEnc,
    },
  });
});

router.put("/email", async (req, res) => {
  const doc = await getSingleton(EmailSettings);
  const { smtpHost, smtpPort, username, password, senderEmail, secure } = req.body;

  if (typeof smtpHost === "string") doc.smtpHost = smtpHost.trim();
  if (smtpPort !== undefined) doc.smtpPort = Number(smtpPort);
  if (typeof username === "string") doc.username = username.trim();
  if (typeof senderEmail === "string") doc.senderEmail = senderEmail.trim();
  if (typeof secure === "boolean") doc.secure = secure;
  if (typeof password === "string" && password.length > 0) {
    doc.passwordEnc = encrypt(password);
  }

  await doc.save();
  res.json({ message: "Email settings updated" });
});

router.post("/email/test", async (req, res) => {
  const { to } = req.body;
  if (!to || !/\S+@\S+\.\S+/.test(to)) {
    return res.status(400).json({ error: "Valid 'to' email is required" });
  }

  const doc = await getSingleton(EmailSettings);
  if (!doc.smtpHost || !doc.smtpPort || !doc.username || !doc.passwordEnc) {
    return res.status(400).json({ error: "SMTP settings are incomplete" });
  }

  const transporter = nodemailer.createTransport({
    host: doc.smtpHost,
    port: doc.smtpPort,
    secure: !!doc.secure,
    auth: {
      user: doc.username,
      pass: decrypt(doc.passwordEnc),
    },
  });

  await transporter.sendMail({
    from: doc.senderEmail || doc.username,
    to,
    subject: "ESAM-ERP SMTP Test",
    text: "SMTP configuration looks good.",
  });

  res.json({ message: "Test email sent" });
});

// -------------------------
// Backup settings + manual backup
// -------------------------
router.get("/backup", async (_req, res) => {
  const doc = await getSingleton(BackupSettings);
  res.json({ settings: doc });
});

router.put("/backup", async (req, res) => {
  const doc = await getSingleton(BackupSettings);
  const { schedule } = req.body;
  if (["off", "daily", "weekly"].includes(schedule)) doc.schedule = schedule;
  await doc.save();
  await refreshSchedule();
  res.json({ message: "Backup settings updated", settings: doc });
});

router.post("/backup/manual", async (_req, res) => {
  const meta = {
    generatedAt: new Date().toISOString(),
    app: "ESAM-ERP",
  };

  const data = {
    meta,
    departments: await Department.find().lean(),
    teachers: await Teacher.find().lean(),
    students: await Student.find().lean(),
    subjects: await Subject.find().lean(),
    attendance: await Attendance.find().lean(),
    marks: await Marks.find().lean(),
    roles: await Role.find().lean(),
    academicYears: await AcademicYear.find().lean(),
    holidays: await Holiday.find().lean(),
    systemSettings: await SystemSettings.findOne().lean(),
    emailSettings: await EmailSettings.findOne().lean(),
  };

  const doc = await getSingleton(BackupSettings);
  doc.lastBackupAt = new Date();
  doc.lastBackupStatus = "success";
  doc.lastBackupMessage = "Backup generated";
  await doc.save();

  const filename = `esam-erp-backup-${new Date().toISOString().slice(0, 10)}.json`;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(JSON.stringify(data, null, 2));
});

// -------------------------
// Roles & permissions
// -------------------------
router.get("/roles", async (_req, res) => {
  const existingCount = await Role.countDocuments();
  if (existingCount === 0) {
    await Role.insertMany([
      {
        name: "admin",
        description: "System administrator",
        permissions: {
          dashboard: { view: true, create: true, edit: true, delete: true },
          students: { view: true, create: true, edit: true, delete: true },
          teachers: { view: true, create: true, edit: true, delete: true },
          subjects: { view: true, create: true, edit: true, delete: true },
          departments: { view: true, create: true, edit: true, delete: true },
          attendance: { view: true, create: true, edit: true, delete: true },
          reports: { view: true, create: true, edit: true, delete: true },
          settings: { view: true, create: true, edit: true, delete: true },
        },
        isSystem: true,
      },
      {
        name: "hod",
        description: "Head of Department",
        permissions: {
          dashboard: { view: true, create: false, edit: false, delete: false },
          students: { view: true, create: true, edit: true, delete: false },
          teachers: { view: true, create: true, edit: true, delete: false },
          subjects: { view: true, create: true, edit: true, delete: false },
          departments: { view: true, create: false, edit: false, delete: false },
          attendance: { view: true, create: true, edit: true, delete: false },
          reports: { view: true, create: false, edit: false, delete: false },
          settings: { view: false, create: false, edit: false, delete: false },
        },
        isSystem: true,
      },
      {
        name: "teacher",
        description: "Teacher user",
        permissions: {
          dashboard: { view: true, create: false, edit: false, delete: false },
          students: { view: true, create: false, edit: false, delete: false },
          teachers: { view: false, create: false, edit: false, delete: false },
          subjects: { view: true, create: false, edit: false, delete: false },
          departments: { view: false, create: false, edit: false, delete: false },
          attendance: { view: true, create: true, edit: true, delete: false },
          reports: { view: true, create: false, edit: false, delete: false },
          settings: { view: false, create: false, edit: false, delete: false },
        },
        isSystem: true,
      },
      {
        name: "student",
        description: "Student user",
        permissions: {
          dashboard: { view: true, create: false, edit: false, delete: false },
          students: { view: false, create: false, edit: false, delete: false },
          teachers: { view: false, create: false, edit: false, delete: false },
          subjects: { view: true, create: false, edit: false, delete: false },
          departments: { view: false, create: false, edit: false, delete: false },
          attendance: { view: true, create: false, edit: false, delete: false },
          reports: { view: true, create: false, edit: false, delete: false },
          settings: { view: false, create: false, edit: false, delete: false },
        },
        isSystem: true,
      },
    ]);
  }

  const roles = await Role.find().sort({ name: 1 });
  res.json({ roles });
});

router.post("/roles", async (req, res) => {
  const { name, description, permissions } = req.body;
  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: "Role name is required" });
  }
  const role = await Role.create({
    name: String(name).trim(),
    description: description || "",
    permissions: permissions || undefined,
  });
  res.status(201).json({ message: "Role created", role });
});

router.put("/roles/:id", async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (!role) return res.status(404).json({ error: "Role not found" });
  if (role.isSystem) return res.status(400).json({ error: "System roles cannot be edited" });

  const { name, description, permissions } = req.body;
  if (typeof name === "string" && name.trim()) role.name = name.trim();
  if (typeof description === "string") role.description = description;
  if (permissions && typeof permissions === "object") role.permissions = permissions;

  await role.save();
  res.json({ message: "Role updated", role });
});

router.delete("/roles/:id", async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (!role) return res.status(404).json({ error: "Role not found" });
  if (role.isSystem) return res.status(400).json({ error: "System roles cannot be deleted" });
  await Role.findByIdAndDelete(req.params.id);
  res.json({ message: "Role deleted" });
});

// -------------------------
// Academic years
// -------------------------
router.get("/academic-years", async (_req, res) => {
  const years = await AcademicYear.find().sort({ startDate: -1 });
  res.json({ years });
});

router.post("/academic-years", async (req, res) => {
  const { name, startDate, endDate, isActive } = req.body;
  if (!name || !startDate || !endDate) {
    return res.status(400).json({ error: "Name, startDate and endDate are required" });
  }

  if (isActive) {
    await AcademicYear.updateMany({}, { $set: { isActive: false } });
  }

  const year = await AcademicYear.create({
    name: String(name).trim(),
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    isActive: !!isActive,
  });
  res.status(201).json({ message: "Academic year created", year });
});

router.put("/academic-years/:id", async (req, res) => {
  const year = await AcademicYear.findById(req.params.id);
  if (!year) return res.status(404).json({ error: "Academic year not found" });

  const { name, startDate, endDate, isActive } = req.body;
  if (typeof name === "string" && name.trim()) year.name = name.trim();
  if (startDate) year.startDate = new Date(startDate);
  if (endDate) year.endDate = new Date(endDate);
  if (typeof isActive === "boolean") {
    if (isActive) {
      await AcademicYear.updateMany({ _id: { $ne: year._id } }, { $set: { isActive: false } });
    }
    year.isActive = isActive;
  }

  await year.save();
  res.json({ message: "Academic year updated", year });
});

router.delete("/academic-years/:id", async (req, res) => {
  const year = await AcademicYear.findByIdAndDelete(req.params.id);
  if (!year) return res.status(404).json({ error: "Academic year not found" });
  res.json({ message: "Academic year deleted" });
});

// -------------------------
// Holidays
// -------------------------
router.get("/holidays", async (_req, res) => {
  const holidays = await Holiday.find().sort({ date: 1 });
  res.json({ holidays });
});

router.post("/holidays", async (req, res) => {
  const { name, date, description } = req.body;
  if (!name || !date) return res.status(400).json({ error: "Name and date are required" });

  const holiday = await Holiday.create({
    name: String(name).trim(),
    date: new Date(date),
    description: description || "",
  });
  res.status(201).json({ message: "Holiday created", holiday });
});

router.put("/holidays/:id", async (req, res) => {
  const holiday = await Holiday.findById(req.params.id);
  if (!holiday) return res.status(404).json({ error: "Holiday not found" });

  const { name, date, description } = req.body;
  if (typeof name === "string" && name.trim()) holiday.name = name.trim();
  if (date) holiday.date = new Date(date);
  if (typeof description === "string") holiday.description = description;

  await holiday.save();
  res.json({ message: "Holiday updated", holiday });
});

router.delete("/holidays/:id", async (req, res) => {
  const holiday = await Holiday.findByIdAndDelete(req.params.id);
  if (!holiday) return res.status(404).json({ error: "Holiday not found" });
  res.json({ message: "Holiday deleted" });
});

// -------------------------
// Notifications
// -------------------------
router.get("/notifications", async (_req, res) => {
  const doc = await getSingleton(NotificationSettings);
  res.json({ settings: doc });
});

router.put("/notifications", async (req, res) => {
  const doc = await getSingleton(NotificationSettings);
  const { inAppEnabled, emailEnabled, smsEnabled, pushEnabled } = req.body;

  if (typeof inAppEnabled === "boolean") doc.inAppEnabled = inAppEnabled;
  if (typeof emailEnabled === "boolean") doc.emailEnabled = emailEnabled;
  if (typeof smsEnabled === "boolean") doc.smsEnabled = smsEnabled;
  if (typeof pushEnabled === "boolean") doc.pushEnabled = pushEnabled;

  await doc.save();
  res.json({ message: "Notification settings updated", settings: doc });
});

router.get("/notifications/templates", async (_req, res) => {
  const templates = await NotificationTemplate.find().sort({ key: 1, channel: 1 });
  res.json({ templates });
});

router.post("/notifications/templates", async (req, res) => {
  const { key, channel, name, subject, body, enabled } = req.body;
  if (!key || !String(key).trim()) return res.status(400).json({ error: "Template key is required" });
  if (!channel || !["inapp", "email", "sms", "push"].includes(channel)) {
    return res.status(400).json({ error: "Valid channel is required" });
  }
  if (body === undefined || String(body).trim().length === 0) {
    return res.status(400).json({ error: "Template body is required" });
  }

  const tpl = await NotificationTemplate.create({
    key: String(key).trim(),
    channel,
    name: typeof name === "string" ? name : "",
    subject: typeof subject === "string" ? subject : "",
    body: String(body),
    enabled: enabled === undefined ? true : !!enabled,
  });
  res.status(201).json({ message: "Template created", template: tpl });
});

router.put("/notifications/templates/:id", async (req, res) => {
  const tpl = await NotificationTemplate.findById(req.params.id);
  if (!tpl) return res.status(404).json({ error: "Template not found" });

  const { key, channel, name, subject, body, enabled } = req.body;
  if (typeof key === "string" && key.trim()) tpl.key = key.trim();
  if (typeof channel === "string" && ["inapp", "email", "sms", "push"].includes(channel)) {
    tpl.channel = channel;
  }
  if (typeof name === "string") tpl.name = name;
  if (typeof subject === "string") tpl.subject = subject;
  if (typeof body === "string") tpl.body = body;
  if (typeof enabled === "boolean") tpl.enabled = enabled;

  await tpl.save();
  res.json({ message: "Template updated", template: tpl });
});

router.delete("/notifications/templates/:id", async (req, res) => {
  const tpl = await NotificationTemplate.findByIdAndDelete(req.params.id);
  if (!tpl) return res.status(404).json({ error: "Template not found" });
  res.json({ message: "Template deleted" });
});

module.exports = router;


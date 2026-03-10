const path = require("path");
const fs = require("fs");
const cron = require("node-cron");

const BackupSettings = require("../models/BackupSettings");
const SystemSettings = require("../models/SystemSettings");
const EmailSettings = require("../models/EmailSettings");
const Role = require("../models/Role");
const AcademicYear = require("../models/AcademicYear");
const Holiday = require("../models/Holiday");

const Department = require("../models/Department");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Attendance = require("../models/Attendance");
const Marks = require("../models/Marks");

const backupsDir = path.join(process.cwd(), "backend", "backups");

async function generateBackupFile() {
  const meta = { generatedAt: new Date().toISOString(), app: "ESAM-ERP" };
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

  if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `esam-erp-backup-${stamp}.json`;
  const filePath = path.join(backupsDir, filename);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  return { filePath, filename };
}

let currentTask = null;

async function runBackupNow(reason = "scheduled") {
  const settings = await BackupSettings.findOne();
  if (!settings) return;

  settings.lastBackupAt = new Date();
  settings.lastBackupMessage = `Backup started (${reason})`;
  settings.lastBackupStatus = "never";
  await settings.save();

  try {
    const { filename } = await generateBackupFile();
    settings.lastBackupAt = new Date();
    settings.lastBackupStatus = "success";
    settings.lastBackupMessage = `Backup completed (${reason}): ${filename}`;
    await settings.save();
  } catch (err) {
    settings.lastBackupAt = new Date();
    settings.lastBackupStatus = "failed";
    settings.lastBackupMessage = `Backup failed (${reason}): ${err.message}`;
    await settings.save();
  }
}

async function refreshSchedule() {
  const settings = await BackupSettings.findOne();
  if (!settings) return;

  if (currentTask) {
    currentTask.stop();
    currentTask = null;
  }

  if (settings.schedule === "daily") {
    // 02:00 every day
    currentTask = cron.schedule("0 2 * * *", () => runBackupNow("daily"));
  } else if (settings.schedule === "weekly") {
    // 02:00 every Sunday
    currentTask = cron.schedule("0 2 * * 0", () => runBackupNow("weekly"));
  }
}

async function initBackupScheduler() {
  // Ensure singleton exists
  const existing = await BackupSettings.findOne();
  if (!existing) {
    await BackupSettings.create({});
  }
  await refreshSchedule();
}

module.exports = { initBackupScheduler, refreshSchedule, runBackupNow };


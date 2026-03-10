const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/rbac");
const Notification = require("../models/Notification");
const { sendNotification } = require("../utils/notificationService");

// All routes here require auth
router.use(auth);

// Get current user's notifications
router.get("/", async (req, res) => {
  const userId = req.user.id;
  const items = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ notifications: items });
});

// Mark one notification as read
router.post("/:id/read", async (req, res) => {
  const userId = req.user.id;
  const notif = await Notification.findOne({ _id: req.params.id, userId });
  if (!notif) return res.status(404).json({ error: "Notification not found" });
  notif.readAt = new Date();
  await notif.save();
  res.json({ message: "Notification marked as read", notification: notif });
});

// Mark all as read
router.post("/read-all", async (req, res) => {
  const userId = req.user.id;
  await Notification.updateMany(
    { userId, readAt: null },
    { $set: { readAt: new Date() } },
  );
  res.json({ message: "All notifications marked as read" });
});

// ----- Admin-only helpers below -----

// Simple admin endpoint to send a test notification to any user
router.post("/admin/send-test", isAdmin, async (req, res) => {
  const { userId, email, key, data, channels } = req.body;
  if (!userId && !email) {
    return res.status(400).json({ error: "userId or email is required" });
  }
  if (!key) {
    return res.status(400).json({ error: "Template key is required" });
  }

  await sendNotification({ userId, email, key, channels, data });
  res.json({ message: "Test notification sent" });
});

module.exports = router;


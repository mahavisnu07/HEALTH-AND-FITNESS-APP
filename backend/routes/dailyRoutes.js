import express from "express";
import db from "../db.js";

const router = express.Router();

// ➕ Add a new daily task with optional reminder time
router.post("/", async (req, res) => {
  const { user_id, task, reminder_time } = req.body;

  if (!user_id || !task) {
    return res.status(400).json({ message: "User ID and task are required" });
  }

  try {
    await db.query(
      `INSERT INTO daily_planner (user_id, task, status, reminder_time)
       VALUES ($1, $2, 'pending', $3)`,
      [user_id, task, reminder_time || null]
    );
    res.status(201).json({ message: "Task added successfully" });
  } catch (err) {
    console.error("❌ Error adding task:", err);
    res.status(500).json({ message: "Error adding task" });
  }
});

// 📋 Fetch all daily tasks
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM daily_planner WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching tasks:", err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// ✅ Update task status
router.put("/status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query("UPDATE daily_planner SET status = $1 WHERE id = $2", [
      status,
      id,
    ]);
    res.json({ message: "Task status updated successfully" });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ message: "Error updating task status" });
  }
});

// 🕒 Update reminder time
router.put("/reminder/:id", async (req, res) => {
  const { id } = req.params;
  const { reminder_time } = req.body;

  try {
    await db.query("UPDATE daily_planner SET reminder_time = $1 WHERE id = $2", [
      reminder_time,
      id,
    ]);
    res.json({ message: "Reminder time updated successfully" });
  } catch (err) {
    console.error("❌ Error updating reminder time:", err);
    res.status(500).json({ message: "Error updating reminder time" });
  }
});

// ❌ Delete a daily task
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM daily_planner WHERE id = $1", [id]);
    res.json({ message: "Task removed successfully" });
  } catch (err) {
    console.error("❌ Error deleting task:", err);
    res.status(500).json({ message: "Error deleting task" });
  }
});

export default router;

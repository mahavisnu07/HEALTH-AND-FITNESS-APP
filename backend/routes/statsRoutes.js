import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const [bmiCount, dietCount, taskCount] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM bmi_records WHERE user_id=$1", [user_id]),
      pool.query("SELECT COUNT(*) FROM diet_plans WHERE user_id=$1", [user_id]),
      pool.query("SELECT COUNT(*) FROM daily_planner WHERE user_id=$1 AND status='completed'", [user_id]),
    ]);

    res.json({
      bmi_entries: bmiCount.rows[0].count,
      diet_entries: dietCount.rows[0].count,
      tasks_completed: taskCount.rows[0].count,
    });
  } catch {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

export default router;

import express from "express";
import auth from "../middleware/auth.js";
import pool from "../db.js";

const router = express.Router();

(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS planners (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      date DATE,
      title VARCHAR(255),
      details TEXT,
      completed BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
})();

// Create / add planner item
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, title, details } = req.body;
    if (!date || !title) return res.status(400).json({ message: "Date and title required" });

    const result = await pool.query(
      "INSERT INTO planners (user_id, date, title, details) VALUES ($1,$2,$3,$4) RETURNING *",
      [userId, date, title, details || null]
    );
    res.status(201).json({ message: "Planner item added", item: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get planner items for a date or range
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query; // optional - if provided, filter by date
    let q;
    if (date) {
      q = await pool.query("SELECT * FROM planners WHERE user_id=$1 AND date=$2 ORDER BY created_at DESC", [userId, date]);
    } else {
      q = await pool.query("SELECT * FROM planners WHERE user_id=$1 ORDER BY date DESC, created_at DESC", [userId]);
    }
    res.json(q.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle complete
router.put("/:id/toggle", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const q = await pool.query("UPDATE planners SET completed = NOT completed WHERE id = $1 AND user_id = $2 RETURNING *", [id, userId]);
    if (!q.rows.length) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Toggled", item: q.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

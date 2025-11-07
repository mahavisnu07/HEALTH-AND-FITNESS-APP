import express from "express";
import auth from "../middleware/auth.js";
import pool from "../db.js";

const router = express.Router();


router.get("/profile", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const q = await pool.query("SELECT id, name, email, age, gender, created_at FROM users WHERE id = $1", [userId]);
    if (!q.rows.length) return res.status(404).json({ message: "User not found" });
    res.json(q.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

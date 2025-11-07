import express from "express";
import db from "../db.js";

const router = express.Router();

// ✅ Add a new diet plan
router.post("/", async (req, res) => {
  const { user_id, title, plan_details } = req.body;

  if (!user_id || !title || !plan_details) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await db.query(
      "INSERT INTO diet_plans (user_id, title, plan_details) VALUES ($1, $2, $3)",
      [user_id, title, plan_details]
    );
    res.status(201).json({ message: "Diet plan saved successfully" });
  } catch (err) {
    console.error("❌ Error saving diet plan:", err);
    res.status(500).json({ message: "Error saving diet plan" });
  }
});

// ✅ Fetch all diet plans for a user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM diet_plans WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching diet plans:", err);
    res.status(500).json({ message: "Error fetching diet plans" });
  }
});

// ✅ Delete a diet plan
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM diet_plans WHERE id = $1", [id]);
    res.json({ message: "Diet plan deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting diet plan:", err);
    res.status(500).json({ message: "Error deleting diet plan" });
  }
});

export default router;

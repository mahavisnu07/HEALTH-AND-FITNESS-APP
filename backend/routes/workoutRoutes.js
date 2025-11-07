import express from "express";
const router = express.Router();

export default (db) => {
  router.post("/", async (req, res) => {
    const { user_id, workout_type, reps, duration_minutes } = req.body;

    if (!user_id || !workout_type) {
      return res.status(400).json({ message: "User ID and workout type required" });
    }

    try {
      let calories = 0;
      const METS = {
        Pushups: 7,
        Squats: 5,
        Running: 10,
        Cycling: 8,
        Plank: 4,
        JumpingJacks: 8,
      };

      if (duration_minutes) {
        calories = Math.round(METS[workout_type] * duration_minutes * 5);
      } else if (reps) {
        calories = Math.round(METS[workout_type] * reps * 0.5);
      }

      await db.query(
        `INSERT INTO workouts (user_id, workout_type, reps, duration_minutes, calories_burned)
         VALUES ($1, $2, $3, $4, $5)`,
        [user_id, workout_type, reps || null, duration_minutes || null, calories]
      );

      res.status(201).json({ message: "Workout saved!", calories_burned: calories });
    } catch (err) {
      console.error("❌ Error saving workout:", err);
      res.status(500).json({ message: "Error saving workout" });
    }
  });

 
  router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const result = await db.query(
        `SELECT * FROM workouts WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error("❌ Error fetching workouts:", err);
      res.status(500).json({ message: "Error fetching workouts" });
    }
  });


  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await db.query("DELETE FROM workouts WHERE id = $1", [id]);
      res.json({ message: "Workout deleted" });
    } catch (err) {
      console.error("❌ Error deleting workout:", err);
      res.status(500).json({ message: "Error deleting workout" });
    }
  });

  return router;
};

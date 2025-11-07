import express from "express";

export default (db) => {
  const router = express.Router();


  router.get("/:userId/stats", async (req, res) => {
    const { userId } = req.params;

    try {
      const [bmi, diet, daily, workouts] = await Promise.all([
        db.query("SELECT COUNT(*) FROM bmi_records WHERE user_id = $1", [userId]),
        db.query("SELECT COUNT(*) FROM diet_plans WHERE user_id = $1", [userId]),
        db.query(
          "SELECT COUNT(*) AS completed FROM daily_planner WHERE user_id = $1 AND status = 'completed'",
          [userId]
        ),
        db.query(
          "SELECT COALESCE(SUM(calories_burned), 0) AS calories FROM workouts WHERE user_id = $1",
          [userId]
        ),
      ]);

      res.json({
        total_bmi: bmi.rows[0].count,
        total_diets: diet.rows[0].count,
        completed_tasks: daily.rows[0].completed,
        calories_burned: workouts.rows[0].calories,
      });
    } catch (err) {
      console.error("❌ Error fetching profile stats:", err);
      res.status(500).json({ message: "Error fetching stats" });
    }
  });


  router.post("/delete", async (req, res) => {
    const { user_id, email, password, motive } = req.body;

    if (!user_id || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    try {
  
      const user = await db.query("SELECT * FROM users WHERE id = $1", [user_id]);
      if (user.rows.length === 0)
        return res.status(404).json({ message: "User not found" });

      const bcrypt = (await import("bcryptjs")).default;
      const isMatch = await bcrypt.compare(password, user.rows[0].password);

      if (!isMatch)
        return res.status(401).json({ message: "Invalid password" });

      await db.query(
        "INSERT INTO deleted_accounts (user_id, email, motive) VALUES ($1, $2, $3)",
        [user_id, email, motive]
      );

      await db.query("DELETE FROM users WHERE id = $1", [user_id]);

      res.json({ message: "Account deleted successfully" });
    } catch (err) {
      console.error("❌ Error deleting account:", err);
      res.status(500).json({ message: "Error deleting account" });
    }
  });

  return router;
};

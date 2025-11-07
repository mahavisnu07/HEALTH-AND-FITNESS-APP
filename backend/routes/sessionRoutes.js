import express from "express";

export default (db) => {
  const router = express.Router();

  router.post("/login", async (req, res) => {
    const { user_id } = req.body;

    if (!user_id)
      return res.status(400).json({ message: "User ID is required" });

    try {
      await db.query(
        "INSERT INTO user_sessions (user_id, login_time) VALUES ($1, CURRENT_TIMESTAMP)",
        [user_id]
      );
      res.status(201).json({ message: "Session started" });
    } catch (err) {
      console.error("❌ Error starting session:", err);
      res.status(500).json({ message: "Error starting session" });
    }
  });


  router.post("/logout", async (req, res) => {
    const { user_id } = req.body;

    if (!user_id)
      return res.status(400).json({ message: "User ID is required" });

    try {
      const result = await db.query(
        `UPDATE user_sessions
         SET logout_time = CURRENT_TIMESTAMP,
             duration_minutes = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - login_time)) / 60
         WHERE user_id = $1 AND logout_time IS NULL
         RETURNING duration_minutes`,
        [user_id]
      );

      if (result.rowCount === 0)
        return res.status(404).json({ message: "No active session found" });

      res.json({ message: "Session ended", duration: result.rows[0].duration_minutes });
    } catch (err) {
      console.error("❌ Error ending session:", err);
      res.status(500).json({ message: "Error ending session" });
    }
  });

 router.get("/:userId/total-time", async (req, res) => {
  const { userId } = req.params;
  try {
    await db.query(
      `UPDATE user_sessions
       SET logout_time = CURRENT_TIMESTAMP,
           duration_minutes = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - login_time)) / 60
       WHERE user_id = $1 AND logout_time IS NULL`,
      [userId]
    );

    const result = await db.query(
      `SELECT COALESCE(SUM(duration_minutes), 0) AS total_time
       FROM user_sessions WHERE user_id = $1`,
      [userId]
    );
    res.json({ total_time: parseFloat(result.rows[0].total_time).toFixed(1) });
  } catch (err) {
    console.error("❌ Error fetching total time:", err);
    res.status(500).json({ message: "Error fetching time data" });
  }
});


  return router;
};

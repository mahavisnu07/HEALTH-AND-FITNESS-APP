import express from "express";

const router = express.Router();

export default (db) => {
  router.post("/", async (req, res) => {
    const { user_id, height, weight, age, gender, bmi, category } = req.body;

    if (!user_id || !height || !weight || !bmi || !category) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    try {
      await db.query(
        `INSERT INTO bmi_records (user_id, height, weight, age, gender, bmi, category)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [user_id, height, weight, age || null, gender, bmi, category]
      );

      res.status(201).json({ message: "BMI record saved successfully" });
    } catch (err) {
      console.error("❌ Error saving BMI record:", err);
      res.status(500).json({ message: "Error saving BMI record" });
    }
  });

  router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
      const result = await db.query(
        `SELECT * FROM bmi_records 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT 1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "No BMI records found for this user" });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error("❌ Error fetching BMI record:", err);
      res.status(500).json({ message: "Error fetching BMI data" });
    }
  });

  return router;
};

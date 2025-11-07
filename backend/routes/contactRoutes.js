import express from "express";
import db from "../db.js";

const router = express.Router();

// Save contact message
router.post("/", async (req, res) => {
  const { user_id, message } = req.body;

  try {
    await db.query(
      "INSERT INTO contact_messages (user_id, message) VALUES ($1, $2)",
      [user_id, message]
    );
    res.status(201).json({ message: "Message saved successfully" });
  } catch (err) {
    console.error("❌ Error saving message:", err);
    res.status(500).json({ message: "Error saving message" });
  }
});

// Fetch messages
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM contact_messages WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    res.status(500).json({ message: "Error fetching messages" });
  }
});


router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM contact_messages WHERE id = $1", [id]);
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting message:", err);
    res.status(500).json({ message: "Error deleting message" });
  }
});

export default router;

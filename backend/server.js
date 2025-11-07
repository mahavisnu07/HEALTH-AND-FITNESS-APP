import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcryptjs";
import bmiRoutes from "./routes/bmiRoutes.js";
import dailyRoutes from "./routes/dailyRoutes.js";
import dietRoutes from "./routes/dietRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";




const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ PostgreSQL connection
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "health_fitness",
  password: "2005", // change to your actual password
  port: 5432,
});

db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Database connection error:", err));

// ✅ Signup route
app.post("/api/signup", async (req, res) => {
  console.log("📥 Signup request received:", req.body);
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );
    console.log("✅ New user registered:", email);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// ✅ Login route
app.post("/api/login", async (req, res) => {
  console.log("📥 Login request received:", req.body);
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      console.log("❌ User not found");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ Wrong password");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("✅ Login successful for", email);
    return res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("🔥 Server error during login:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

app.get("/", (req, res) => {
  res.send("Fitness App Backend Running ✅");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Register route
// ✅ Register routes (without passing db)
app.use("/api/bmi", bmiRoutes(db));
app.use("/api/daily", dailyRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/profile", profileRoutes(db));
app.use("/api/workouts", workoutRoutes(db));
app.use("/api/session", sessionRoutes(db));




import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "health_fitness",
  password: "2005",
  port: 5432,
});

db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ Database connection error:", err));

export default db;

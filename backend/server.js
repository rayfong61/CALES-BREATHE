import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 連線PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 測試API
app.get("/", (req, res) => {
  res.send("伺服器正常運作中！");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

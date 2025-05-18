import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const createTables = async () => {
  try {
    // 建立 client 表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS client (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(100) NOT NULL,
        contact_mobile VARCHAR(20),
        contact_mail VARCHAR(100),
        birthday DATE,
        address VARCHAR(255),
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        provider VARCHAR(20) DEFAULT 'local',
        provider_id TEXT,
        photo TEXT
      );
    `);
    console.log("✅ client 資料表建立完成");

    // 建立 orders 表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES client(id),
        booking_detail JSONB,
        total_price INTEGER,
        total_duration INTEGER,
        booking_date DATE,
        booking_time TIME,
        created_at TIMESTAMP DEFAULT NOW(),
        booking_note TEXT,
        is_cancelled BOOLEAN DEFAULT false
      );
    `);
    console.log("✅ orders 資料表建立完成");

    pool.end();
  } catch (err) {
    console.error("❌ 資料表建立失敗:", err);
    pool.end();
  }
};

createTables();

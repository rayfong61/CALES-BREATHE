import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import bcrypt from "bcrypt"; // 加密密碼


dotenv.config();

const app = express();
const saltRounds = 10;
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(cors());
app.use(express.json());

// 連線PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log("資料庫連線字串:", process.env.DATABASE_URL);


// 測試API
app.get("/", (req, res) => {
  res.send("伺服器正常運作中！");
});


// 建立「顧客註冊」API (POST /register)
app.post("/register", async (req, res) => {
  const { client_name, contact_mobile, contact_mail, birthday, address, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      `INSERT INTO client (client_name, contact_mobile, contact_mail, birthday, address, password)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, client_name, contact_mail`,
      [client_name, contact_mobile, contact_mail, birthday, address, hashedPassword]
    );

    res.status(201).json({ message: "註冊成功", user: result.rows[0] });
    console.log(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "註冊失敗" });
  }
});

// 建立「顧客登入」API (POST /login)
app.post("/login" ,async (req, res) => {
  const { contact_mail, password } = req.body;

  try {
      const userResult = await pool.query(
        `SELECT * FROM client WHERE contact_mail = $1`,
        [contact_mail]
      );

      if (userResult.rows.length === 0){
        return res.status(401).json({ message: "找不到帳號" });
      }

      const user = userResult.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid){
        return res.status(401).json({ message: "密碼錯誤" });
      }

      res.json({ message: "登入成功", 
                user: { id: user.id, client_name: user.client_name } });
    
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "登入失敗" });
    }
});

// 建立「新增預約」API (POST /orders)

app.post("/orders", async (req, res) => {
  const { client_id, booking_detail, total_price, total_duration, booking_date, booking_time } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO orders (client_id, booking_detail, total_price, total_duration, booking_date, booking_time)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [client_id, booking_detail, total_price, total_duration, booking_date, booking_time]
    );

    res.status(201).json({ message: "預約成功", orderId: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "預約失敗" });
  }
});

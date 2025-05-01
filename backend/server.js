import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import bcrypt from "bcrypt"; 
import session from "express-session";
import passport from "passport";
import "./auth-google.js"; 
import "./auth-line.js";
import "./passport-config.js";



dotenv.config();

const app = express();
const saltRounds = 10;
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// 連線PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Session 設定（可簡化）
app.use(session({
  secret: process.env.SESSION_SECRET, // 從 .env 檔讀取密鑰
  resave: false,                      // 沒有變更就不重新儲存 session
  saveUninitialized: false,          // 沒登入就不產生 session
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,     // session 有效期：1 天
    secure: false,                   // 若使用 HTTPS，請設為 true
    httpOnly: true                   // 限瀏覽器端無法透過 JS 存取 cookie
  }
}));

app.use(passport.initialize());
app.use(passport.session());


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
      `INSERT INTO client (client_name, contact_mobile, contact_mail, birthday, address, password, provider)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, client_name, contact_mail`,
      [client_name, contact_mobile, contact_mail, birthday, address, hashedPassword, "local"]
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
        `SELECT * FROM client WHERE contact_mail = $1 AND provider = $2`,
        [contact_mail, "local"]
      );

      if (userResult.rows.length === 0){
        return res.status(401).json({ message: "找不到帳號" });
      }

      const user = userResult.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid){
        return res.status(401).json({ message: "密碼錯誤" });
      }

      req.login(user, (err) => {
        if (err) return next(err);
        console.log("登入成功的使用者：", req.user);
        return res.json({
          message: "登入成功",
          user: { id: user.id, client_name: user.client_name },
        });
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "登入失敗" });
    }
  });


// 導向 Google 登入
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {

    console.log("登入成功的使用者：", req.user);

    // 成功登入後可以 redirect 或回傳 token
    // res.redirect("/dashboard"); // 或回傳 user 資訊
    // res.json({ message: "登入成功", 
    //   user: { id: req.user.id, client_name: req.user.client_name } });
    res.redirect("http://localhost:3000/account");

  }
);


// 導向 Line 登入
app.get("/auth/line", passport.authenticate("line"));

app.get("/auth/line/callback", passport.authenticate("line", { failureRedirect: "/login" }),
  (req, res) => {

    console.log("登入成功的使用者：", req.user);

    // res.redirect("/dashboard");
    // res.json({ message: "登入成功", 
    //   user: { id: req.user.id, client_name: req.user.client_name } });
    res.redirect("http://localhost:3000/account");
  }
);

// 登出
app.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) { return res.status(500).json({ message: "登出失敗" }); }
    res.json({ message: "登出成功" });
  });
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

// 測試:檢查 session 是否維持
// app.get("/me", (req, res) => {
//   if (req.isAuthenticated()) {
//     res.json({
//       loggedIn: true,
//       user: req.user
//     });
//   } else {
//     res.json({ loggedIn: false });
//   }
// });

app.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});
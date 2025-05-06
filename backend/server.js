import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import bcrypt from "bcrypt"; 
import session from "express-session";
import passport from "passport";
import "./auth-google.js"; 
import "./auth-line.js";
import "./passport-config.js";
import accountRoutes from "./accountRoutes.js";  // 專門處理帳戶相關的 API，如註冊、登入、帳戶資料修改

dotenv.config();

const app = express();
const saltRounds = 10;
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(cors({                          // 設定 跨來源資源分享（CORS）
  origin: FRONTEND_URL,     // 只允許這個來源的瀏覽器發出請求
  credentials: true                    // 允許瀏覽器攜帶 cookie / session 資訊（例如登入後的 session）
}));

app.use(express.json());  
// 啟用 Express 內建的 JSON 解析器, 可以處理 Content-Type: application/json 的 POST 請求。
// 註冊、登入、預約等 API，使用 axios.post() 傳送 JSON 時，這段設定會自動解析 JSON 變成 req.body。

app.use(express.urlencoded({ extended: true })); //  功能：處理表單資料（application/x-www-form-urlencoded）
app.use("/uploads", express.static("uploads")); // 功能：提供 /uploads 路徑來存取伺服器上的靜態圖片或檔案。



// Session 設定（可簡化）
app.use(session({
  secret: process.env.SESSION_SECRET, // 從 .env 檔讀取密鑰
  resave: false,                      // 沒有變更就不重新儲存 session
  saveUninitialized: false,          // 沒登入就不產生 session
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,     // session 有效期：1 天
    secure: false,                   // 若使用 HTTPS，應設為 true
    httpOnly: true                   // 限瀏覽器端無法透過 JS 存取 cookie
  }
}));

app.use(passport.initialize());  // 啟用 Passport 認證功能
app.use(passport.session());  // 讓 Passport 綁定 session，維持登入狀態

app.use("/", accountRoutes); // 所有被定義在 accountRoutes 裡的路由都會從 / 開始向下套用。




// 建立「顧客註冊」API (POST /register)
app.post("/register", async (req, res) => {
  const { client_name, contact_mail, password } = req.body;

  try {
    // 檢查 email 是否已經存在
    const emailCheck = await pool.query(
      `SELECT id FROM client WHERE contact_mail = $1 AND provider = $2`,
      [contact_mail, "local"]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "此 Email 已被註冊" });
    }
    
    // hash客戶密碼
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      `INSERT INTO client (client_name, contact_mail, password, provider)
       VALUES ($1, $2, $3, $4)
       RETURNING id, client_name, contact_mail`,
      [client_name, contact_mail, hashedPassword, "local"]
    );

    const user = result.rows[0];

    // 自動登入（建立 session）
    req.login(user, (err) => {
      if (err) return next(err);

      console.log("註冊並自動登入成功的使用者：", req.user);
      return res.status(201).json({
        message: "註冊並登入成功",
        user: { id: user.id, client_name: user.client_name }
      });
    });

    // res.status(201).json({ message: "註冊成功", user: result.rows[0] });
    console.log(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "註冊失敗，請稍後再試" });
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
    res.redirect(`${FRONTEND_URL}/account`);

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
    res.redirect(`${FRONTEND_URL}/account`);
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

    res.status(201).json({ message: "預約成功!期待為您服務!", orderId: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "預約失敗!請聯繫客服人員。" });
  }
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "請先登入" });
}

// 預約歷史查詢 API
app.get("/orders", ensureAuthenticated, async (req, res) => {
  const { client_id } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM orders WHERE client_id = $1 ORDER BY booking_date DESC, booking_time DESC`,
      [client_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "查詢預約失敗" });
  }
});


// 測試:檢查 session 是否維持
app.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

// 測試API
app.get("/", (req, res) => {
  res.send("伺服器正常運作中！");
});
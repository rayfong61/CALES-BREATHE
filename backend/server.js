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
import ordersRoutes from "./ordersRoutes.js";

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
app.use('/', ordersRoutes);




// 建立「顧客註冊」API (POST /register)
app.post("/register", async (req, res, next) => {
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
        user: {
    id: user.id,
    client_name: user.client_name,
    contact_mail: user.contact_mail,
    contact_mobile: user.contact_mobile, // 加上這一行
    provider: user.provider,
    // 你還可以加上其他欄位
  },
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
app.post("/login", async (req, res, next) => {
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
          user: {
            id: user.id,
            client_name: user.client_name,
            contact_mail: user.contact_mail,
            contact_mobile: user.contact_mobile,
            provider: user.provider,
          }
        });
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "登入失敗" });
    }
  });


app.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) { return res.status(500).json({ message: "登出失敗" }); }
    res.json({ message: "登出成功" });
  });
});



// 建立「新增預約」API (POST /orders)

app.post("/orders", async (req, res) => {
  const { client_id, booking_detail, total_price, total_duration, booking_date, booking_time, booking_note } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO orders (client_id, booking_detail, total_price, total_duration, booking_date, booking_time, booking_note)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [client_id, booking_detail, total_price, total_duration, booking_date, booking_time, booking_note]
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
// app.get("/orders", ensureAuthenticated, async (req, res) => {
//   const { client_id } = req.query;

//   try {
//     const result = await pool.query(
//       `SELECT * FROM orders WHERE client_id = $1 ORDER BY booking_date DESC, booking_time DESC`,
//       [client_id]
//     );

//     res.json(result.rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "查詢預約失敗" });
//   }
// });


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









app.get("/auth/line", (req, res, next) => {
  const redirect = req.query.redirect || "/account";
  req.session.redirectAfterLogin = redirect;
  passport.authenticate("line")(req, res, next);
  console.log(req.sessionID)
});

app.get("/auth/line/callback", passport.authenticate("line", {
  failureRedirect: "/login"
}), (req, res) => {
  const html = `
    <script>
      if (window.opener) {
        window.opener.postMessage("login-success", "http://localhost:3000");
        window.close();
      } else {
        window.location.href = "http://localhost:3000/account";
      }
    </script>
  `;
  res.send(html);
});


// Google 登入啟動點
app.get("/auth/google", (req, res, next) => {
  const redirect = req.query.redirect || "/account";
  req.session.redirectAfterLogin = redirect;
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  console.log(req.sessionID)
});

// Google 登入回調
app.get("/auth/google/callback", passport.authenticate("google", {
  failureRedirect: "/login"
}), (req, res) => {
  const html = `
    <script>
      if (window.opener) {
        window.opener.postMessage("login-success", "http://localhost:3000");
        window.close();
      } else {
        window.location.href = "http://localhost:3000/account";
      }
    </script>
  `;
  res.send(html);
});

// GET /unavailable-times?date=2025-05-22
app.get('/unavailable-times', async (req, res) => {
  const { date } = req.query;

  const query = `
    SELECT 
      booking_time AS start_time,
      (booking_time + (total_duration || ' minutes')::interval) AS end_time
    FROM orders
    WHERE booking_date = $1;
  `;

  try {
    const { rows } = await pool.query(query, [date]);
    res.json(rows); // [{ start_time: "10:00:00", end_time: "11:00:00" }, ...]
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// 找出預約「已滿」日期 (工作超過八小時 = 480分鐘)
app.get('/unavailable-dates', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT TO_CHAR(booking_date, 'YYYY-MM-DD') AS booking_date
      FROM orders
      GROUP BY booking_date
      HAVING SUM(total_duration) >= 480
    `);
    const dates = result.rows.map(row => row.booking_date);
    res.json(dates); // e.g., ["2025-05-04", "2025-05-10"]
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load unavailable dates' });
  }
});


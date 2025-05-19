import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import pool from "./db.js";


dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL

passport.use(
    new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${FRONTEND_URL}/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      const googleId = profile.id;
      const name = profile.displayName;
      const photo = profile.photos?.[0]?.value || null;
  
      try {
        const existingUser = await pool.query(
          "SELECT * FROM client WHERE provider_id = $1 AND provider = 'google'",
          [googleId]
        );
    
        if (existingUser.rows.length > 0) {             // ✅ 已註冊過 → 登入
          return done(null, existingUser.rows[0]);      // done()	是 passport 的 callback，通知登入結果是否成功
        } else {                                        // ❌ 尚未註冊 → 自動新增進資料庫
          const newUser = await pool.query(
            `INSERT INTO client (client_name, provider, provider_id, photo)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
             [name, "google", googleId, photo]
              );
          return done(null, newUser.rows[0]);
        }
      } catch (error) {
        return done(error, null);
      }
    })
  );
  passport.serializeUser((user, done) => {             // 將登入的 user.id 存到 session 中
    done(null, user.id);                              
  });
  
  passport.deserializeUser(async (id, done) => {       // 將 user 放入 req.user 中
    const result = await pool.query("SELECT * FROM client WHERE id = $1", [id]);
    done(null, result.rows[0]);
  });
  
  

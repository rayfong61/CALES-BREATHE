import passport from "passport";
import { Strategy as LineStrategy } from "passport-line";
import dotenv from "dotenv";
import pool from "./db.js";


dotenv.config();

const LINE_CHANNEL_ID = process.env.LINE_CHANNEL_ID;
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;

passport.use(new LineStrategy({
  channelID: LINE_CHANNEL_ID,
  channelSecret: LINE_CHANNEL_SECRET,
  callbackURL: "/auth/line/callback",
  scope: ["profile", "openid", "email"],
},
async (accessToken, refreshToken, profile, done) => {
  const lineId = profile.id;
  const name = profile.displayName;
  const picture = profile.pictureUrl;

  console.log(profile);

  try {
    // 以 lineId 來判斷使用者是否存在
    const existingUser = await pool.query(
      "SELECT * FROM client WHERE provider_id = $1 AND provider = 'line'",
      [lineId]
    );

    if (existingUser.rows.length > 0) {
      return done(null, existingUser.rows[0]);
    } else {
      const newUser = await pool.query(
        "INSERT INTO client (client_name, provider, provider_id, photo) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, "line", lineId, picture]
      );
      return done(null, newUser.rows[0]);
    }
  } catch (error) {
    return done(error, null);
  }
}));


  passport.serializeUser((user, done) => {
      done(null, user.id);
    });
    
    passport.deserializeUser(async (id, done) => {
      const result = await pool.query("SELECT * FROM client WHERE id = $1", [id]);
      done(null, result.rows[0]);
    });
    
    




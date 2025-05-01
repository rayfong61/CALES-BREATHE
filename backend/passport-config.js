import passport from "passport";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

passport.serializeUser((user, done) => {
  done(null, user.id); // 存入 session
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT id, client_name FROM client WHERE id = $1", [id]);
    if (result.rows.length > 0) {
      done(null, result.rows[0]); // 放入 req.user
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err);
  }
});

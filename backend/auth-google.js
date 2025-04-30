import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import pool from "./db.js";


dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
    new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      const googleId = profile.id;
      const name = profile.displayName;
      
      
  
      try {
        const existingUser = await pool.query(
          "SELECT * FROM client WHERE provider_id = $1 AND provider = 'google'",
          [googleId]
        );
    
        if (existingUser.rows.length > 0) {
          return done(null, existingUser.rows[0]);
        } else {
          const newUser = await pool.query(
            "INSERT INTO client (client_name, provider, provider_id) VALUES ($1, $2, $3) RETURNING *",
            [name, "google", googleId]
          );
          return done(null, newUser.rows[0]);
        }
      } catch (error) {
        return done(error, null);
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    const result = await pool.query("SELECT * FROM client WHERE id = $1", [id]);
    done(null, result.rows[0]);
  });
  
  

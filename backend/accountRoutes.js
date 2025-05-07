import express from "express";
import upload from "./upload.js";
import pool from "./db.js";

const router = express.Router();

router.put("/account/update", upload.single("photo"), async (req, res) => {
  if (!req.isAuthenticated?.()) {
    return res.status(401).json({ error: "未登入" });
  }

  const userId = req.user.id;
  const {
    client_name,
    contact_mobile,
    contact_mail,
    birthday,
    address,
  } = req.body;

  let photoUrl = req.user.photo;
  if (req.file) {
    photoUrl = `/uploads/${req.file.filename}`;
  }

  try {
    const result = await pool.query(
      `UPDATE client 
       SET client_name = $1,
           contact_mobile = $2,
           contact_mail = $3,
           birthday = $4,
           address = $5,
           photo = $6
       WHERE id = $7
       RETURNING *`,
      [client_name, contact_mobile, contact_mail, birthday, address, photoUrl, userId]
    );

    res.json({ updatedUser: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "伺服器錯誤" });
  }
});

router.put("/account/update2", async (req, res) => {
  if (!req.isAuthenticated?.()) {
    return res.status(401).json({ error: "未登入" });
  }

  const userId = req.user.id;
  const {
    client_name,
    contact_mobile,
  } = req.body;



  try {
    const result = await pool.query(
      `UPDATE client 
       SET client_name = $1,
           contact_mobile = $2
       WHERE id = $3
       RETURNING *`,
      [client_name, contact_mobile, userId]
    );

    res.json({ updatedUser: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "伺服器錯誤" });
  }
});

export default router;

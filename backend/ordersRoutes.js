import express from "express";
import pool from "./db.js";

const router = express.Router();

// 客戶取得尚未取消的預約紀錄
router.get('/orders', async (req, res) => {
    const clientId = req.query.client_id;
  
    try {
      const result = await pool.query(
        `SELECT * FROM orders 
         WHERE client_id = $1 
         AND is_cancelled = FALSE 
         ORDER BY booking_date DESC, booking_time DESC`,
        [clientId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error('取得預約失敗', err);
      res.status(500).json({ error: '取得預約失敗' });
    }
  });
  
  // 客戶取消預約
  router.put('/orders/cancel/:id', async (req, res) => {
    const orderId = req.params.id;
  
    try {
      await pool.query(
        `UPDATE orders SET is_cancelled = TRUE WHERE id = $1`,
        [orderId]
      );
      res.json({ message: '預約已取消' });
    } catch (err) {
      console.error('取消預約失敗', err);
      res.status(500).json({ error: '取消預約失敗' });
    }
  });
  
  export default router;
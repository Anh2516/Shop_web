const express = require('express');
const router = express.Router();
const { pool: db } = require('../config/database');
const { verifyToken, requireAdmin } = require('../config/auth');

// Lấy tất cả users (Admin only)
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, email, name, phone, address, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users });
  } catch (error) {
    console.error('Lỗi lấy users:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;


const express = require('express');
const router = express.Router();
const { pool: db } = require('../config/database');
const { verifyToken, requireAdmin } = require('../config/auth');

// Middleware kiểm tra admin cho tất cả routes
router.use(verifyToken);
router.use(requireAdmin);

// Thống kê tổng quan
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers] = await db.execute('SELECT COUNT(*) as count FROM users WHERE role = "user"');
    const [totalProducts] = await db.execute('SELECT COUNT(*) as count FROM products');
    const [totalOrders] = await db.execute('SELECT COUNT(*) as count FROM orders');
    const [totalRevenue] = await db.execute('SELECT SUM(total) as revenue FROM orders WHERE status = "completed"');
    const [recentOrders] = await db.execute(
      'SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()'
    );

    res.json({
      stats: {
        totalUsers: totalUsers[0].count,
        totalProducts: totalProducts[0].count,
        totalOrders: totalOrders[0].count,
        totalRevenue: totalRevenue[0].revenue || 0,
        recentOrders: recentOrders[0].count
      }
    });
  } catch (error) {
    console.error('Lỗi lấy thống kê:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Quản lý categories
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM categories ORDER BY name');
    res.json({ categories });
  } catch (error) {
    console.error('Lỗi lấy categories:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const { name, description } = req.body;
    const [result] = await db.execute(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    res.status(201).json({ message: 'Tạo category thành công', id: result.insertId });
  } catch (error) {
    console.error('Lỗi tạo category:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    await db.execute(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [name, description, req.params.id]
    );
    res.json({ message: 'Cập nhật category thành công' });
  } catch (error) {
    console.error('Lỗi cập nhật category:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa category thành công' });
  } catch (error) {
    console.error('Lỗi xóa category:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;


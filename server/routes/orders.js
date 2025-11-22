const express = require('express');
const router = express.Router();
const { pool: db } = require('../config/database');
const { verifyToken, requireAdmin } = require('../config/auth');

// Tạo đơn hàng mới
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, total, shipping_address, payment_method } = req.body;
    const userId = req.user.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống' });
    }

    // Tạo đơn hàng
    const [orderResult] = await db.execute(
      'INSERT INTO orders (user_id, total, shipping_address, payment_method, status) VALUES (?, ?, ?, ?, ?)',
      [userId, total, shipping_address, payment_method || 'cod', 'pending']
    );

    const orderId = orderResult.insertId;

    // Thêm chi tiết đơn hàng
    for (const item of items) {
      await db.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );

      // Cập nhật số lượng tồn kho
      await db.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    const [order] = await db.execute(
      `SELECT o.*, 
       JSON_ARRAYAGG(
         JSON_OBJECT(
           'id', oi.id,
           'product_id', oi.product_id,
           'product_name', p.name,
           'quantity', oi.quantity,
           'price', oi.price
         )
       ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.id = ?
       GROUP BY o.id`,
      [orderId]
    );

    res.status(201).json({ order: order[0], message: 'Tạo đơn hàng thành công' });
  } catch (error) {
    console.error('Lỗi tạo đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Lấy đơn hàng của user
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.userId]
    );

    res.json({ orders });
  } catch (error) {
    console.error('Lỗi lấy đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Lấy chi tiết đơn hàng
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [orders] = await db.execute(
      `SELECT o.*, 
       JSON_ARRAYAGG(
         JSON_OBJECT(
           'id', oi.id,
           'product_id', oi.product_id,
           'product_name', p.name,
           'product_image', p.image,
           'quantity', oi.quantity,
           'price', oi.price
         )
       ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.id = ? AND o.user_id = ?
       GROUP BY o.id`,
      [req.params.id, req.user.userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    res.json({ order: orders[0] });
  } catch (error) {
    console.error('Lỗi lấy chi tiết đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Lấy tất cả đơn hàng (Admin only)
router.get('/admin/all', verifyToken, requireAdmin, async (req, res) => {
  try {
    const [orders] = await db.execute(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );

    res.json({ orders });
  } catch (error) {
    console.error('Lỗi lấy đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Cập nhật trạng thái đơn hàng (Admin only)
router.put('/:id/status', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Cập nhật trạng thái đơn hàng thành công' });
  } catch (error) {
    console.error('Lỗi cập nhật đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;


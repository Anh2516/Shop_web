const express = require('express');
const router = express.Router();
const { pool: db } = require('../config/database');
const { verifyToken, requireAdmin } = require('../config/auth');

// Lấy tất cả sản phẩm
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    
    // Validate và parse parameters
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 12)); // Max 100 items per page
    const offset = (pageNum - 1) * limitNum;

    let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    const params = [];

    if (category) {
      const categoryId = parseInt(category);
      if (!isNaN(categoryId)) {
        query += ' AND p.category_id = ?';
        params.push(categoryId);
      }
    }

    if (search && search.trim()) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    query += ' ORDER BY p.created_at DESC';
    // Sử dụng template string an toàn vì đã validate limitNum và offset là số
    query += ` LIMIT ${limitNum} OFFSET ${offset}`;

    const [products] = await db.execute(query, params);

    // Đếm tổng số sản phẩm
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams = [];
    if (category) {
      countQuery += ' AND category_id = ?';
      countParams.push(parseInt(category));
    }
    if (search) {
      countQuery += ' AND (name LIKE ? OR description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      products: products || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: total || 0,
        pages: Math.ceil((total || 0) / limitNum)
      }
    });
  } catch (error) {
    console.error('Lỗi lấy sản phẩm:', error);
    console.error('Error details:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      message: 'Lỗi server',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Lấy sản phẩm theo ID
router.get('/:id', async (req, res) => {
  try {
    const [products] = await db.execute(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json({ product: products[0] });
  } catch (error) {
    console.error('Lỗi lấy sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Tạo sản phẩm mới (Admin only)
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, stock, category_id, image } = req.body;

    if (!name || !price || !stock) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    const [result] = await db.execute(
      'INSERT INTO products (name, description, price, stock, category_id, image) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || null, price, stock, category_id || null, image || null]
    );

    const [newProduct] = await db.execute(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [result.insertId]
    );

    res.status(201).json({ product: newProduct[0], message: 'Tạo sản phẩm thành công' });
  } catch (error) {
    console.error('Lỗi tạo sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Cập nhật sản phẩm (Admin only)
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, stock, category_id, image } = req.body;

    await db.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, image = ? WHERE id = ?',
      [name, description, price, stock, category_id, image, req.params.id]
    );

    const [updatedProduct] = await db.execute(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [req.params.id]
    );

    res.json({ product: updatedProduct[0], message: 'Cập nhật sản phẩm thành công' });
  } catch (error) {
    console.error('Lỗi cập nhật sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Xóa sản phẩm (Admin only)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    console.error('Lỗi xóa sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;


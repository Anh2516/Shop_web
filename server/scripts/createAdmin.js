const bcrypt = require('bcryptjs');
const { pool: db } = require('../config/database');
require('dotenv').config();

async function createAdmin() {
  try {
    const email = 'admin@shop.com';
    const password = 'admin123';
    const name = 'Admin';
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if admin exists
    const [existing] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existing.length > 0) {
      // Update existing admin
      await db.execute(
        'UPDATE users SET password = ?, role = ? WHERE email = ?',
        [hashedPassword, 'admin', email]
      );
      console.log('Đã cập nhật tài khoản admin!');
    } else {
      // Create new admin
      await db.execute(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, name, 'admin']
      );
      console.log('Đã tạo tài khoản admin!');
    }
    
    console.log('Email: admin@shop.com');
    console.log('Password: admin123');
    console.log('\nVui lòng đổi mật khẩu sau khi đăng nhập!');
    
    process.exit(0);
  } catch (error) {
    console.error('Lỗi tạo admin:', error);
    process.exit(1);
  }
}

createAdmin();


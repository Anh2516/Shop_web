-- Dữ liệu mẫu cho hệ thống bán hàng
USE shopweb_db;

-- Xóa dữ liệu cũ (nếu có)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Thêm categories mẫu
INSERT INTO categories (name, description) VALUES
('Điện thoại', 'Các loại điện thoại thông minh, smartphone'),
('Laptop', 'Máy tính xách tay, laptop gaming, văn phòng'),
('Phụ kiện', 'Tai nghe, sạc, ốp lưng, cáp sạc'),
('Đồ gia dụng', 'Đồ dùng trong gia đình, thiết bị nhà bếp'),
('Thời trang', 'Quần áo, giày dép, phụ kiện thời trang'),
('Sách', 'Sách văn học, sách kỹ thuật, sách giáo khoa');

-- Thêm users mẫu (password đã được hash: password123)
-- Mật khẩu: password123 cho tất cả user
INSERT INTO users (email, password, name, phone, address, role) VALUES
('admin@shop.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'Admin', '0123456789', '123 Đường ABC, Quận 1, TP.HCM', 'admin'),
('user1@example.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'Nguyễn Văn A', '0987654321', '456 Đường XYZ, Quận 2, TP.HCM', 'user'),
('user2@example.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'Trần Thị B', '0912345678', '789 Đường DEF, Quận 3, TP.HCM', 'user'),
('user3@example.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'Lê Văn C', '0923456789', '321 Đường GHI, Quận 4, TP.HCM', 'user');

-- Thêm products mẫu
INSERT INTO products (name, description, price, stock, category_id, image) VALUES
-- Điện thoại
('iPhone 15 Pro Max', 'iPhone 15 Pro Max 256GB, màn hình 6.7 inch, chip A17 Pro, camera 48MP', 29990000, 50, 1, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'),
('Samsung Galaxy S24 Ultra', 'Samsung Galaxy S24 Ultra 512GB, màn hình 6.8 inch, bút S Pen, camera 200MP', 26990000, 30, 1, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500'),
('Xiaomi 14 Pro', 'Xiaomi 14 Pro 256GB, màn hình 6.73 inch, chip Snapdragon 8 Gen 3', 19990000, 40, 1, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500'),
('OPPO Find X7', 'OPPO Find X7 256GB, màn hình 6.78 inch, camera Hasselblad', 17990000, 35, 1, 'https://images.unsplash.com/photo-1601972602237-8c79241f4707?w=500'),

-- Laptop
('MacBook Pro 16 inch M3', 'MacBook Pro 16 inch M3 Pro, 18GB RAM, 512GB SSD, màn hình Liquid Retina XDR', 59990000, 20, 2, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500'),
('Dell XPS 15', 'Dell XPS 15 9530, Intel Core i7, 16GB RAM, 512GB SSD, màn hình OLED 15.6 inch', 39990000, 25, 2, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'),
('ASUS ROG Strix G16', 'ASUS ROG Strix G16, Intel Core i9, RTX 4070, 16GB RAM, 1TB SSD', 42990000, 15, 2, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500'),
('Lenovo ThinkPad X1 Carbon', 'Lenovo ThinkPad X1 Carbon Gen 11, Intel Core i7, 16GB RAM, 512GB SSD', 34990000, 30, 2, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'),

-- Phụ kiện
('AirPods Pro 2', 'Tai nghe không dây Apple AirPods Pro 2, chống ồn chủ động, MagSafe', 6990000, 100, 3, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500'),
('Samsung Galaxy Buds2 Pro', 'Tai nghe không dây Samsung Galaxy Buds2 Pro, chống ồn chủ động', 3990000, 80, 3, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500'),
('Ốp lưng iPhone 15 Pro Max', 'Ốp lưng trong suốt chống sốc cho iPhone 15 Pro Max', 299000, 200, 3, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500'),
('Cáp sạc nhanh USB-C 100W', 'Cáp sạc nhanh USB-C to USB-C, hỗ trợ sạc 100W, dài 2m', 499000, 150, 3, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500'),

-- Đồ gia dụng
('Máy lọc không khí Xiaomi', 'Máy lọc không khí Xiaomi Air Purifier 4, lọc HEPA, điều khiển app', 2990000, 40, 4, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500'),
('Nồi cơm điện tử Tiger', 'Nồi cơm điện tử Tiger 1.8L, nấu cơm ngon, tiết kiệm điện', 1990000, 60, 4, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500'),
('Máy xay sinh tố Philips', 'Máy xay sinh tố Philips HR2115, công suất 600W, 2 cối', 1490000, 50, 4, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500'),
('Bàn ủi hơi nước Panasonic', 'Bàn ủi hơi nước Panasonic NI-E650, công suất 2400W', 1290000, 45, 4, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500'),

-- Thời trang
('Áo thun nam basic', 'Áo thun nam chất liệu cotton 100%, nhiều màu sắc, size M-L-XL', 299000, 200, 5, 'https://images.unsplash.com/photo-1521572163474-6864f9cf04ab?w=500'),
('Quần jean nam', 'Quần jean nam form slim, chất liệu denim cao cấp, size 28-36', 899000, 150, 5, 'https://images.unsplash.com/photo-1542272604-787c403383bb?w=500'),
('Giày thể thao Nike', 'Giày thể thao Nike Air Max, size 38-44, nhiều màu', 2499000, 80, 5, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'),
('Túi xách nữ da thật', 'Túi xách nữ da thật, thiết kế sang trọng, nhiều màu sắc', 1999000, 60, 5, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500'),

-- Sách
('Sách: Đắc Nhân Tâm', 'Sách Đắc Nhân Tâm - Dale Carnegie, bản dịch tiếng Việt', 89000, 300, 6, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'),
('Sách: Nhà Giả Kim', 'Sách Nhà Giả Kim - Paulo Coelho, bản dịch tiếng Việt', 99000, 250, 6, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'),
('Sách: Clean Code', 'Sách Clean Code - Robert C. Martin, lập trình viên nên đọc', 199000, 100, 6, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'),
('Sách: Tôi Tài Giỏi Bạn Cũng Thế', 'Sách Tôi Tài Giỏi Bạn Cũng Thế - Adam Khoo', 129000, 200, 6, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500');

-- Thêm orders mẫu
INSERT INTO orders (user_id, total, shipping_address, payment_method, status) VALUES
(2, 29990000, '456 Đường XYZ, Quận 2, TP.HCM', 'cod', 'completed'),
(2, 6990000, '456 Đường XYZ, Quận 2, TP.HCM', 'cod', 'shipped'),
(3, 19990000, '789 Đường DEF, Quận 3, TP.HCM', 'cod', 'processing'),
(3, 2990000, '789 Đường DEF, Quận 3, TP.HCM', 'cod', 'pending'),
(4, 59990000, '321 Đường GHI, Quận 4, TP.HCM', 'cod', 'completed');

-- Thêm order_items mẫu
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
-- Order 1: user 2 mua iPhone 15 Pro Max
(1, 1, 1, 29990000),

-- Order 2: user 2 mua AirPods Pro 2
(2, 9, 1, 6990000),

-- Order 3: user 3 mua Xiaomi 14 Pro
(3, 3, 1, 19990000),

-- Order 4: user 3 mua máy lọc không khí
(4, 13, 1, 2990000),

-- Order 5: user 4 mua MacBook Pro
(5, 5, 1, 59990000);

-- Hiển thị thống kê
SELECT 'Dữ liệu mẫu đã được thêm thành công!' AS Message;
SELECT COUNT(*) AS 'Tổng số categories' FROM categories;
SELECT COUNT(*) AS 'Tổng số users' FROM users;
SELECT COUNT(*) AS 'Tổng số products' FROM products;
SELECT COUNT(*) AS 'Tổng số orders' FROM orders;


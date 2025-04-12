USE myapp;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user'
);
ALTER TABLE users
ADD COLUMN isLocked BOOLEAN DEFAULT FALSE;
ALTER TABLE users
ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;



CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE categories ADD createdAt DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE categories ADD updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;



CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_base64 TEXT DEFAULT NULL,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

ALTER TABLE products ADD COLUMN discount_id INT DEFAULT NULL;
ALTER TABLE products ADD FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE SET NULL;


INSERT INTO categories (name) 
VALUES
('Cà phê'),
('Trà'),
('Nước đóng chai');

INSERT INTO products (name, description, price, image_base64, category_id) 
VALUES 
('Cà phê sữa đá', 'Cà phê sữa đá thơm ngon, đậm đà', 30.00, NULL, 1),
('Cà phê đen', 'Cà phê đen nguyên chất, đậm đà', 25.00, NULL, 1),
('Cà phê cappuccino', 'Cà phê cappuccino mềm mịn', 35.00, NULL, 1),

('Trà xanh', 'Trà xanh mát lạnh, tốt cho sức khỏe', 20.00, NULL, 2),
('Trà sữa', 'Trà sữa ngọt ngào, béo ngậy', 25.00, NULL, 2),
('Trà hoa cúc', 'Trà hoa cúc nhẹ nhàng, thanh mát', 22.00, NULL, 2),

('Nước khoáng', 'Nước khoáng tinh khiết, bổ sung năng lượng', 15.00, NULL, 3),
('Nước tinh khiết', 'Nước tinh khiết đóng chai tiện lợi', 12.00, NULL, 3),
('Nước dừa', 'Nước dừa tự nhiên, bổ dưỡng', 18.00, NULL, 3),
('Nước ép cam', 'Nước ép cam tươi, mát lành', 20.00, NULL, 3);

CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    ice VARCHAR(50),
    sugar VARCHAR(50),
    size VARCHAR(50),
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    ice VARCHAR(50),
    sugar VARCHAR(50),
    size VARCHAR(50),
    quantity INT NOT NULL DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


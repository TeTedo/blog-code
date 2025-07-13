-- MySQL 인덱스 테스트를 위한 데이터베이스 설정
-- 실행 전: CREATE DATABASE IF NOT EXISTS index_test;

USE index_test;

-- 1. 사용자 테이블 생성 (인덱스 없이)
CREATE TABLE users_no_index (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. 사용자 테이블 생성 (인덱스 있음)
CREATE TABLE users_with_index (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE UNIQUE INDEX idx_username ON users_with_index(username);
CREATE UNIQUE INDEX idx_email ON users_with_index(email);
CREATE INDEX idx_status ON users_with_index(status);
CREATE INDEX idx_created_at ON users_with_index(created_at);
CREATE INDEX idx_status_created ON users_with_index(status, created_at);

-- 3. 주문 테이블 생성
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_number VARCHAR(50) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE UNIQUE INDEX idx_order_number ON orders(order_number);
CREATE INDEX idx_user_id ON orders(user_id);
CREATE INDEX idx_status ON orders(status);
CREATE INDEX idx_created_at ON orders(created_at);
CREATE INDEX idx_user_status ON orders(user_id, status);

-- 4. 테스트 데이터 생성 (10만 건)
INSERT INTO users_no_index (username, email, status)
SELECT
    CONCAT('user', LPAD(id, 6, '0')) as username,
    CONCAT('user', LPAD(id, 6, '0'), '@example.com') as email,
    CASE WHEN id % 10 = 0 THEN 'inactive'
         WHEN id % 100 = 0 THEN 'suspended'
         ELSE 'active' END as status
FROM (
    SELECT 1 + units.i + tens.i * 10 + hundreds.i * 100 + thousands.i * 1000 + ten_thousands.i * 10000 as id
    FROM (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) units,
         (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) tens,
         (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) hundreds,
         (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) thousands,
         (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) ten_thousands
    WHERE 1 + units.i + tens.i * 10 + hundreds.i * 100 + thousands.i * 1000 + ten_thousands.i * 10000 <= 100000
) numbers;

INSERT INTO users_with_index (username, email, status)
SELECT
    CONCAT('user', LPAD(id, 6, '0')) as username,
    CONCAT('user', LPAD(id, 6, '0'), '@example.com') as email,
    CASE WHEN id % 10 = 0 THEN 'inactive'
         WHEN id % 100 = 0 THEN 'suspended'
         ELSE 'active' END as status
FROM (
    SELECT 1 + units.i + tens.i * 10 + hundreds.i * 100 + thousands.i * 1000 + ten_thousands.i * 10000 as id
    FROM (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) units,
         (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) tens,
         (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) hundreds,
         (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) thousands,
         (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) ten_thousands
    WHERE 1 + units.i + tens.i * 10 + hundreds.i * 100 + thousands.i * 1000 + ten_thousands.i * 10000 <= 100000
) numbers;

-- 5. 주문 데이터 생성 (50만 건)
INSERT INTO orders (user_id, order_number, status, total_amount)
SELECT 
    FLOOR(1 + RAND() * 100000) as user_id,
    CONCAT('ORD', LPAD(id, 8, '0')) as order_number,
    CASE WHEN id % 5 = 0 THEN 'pending'
         WHEN id % 5 = 1 THEN 'processing'
         WHEN id % 5 = 2 THEN 'shipped'
         WHEN id % 5 = 3 THEN 'delivered'
         ELSE 'cancelled' END as status,
    ROUND(RAND() * 1000, 2) as total_amount
FROM (
    SELECT 1 + units.i + tens.i * 10 + hundreds.i * 100 + thousands.i * 1000 + ten_thousands.i * 10000 + hundred_thousands.i * 100000 as id
    FROM (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) units,
         (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) tens,
         (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) hundreds,
         (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) thousands,
         (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) ten_thousands,
         (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) hundred_thousands
    WHERE 1 + units.i + tens.i * 10 + hundreds.i * 100 + thousands.i * 1000 + ten_thousands.i * 10000 + hundred_thousands.i * 100000 <= 500000
) numbers;

-- 6. 통계 정보 확인
SELECT 
    'users_no_index' as table_name,
    COUNT(*) as total_rows,
    COUNT(DISTINCT username) as unique_usernames,
    COUNT(DISTINCT status) as unique_status
FROM users_no_index
UNION ALL
SELECT 
    'users_with_index' as table_name,
    COUNT(*) as total_rows,
    COUNT(DISTINCT username) as unique_usernames,
    COUNT(DISTINCT status) as unique_status
FROM users_with_index
UNION ALL
SELECT 
    'orders' as table_name,
    COUNT(*) as total_rows,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT status) as unique_status
FROM orders; 
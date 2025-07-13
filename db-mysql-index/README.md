# MySQL 인덱스 (Index) 사용 가이드

## 목차

1. [인덱스란 무엇인가?](#인덱스란-무엇인가)
2. [인덱스의 작동 원리](#인덱스의-작동-원리)
3. [인덱스의 종류](#인덱스의-종류)
4. [인덱스 생성 및 관리](#인덱스-생성-및-관리)
5. [인덱스 성능 최적화](#인덱스-성능-최적화)
6. [실제 예제](#실제-예제)

---

## 인덱스란 무엇인가?

인덱스는 데이터베이스에서 데이터를 빠르게 찾을 수 있도록 도와주는 자료구조입니다. 책의 목차나 색인과 같은 역할을 하며, 전체 테이블을 스캔하지 않고도 원하는 데이터를 빠르게 찾을 수 있게 해줍니다.

### 인덱스가 필요한 이유

- **전체 테이블 스캔(Full Table Scan) 방지**: 대용량 데이터에서 성능 향상
- **정렬된 데이터 접근**: ORDER BY, GROUP BY 성능 개선
- **중복 값 제거**: DISTINCT 연산 최적화
- **조인 성능 향상**: 외래키 인덱스 활용

---

## 인덱스의 작동 원리

### 1. B-Tree 구조

MySQL의 기본 인덱스는 B-Tree(Balanced Tree) 구조를 사용합니다.

```
        [Root Node]
        /     \
   [Leaf]     [Leaf]
   /   \        /   \
[Data] [Data] [Data] [Data]
```

**B-Tree의 특징:**

- 모든 리프 노드가 같은 레벨에 위치
- 각 노드는 여러 개의 키를 가질 수 있음
- 검색, 삽입, 삭제가 모두 O(log n) 시간복잡도

### 2. 인덱스 검색 과정

```sql
-- 예시: users 테이블에서 name이 'John'인 사용자 검색
SELECT * FROM users WHERE name = 'John';
```

**인덱스가 없는 경우:**

1. 전체 테이블 스캔 (Full Table Scan)
2. 모든 행을 순차적으로 검사
3. 시간복잡도: O(n)

**인덱스가 있는 경우:**

1. 인덱스 트리에서 'John' 검색
2. 해당 키의 포인터로 실제 데이터 위치 확인
3. 시간복잡도: O(log n)

### 3. 인덱스의 물리적 구조

```
[인덱스 페이지]
┌─────────────────┐
│ Key │ Pointer   │
├─────────────────┤
│ A   │ Page 1    │
│ B   │ Page 2    │
│ C   │ Page 3    │
└─────────────────┘
```

---

## 인덱스의 종류

### 1. 클러스터형 인덱스 (Clustered Index)

- **특징**: 데이터가 물리적으로 정렬되어 저장
- **제한**: 테이블당 하나만 생성 가능
- **기본값**: PRIMARY KEY가 클러스터형 인덱스

```sql
-- 클러스터형 인덱스 예시
CREATE TABLE users (
    id INT PRIMARY KEY,  -- 클러스터형 인덱스
    name VARCHAR(100),
    email VARCHAR(100)
);
```

### 2. 비클러스터형 인덱스 (Non-Clustered Index)

- **특징**: 별도의 인덱스 구조에 포인터 저장
- **제한**: 테이블당 여러 개 생성 가능
- **용도**: 보조 인덱스, 복합 인덱스

```sql
-- 비클러스터형 인덱스 예시
CREATE INDEX idx_name ON users(name);
CREATE INDEX idx_email ON users(email);
```

### 3. 복합 인덱스 (Composite Index)

- **특징**: 여러 컬럼을 조합한 인덱스
- **순서**: 컬럼 순서가 중요 (왼쪽 우선)

```sql
-- 복합 인덱스 예시
CREATE INDEX idx_name_email ON users(name, email);

-- 효율적인 쿼리
SELECT * FROM users WHERE name = 'John' AND email = 'john@example.com';
SELECT * FROM users WHERE name = 'John';  -- 인덱스 사용 가능

-- 비효율적인 쿼리
SELECT * FROM users WHERE email = 'john@example.com';  -- 인덱스 사용 불가
```

### 4. 고유 인덱스 (Unique Index)

- **특징**: 중복 값을 허용하지 않음
- **용도**: 데이터 무결성 보장

```sql
-- 고유 인덱스 예시
CREATE UNIQUE INDEX idx_email ON users(email);
```

### 5. 부분 인덱스 (Partial Index)

- **특징**: 조건을 만족하는 행만 인덱싱
- **용도**: 특정 조건의 데이터만 빠르게 검색

```sql
-- 부분 인덱스 예시 (MySQL에서는 WHERE 절 사용)
CREATE INDEX idx_active_users ON users(name) WHERE status = 'active';
```

---

## 인덱스 생성 및 관리

### 1. 인덱스 생성

```sql
-- 기본 인덱스 생성
CREATE INDEX idx_name ON users(name);

-- 복합 인덱스 생성
CREATE INDEX idx_name_email ON users(name, email);

-- 고유 인덱스 생성
CREATE UNIQUE INDEX idx_email ON users(email);

-- 인덱스 생성 시 정렬 지정
CREATE INDEX idx_name ON users(name DESC);
```

### 2. 인덱스 확인

```sql
-- 테이블의 인덱스 확인
SHOW INDEX FROM users;

-- 또는
SELECT
    INDEX_NAME,
    COLUMN_NAME,
    NON_UNIQUE,
    SEQ_IN_INDEX
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'your_database'
AND TABLE_NAME = 'users';
```

### 3. 인덱스 삭제

```sql
-- 인덱스 삭제
DROP INDEX idx_name ON users;

-- 또는
ALTER TABLE users DROP INDEX idx_name;
```

### 4. 인덱스 재구성

```sql
-- 인덱스 재구성 (데이터 정렬)
OPTIMIZE TABLE users;

-- 또는
ALTER TABLE users FORCE;
```

---

## 인덱스 성능 최적화

### 1. 인덱스 선택 기준

**인덱스를 생성해야 하는 경우:**

- WHERE 절에서 자주 사용되는 컬럼
- JOIN 조건에 사용되는 컬럼
- ORDER BY, GROUP BY에 사용되는 컬럼
- DISTINCT 연산이 자주 사용되는 컬럼

**인덱스를 생성하지 않는 것이 좋은 경우:**

- 자주 변경되는 컬럼
- NULL 값이 많은 컬럼
- 카디널리티가 낮은 컬럼 (성별, 상태 등)
- 이미 다른 인덱스에 포함된 컬럼

### 2. 카디널리티 (Cardinality)

카디널리티는 컬럼의 고유 값의 개수를 의미합니다.

```sql
-- 카디널리티 확인
SELECT
    COUNT(DISTINCT name) as name_cardinality,
    COUNT(DISTINCT status) as status_cardinality,
    COUNT(*) as total_rows
FROM users;
```

**카디널리티가 높은 컬럼**: 인덱스 효과가 좋음
**카디널리티가 낮은 컬럼**: 인덱스 효과가 제한적

### 3. 인덱스 사용 여부 확인

```sql
-- EXPLAIN을 사용한 쿼리 실행 계획 확인
EXPLAIN SELECT * FROM users WHERE name = 'John';

-- 결과 해석
-- type: index (인덱스 사용), ALL (전체 스캔)
-- key: 사용된 인덱스 이름
-- rows: 검사할 행의 수
```

### 4. 인덱스 통계 정보

```sql
-- 인덱스 통계 정보 확인
SELECT
    TABLE_NAME,
    INDEX_NAME,
    CARDINALITY,
    SUB_PART,
    PACKED,
    NULLABLE,
    INDEX_TYPE
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'your_database';
```

---

## 실제 예제

### 1. 테스트 데이터 세팅

```sql
-- 사용자 테이블 생성
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
```

테스트 데이터 10만건씩 삽입

```sql
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
```

result

```
index 없는 테이블
0.419 sec

index 있는 테이블
1.394 sec
```

INSERT 에서 인덱스가 있고 없고의 차이가 10만개 기준 거의 3배 차이남

```sql
-- 주문 테이블 생성
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
```

50만건 테스트 데이터 추가

```sql
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
```

### 2. 성능 테스트

#### 조회 성능 비교

```sql
-- 인덱스 성능 비교
-- 인덱스 없는 쿼리
EXPLAIN SELECT * FROM users_no_index WHERE username = 'user000001';

-- 인덱스 있는 쿼리
EXPLAIN SELECT * FROM users_with_index WHERE username = 'user000001';
```

result

```
index 없는 테이블
0.0021 sec

index 있는 테이블
0.00074 sec
```

INSERT 와는 반대로 인덱스가 있는 테이블이 거의 3배 빨랐다.

#### 복합 인덱스 테스트

```sql
-- 2-1. 상태와 생성일로 검색 (복합 인덱스 활용)
EXPLAIN SELECT * FROM users_with_index
WHERE status = 'active' AND created_at > '2024-01-01'
ORDER BY created_at DESC;

-- 2-2. 상태만으로 검색 (복합 인덱스 부분 활용)
EXPLAIN SELECT * FROM users_with_index
WHERE status = 'active'
ORDER BY created_at DESC;

-- 2-3. 생성일만으로 검색 (복합 인덱스 미사용)
EXPLAIN SELECT * FROM users_with_index
WHERE created_at > '2024-01-01'
ORDER BY created_at DESC;
```

#### JOIN 성능 테스트

```sql
-- 사용자와 주문 조인 (인덱스 활용)
EXPLAIN SELECT u.username, o.order_number, o.total_amount
FROM users_with_index u
JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active' AND o.status = 'delivered'
ORDER BY o.created_at DESC
LIMIT 100;
```

#### 카디널리티 테스트

```sql
-- 높은 카디널리티 컬럼 (username) 검색
EXPLAIN SELECT * FROM users_with_index WHERE username LIKE 'user%';

-- 낮은 카디널리티 컬럼 (status) 검색
EXPLAIN SELECT * FROM users_with_index WHERE status = 'active';
```

#### 정렬 성능 테스트

```sql
-- 인덱스가 있는 컬럼으로 정렬
EXPLAIN SELECT * FROM users_with_index
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 1000;

-- 인덱스가 없는 컬럼으로 정렬
EXPLAIN SELECT * FROM users_with_index
WHERE status = 'active'
ORDER BY email
LIMIT 1000;
```

#### 집계 함수 성능 테스트

```sql
-- 상태별 사용자 수 (인덱스 활용)
EXPLAIN SELECT status, COUNT(*) as user_count
FROM users_with_index
GROUP BY status;

-- 월별 주문 수 (인덱스 활용)
EXPLAIN SELECT
    DATE_FORMAT(created_at, '%Y-%m') as month,
    COUNT(*) as order_count,
    SUM(total_amount) as total_sales
FROM orders
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month;
```

#### 인덱스 사용 통계 확인

```sql
-- 테이블별 인덱스 정보
SELECT
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    CARDINALITY,
    NON_UNIQUE,
    SEQ_IN_INDEX
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'index_test'
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- 인덱스 크기 확인
SELECT
    TABLE_NAME,
    ROUND(SUM(INDEX_LENGTH) / 1024 / 1024, 2) as index_size_mb
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'index_test'
GROUP BY TABLE_NAME;
```

#### 성능 모니터링

```sql
SELECT
    DIGEST_TEXT as query,
    COUNT_STAR as exec_count,
    ROUND(AVG_TIMER_WAIT/1000000000, 3) as avg_time_sec,
    ROUND(SUM_TIMER_WAIT/1000000000, 3) as total_time_sec
FROM performance_schema.events_statements_summary_by_digest
WHERE SCHEMA_NAME = 'index_test'
AND AVG_TIMER_WAIT > 1000000000  -- 1초 이상
ORDER BY AVG_TIMER_WAIT DESC
LIMIT 10;
```

#### 인덱스 최적화 테스트

```sql
-- 불필요한 인덱스 확인
SELECT
    s.TABLE_NAME,
    s.INDEX_NAME,
    s.CARDINALITY,
    t.TABLE_ROWS,
    ROUND(s.CARDINALITY / t.TABLE_ROWS * 100, 2) as selectivity_percent
FROM INFORMATION_SCHEMA.STATISTICS s
JOIN INFORMATION_SCHEMA.TABLES t ON s.TABLE_NAME = t.TABLE_NAME
WHERE s.TABLE_SCHEMA = 'index_test'
AND t.TABLE_SCHEMA = 'index_test'
AND s.SEQ_IN_INDEX = 1  -- 첫 번째 컬럼만
ORDER BY selectivity_percent;
```

#### 실제 성능 측정

```sql
-- 인덱스 없는 테이블 성능 측정
SET profiling = 1;
SELECT SQL_NO_CACHE * FROM users_no_index WHERE username = 'user000001';
SHOW PROFILES;

-- 인덱스 있는 테이블 성능 측정
SELECT SQL_NO_CACHE * FROM users_with_index WHERE username = 'user000001';
SHOW PROFILES;

SET profiling = 0;
```

#### 인덱스 사용 현황 분석

```sql
-- 각 인덱스의 사용 빈도 (MySQL 8.0+)
SELECT
    OBJECT_SCHEMA as database_name,
    OBJECT_NAME as table_name,
    INDEX_NAME,
    COUNT_READ,
    COUNT_WRITE,
    COUNT_FETCH,
    COUNT_INSERT,
    COUNT_UPDATE,
    COUNT_DELETE
FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE OBJECT_SCHEMA = 'index_test'
ORDER BY COUNT_READ DESC;
```

---

## 주의사항 및 모범 사례

### 1. 인덱스 과다 사용 방지

- 너무 많은 인덱스는 INSERT, UPDATE, DELETE 성능 저하

### 2. 정기적인 인덱스 분석

```sql
-- 인덱스 사용 통계 확인
SELECT
    TABLE_NAME,
    INDEX_NAME,
    CARDINALITY,
    SUB_PART
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'index_test'
ORDER BY CARDINALITY DESC;
```

### 3. 인덱스 유지보수

```sql
-- 정기적인 인덱스 재구성
OPTIMIZE TABLE users_with_index;
OPTIMIZE TABLE orders;

-- 인덱스 통계 업데이트
ANALYZE TABLE users_with_index;
ANALYZE TABLE orders;
```

### 4. 모니터링 쿼리

```sql
-- 느린 쿼리 확인
SELECT
    query,
    exec_count,
    avg_timer_wait/1000000000 as avg_time_sec
FROM performance_schema.events_statements_summary_by_digest
WHERE avg_timer_wait > 1000000000  -- 1초 이상
ORDER BY avg_timer_wait DESC;
```

---

## 결론

MySQL 인덱스는 데이터베이스 성능 최적화의 핵심 요소입니다. 적절한 인덱스 설계와 관리를 통해 쿼리 성능을 크게 향상시킬 수 있습니다. 하지만 과도한 인덱스는 오히려 성능을 저하시킬 수 있으므로, 실제 사용 패턴을 분석하여 필요한 인덱스만 선별적으로 생성하는 것이 중요합니다.

### 핵심 포인트

1. **B-Tree 구조 이해**: 인덱스의 기본 작동 원리
2. **카디널리티 고려**: 높은 카디널리티 컬럼 우선
3. **복합 인덱스 순서**: 자주 사용되는 컬럼을 앞에 배치
4. **정기적인 모니터링**: 인덱스 사용 현황 파악
5. **실제 데이터로 테스트**: 이론과 실제 성능의 차이 확인

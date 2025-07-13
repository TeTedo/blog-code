-- MySQL 인덱스 성능 테스트 쿼리
-- 실행 전: USE index_test;

-- 1. 인덱스 유무에 따른 성능 비교

-- 1-1. 사용자명으로 검색 (인덱스 없음)
EXPLAIN SELECT * FROM users_no_index WHERE username = 'user000001';
SELECT SQL_NO_CACHE * FROM users_no_index WHERE username = 'user000001';

-- 1-2. 사용자명으로 검색 (인덱스 있음)
EXPLAIN SELECT * FROM users_with_index WHERE username = 'user000001';
SELECT SQL_NO_CACHE * FROM users_with_index WHERE username = 'user000001';

-- 2. 복합 인덱스 테스트

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

-- 3. JOIN 성능 테스트

-- 3-1. 사용자와 주문 조인 (인덱스 활용)
EXPLAIN SELECT u.username, o.order_number, o.total_amount
FROM users_with_index u
JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active' AND o.status = 'delivered'
ORDER BY o.created_at DESC
LIMIT 100;

-- 4. 카디널리티 테스트

-- 4-1. 높은 카디널리티 컬럼 (username) 검색
EXPLAIN SELECT * FROM users_with_index WHERE username LIKE 'user%';

-- 4-2. 낮은 카디널리티 컬럼 (status) 검색
EXPLAIN SELECT * FROM users_with_index WHERE status = 'active';

-- 5. 정렬 성능 테스트

-- 5-1. 인덱스가 있는 컬럼으로 정렬
EXPLAIN SELECT * FROM users_with_index 
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 1000;

-- 5-2. 인덱스가 없는 컬럼으로 정렬
EXPLAIN SELECT * FROM users_with_index 
WHERE status = 'active'
ORDER BY email
LIMIT 1000;

-- 6. 집계 함수 성능 테스트

-- 6-1. 상태별 사용자 수 (인덱스 활용)
EXPLAIN SELECT status, COUNT(*) as user_count
FROM users_with_index
GROUP BY status;

-- 6-2. 월별 주문 수 (인덱스 활용)
EXPLAIN SELECT 
    DATE_FORMAT(created_at, '%Y-%m') as month,
    COUNT(*) as order_count,
    SUM(total_amount) as total_sales
FROM orders
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month;

-- 7. 인덱스 사용 통계 확인

-- 7-1. 테이블별 인덱스 정보
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

-- 7-2. 인덱스 크기 확인
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    ROUND(SUM(INDEX_LENGTH) / 1024 / 1024, 2) as index_size_mb
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'index_test'
GROUP BY TABLE_NAME, INDEX_NAME;

-- 8. 성능 모니터링 쿼리

-- 8-1. 느린 쿼리 확인 (Performance Schema 활성화 필요)
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

-- 9. 인덱스 최적화 테스트

-- 9-1. 불필요한 인덱스 확인
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

-- 10. 실제 성능 측정

-- 10-1. 인덱스 없는 테이블 성능 측정
SET profiling = 1;
SELECT SQL_NO_CACHE * FROM users_no_index WHERE username = 'user000001';
SHOW PROFILES;

-- 10-2. 인덱스 있는 테이블 성능 측정
SELECT SQL_NO_CACHE * FROM users_with_index WHERE username = 'user000001';
SHOW PROFILES;

SET profiling = 0;

-- 11. 인덱스 유지보수

-- 11-1. 인덱스 재구성
OPTIMIZE TABLE users_with_index;
OPTIMIZE TABLE orders;

-- 11-2. 인덱스 통계 업데이트
ANALYZE TABLE users_with_index;
ANALYZE TABLE orders;

-- 12. 인덱스 사용 현황 분석

-- 12-1. 각 인덱스의 사용 빈도 (MySQL 8.0+)
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
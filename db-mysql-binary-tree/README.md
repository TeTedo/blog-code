# MySQL B-Tree 배워보기

모든 코드는 [깃허브](https://github.com/TeTedo/blog-code/tree/main/db-mysql-binary-tree)에서 볼수 있습니다.

## 1. B-Tree란?

B-Tree는 데이터베이스 인덱싱에서 가장 널리 사용되는 자료구조입니다. 이진트리를 확장한 형태로, 각 노드가 여러 개의 자식을 가질 수 있는 균형잡힌 트리입니다.

### B-Tree의 특징

- 각 노드는 여러 개의 키를 가질 수 있음
- 모든 리프 노드가 같은 레벨에 있음 (균형잡힌 구조)
- 검색, 삽입, 삭제 연산이 모두 O(log n) 시간복잡도
- 디스크 기반 저장소에 최적화

### B-Tree vs 이진트리

- **이진트리**: 각 노드가 최대 2개의 자식
- **B-Tree**: 각 노드가 여러 개의 자식 (보통 수백~수천개)
- **B-Tree**: 디스크 I/O 최소화에 특화

### B-Tree의 핵심 메커니즘

#### 1. 노드 분할 (Node Splitting)

B-Tree에서 노드가 가득 찰 때 발생하는 핵심 연산입니다.

**분할 과정:**

1. **중간 키 선택**: 노드의 중간 키를 선택
2. **키 분배**: 중간 키보다 작은 키들은 왼쪽, 큰 키들은 오른쪽으로 분배
3. **부모 노드 업데이트**: 중간 키를 부모 노드로 이동
4. **균형 유지**: 모든 리프 노드가 같은 레벨에 있도록 유지

**예시:**

```
분할 전: [3, 5, 7, 9, 11] (가득 찬 노드)
분할 후:
  부모: [7]
  왼쪽: [3, 5]
  오른쪽: [9, 11]
```

#### 2. 재조정 (Rebalancing)

B-Tree가 균형을 유지하기 위한 연산입니다.

**재조정이 필요한 경우:**

- 노드가 최소 키 수보다 적어질 때
- 삭제 연산 후 노드가 비어있을 때
- 형제 노드에서 키를 빌려올 수 있을 때

**재조정 과정:**

1. **형제 노드 확인**: 같은 부모를 가진 형제 노드들 확인
2. **키 재분배**: 형제 노드에서 키를 빌려와서 균형 조정
3. **부모 노드 조정**: 부모 노드의 키 값 업데이트
4. **병합 (필요시)**: 형제 노드에서 키를 빌릴 수 없으면 노드 병합

**예시:**

```
재조정 전:
  부모: [10]
  왼쪽: [3] (최소 키 수 미달)
  오른쪽: [15, 18, 20]

재조정 후:
  부모: [15]
  왼쪽: [3, 10]
  오른쪽: [18, 20]
```

#### 3. B-Tree의 균형 유지 원리

**균형 조건:**

- 모든 리프 노드는 같은 레벨에 있어야 함
- 각 노드는 최소 `⌈degree/2⌉ - 1`개의 키를 가져야 함
- 각 노드는 최대 `degree - 1`개의 키를 가질 수 있음

**균형 유지의 장점:**

- **일관된 성능**: 모든 검색이 동일한 깊이에서 완료
- **예측 가능한 I/O**: 디스크 접근 횟수가 일정
- **효율적인 범위 검색**: 연속된 키들을 빠르게 찾기 가능

### B-Tree의 실제 동작 예시

```
초기 상태: [10]
         /   \
      [5]   [15]

키 3 삽입: [10]
          /   \
       [3,5] [15]

키 7 삽입: [10]
          /   \
       [3,5,7] [15]

키 12 삽입: [10]
           /   \
        [3,5,7] [12,15]

키 18 삽입: [10, 15]
           /   |   \
        [3,5,7] [12] [18]
```

이러한 노드 분할과 재조정을 통해 B-Tree는 항상 균형잡힌 상태를 유지하며, 대용량 데이터에서도 일관된 성능을 제공합니다.

## 2. MySQL에서 B-Tree 사용하기

### B-Tree 인덱스

MySQL의 기본 인덱스 구조는 B-Tree입니다. InnoDB 스토리지 엔진에서는 B+Tree를 사용합니다.

```sql
-- 인덱스 생성 예시
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_product_category ON products(category_id);
CREATE INDEX idx_order_date ON orders(order_date);
```

### 검색 성능 최적화

- **O(log n) 시간복잡도**: 대용량 데이터에서도 빠른 검색
- **범위 검색**: BETWEEN, <, > 등의 연산에 효율적
- **정렬된 데이터**: 자동으로 정렬된 상태 유지
- **디스크 I/O 최소화**: 한 번의 디스크 읽기로 많은 데이터 처리

### 실제 MySQL 동작 과정

```sql
-- 이 쿼리가 실행될 때
SELECT * FROM users WHERE email = 'user@example.com';

-- MySQL은 다음과 같이 동작합니다:
-- 1. email 컬럼의 B-Tree 인덱스 검색
-- 2. O(log n) 시간에 해당 레코드 위치 찾기
-- 3. 해당 위치에서 실제 데이터 조회
-- 4. 디스크 I/O 최소화로 성능 향상
```

## 3. JavaScript로 B-Tree 구현해보기

### B-Node 노드 구조

```javascript
class BTreeNode {
  constructor(isLeaf = true) {
    this.isLeaf = isLeaf;
    this.keys = [];
    this.children = [];
    this.next = null; // B+Tree를 위한 링크
  }
}
```

### B-Tree 구현

```javascript
class BTree {
  constructor(degree = 3) {
    this.root = new BTreeNode(true);
    this.degree = degree;
    this.minKeys = Math.ceil(degree / 2) - 1;
    this.maxKeys = degree - 1;
  }

  // 노드 검색
  search(key) {
    return this._searchNode(this.root, key);
  }

  _searchNode(node, key) {
    let i = 0;

    // 키를 찾을 위치 찾기
    while (i < node.keys.length && key > node.keys[i]) {
      i++;
    }

    // 리프 노드에서 찾기
    if (node.isLeaf) {
      if (i < node.keys.length && node.keys[i] === key) {
        return node;
      }
      return null;
    }

    // 내부 노드에서 자식으로 이동
    return this._searchNode(node.children[i], key);
  }

  // 노드 삽입
  insert(key) {
    const root = this.root;

    // 루트가 가득 찬 경우
    if (root.keys.length === this.maxKeys) {
      const newRoot = new BTreeNode(false);
      newRoot.children.push(root);
      this._splitChild(newRoot, 0);
      this.root = newRoot;
    }

    this._insertNonFull(this.root, key);
  }

  _insertNonFull(node, key) {
    let i = node.keys.length - 1;

    // 리프 노드인 경우
    if (node.isLeaf) {
      while (i >= 0 && key < node.keys[i]) {
        node.keys[i + 1] = node.keys[i];
        i--;
      }
      node.keys[i + 1] = key;
    } else {
      // 내부 노드인 경우
      while (i >= 0 && key < node.keys[i]) {
        i--;
      }
      i++;

      if (node.children[i].keys.length === this.maxKeys) {
        this._splitChild(node, i);
        if (key > node.keys[i]) {
          i++;
        }
      }
      this._insertNonFull(node.children[i], key);
    }
  }

  _splitChild(parent, childIndex) {
    const child = parent.children[childIndex];
    const newNode = new BTreeNode(child.isLeaf);

    // 키 분할
    const midIndex = Math.floor(child.keys.length / 2);
    const midKey = child.keys[midIndex];

    // 오른쪽 노드에 키 이동
    for (let i = midIndex + 1; i < child.keys.length; i++) {
      newNode.keys.push(child.keys[i]);
    }
    child.keys = child.keys.slice(0, midIndex);

    // 자식 노드 분할 (내부 노드인 경우)
    if (!child.isLeaf) {
      for (let i = midIndex + 1; i < child.children.length; i++) {
        newNode.children.push(child.children[i]);
      }
      child.children = child.children.slice(0, midIndex + 1);
    }

    // 부모 노드에 중간 키 삽입
    parent.keys.splice(childIndex, 0, midKey);
    parent.children.splice(childIndex + 1, 0, newNode);
  }

  // 범위 검색
  rangeSearch(minKey, maxKey) {
    const result = [];
    this._rangeSearchNode(this.root, minKey, maxKey, result);
    return result;
  }

  _rangeSearchNode(node, minKey, maxKey, result) {
    let i = 0;

    // 현재 노드의 키들 확인
    while (i < node.keys.length) {
      if (node.isLeaf) {
        if (node.keys[i] >= minKey && node.keys[i] <= maxKey) {
          result.push(node.keys[i]);
        }
      } else {
        // 내부 노드인 경우 자식으로 재귀
        if (i === 0 || node.keys[i - 1] < minKey) {
          this._rangeSearchNode(node.children[i], minKey, maxKey, result);
        }
      }
      i++;
    }

    // 마지막 자식 확인
    if (!node.isLeaf) {
      this._rangeSearchNode(node.children[i], minKey, maxKey, result);
    }
  }
}
```

### MySQL 인덱스 시뮬레이션

```javascript
class MySQLBTreeSimulator {
  constructor() {
    this.btree = new BTree(4); // degree = 4
    this.data = new Map(); // 실제 데이터 저장
  }

  // 데이터 삽입 (MySQL INSERT)
  insertRecord(id, data) {
    this.btree.insert(id);
    this.data.set(id, data);
    console.log(`레코드 삽입: ID=${id}, 데이터=${JSON.stringify(data)}`);
  }

  // 데이터 검색 (MySQL SELECT)
  searchRecord(id) {
    const found = this.btree.search(id);
    if (found) {
      const data = this.data.get(id);
      console.log(`레코드 검색 성공: ID=${id}, 데이터=${JSON.stringify(data)}`);
      return data;
    } else {
      console.log(`레코드 검색 실패: ID=${id}를 찾을 수 없습니다.`);
      return null;
    }
  }

  // 범위 검색 (MySQL BETWEEN)
  searchRange(minId, maxId) {
    const result = this.btree.rangeSearch(minId, maxId);

    console.log(`범위 검색: ${minId} ~ ${maxId}`);
    result.forEach((id) => {
      const data = this.data.get(id);
      console.log(`  ID=${id}, 데이터=${JSON.stringify(data)}`);
    });

    return result;
  }

  // 인덱스 통계 출력
  printIndexStats() {
    console.log(`\n=== B-Tree 인덱스 통계 ===`);
    console.log(`차수(degree): ${this.btree.degree}`);
    console.log(`최소 키 수: ${this.btree.minKeys}`);
    console.log(`최대 키 수: ${this.btree.maxKeys}`);
  }
}
```

## 4. 실행해보기

### 실제 사용 예시

```javascript
console.log("🚀 MySQL B-Tree 시뮬레이션 시작\n");

// MySQL B-Tree 시뮬레이션 실행
const mysqlSimulator = new MySQLBTreeSimulator();

console.log("📝 데이터 삽입 테스트");
// 데이터 삽입 (INSERT)
mysqlSimulator.insertRecord(10, {
  name: "김철수",
  email: "kim@example.com",
  age: 25,
});
mysqlSimulator.insertRecord(5, {
  name: "이영희",
  email: "lee@example.com",
  age: 28,
});
mysqlSimulator.insertRecord(15, {
  name: "박민수",
  email: "park@example.com",
  age: 32,
});
mysqlSimulator.insertRecord(3, {
  name: "정수진",
  email: "jung@example.com",
  age: 24,
});
mysqlSimulator.insertRecord(7, {
  name: "최지영",
  email: "choi@example.com",
  age: 29,
});
mysqlSimulator.insertRecord(12, {
  name: "한민호",
  email: "han@example.com",
  age: 31,
});
mysqlSimulator.insertRecord(18, {
  name: "송미영",
  email: "song@example.com",
  age: 26,
});

console.log("\n🔍 개별 검색 테스트");
mysqlSimulator.searchRecord(7); // 성공
mysqlSimulator.searchRecord(9); // 실패

console.log("\n📊 범위 검색 테스트");
mysqlSimulator.searchRange(5, 12);

// 인덱스 통계 출력
mysqlSimulator.printIndexStats();

console.log("\n🌳 트리 구조 시각화");
mysqlSimulator.visualizeTree();
```

터미널에 다음과 같이 출력된다.

```bash
📝 데이터 삽입 테스트
레코드 삽입: ID=10, 데이터={"name":"김철수","email":"kim@example.com","age":25}
레코드 삽입: ID=5, 데이터={"name":"이영희","email":"lee@example.com","age":28}
레코드 삽입: ID=15, 데이터={"name":"박민수","email":"park@example.com","age":32}
레코드 삽입: ID=3, 데이터={"name":"정수진","email":"jung@example.com","age":24}
레코드 삽입: ID=7, 데이터={"name":"최지영","email":"choi@example.com","age":29}
레코드 삽입: ID=12, 데이터={"name":"한민호","email":"han@example.com","age":31}
레코드 삽입: ID=18, 데이터={"name":"송미영","email":"song@example.com","age":26}

🔍 개별 검색 테스트
레코드 검색 성공: ID=7, 데이터={"name":"최지영","email":"choi@example.com","age":29}
레코드 검색 실패: ID=9를 찾을 수 없습니다.

📊 범위 검색 테스트
범위 검색: 5 ~ 12
  ID=5, 데이터={"name":"이영희","email":"lee@example.com","age":28}
  ID=7, 데이터={"name":"최지영","email":"choi@example.com","age":29}
  ID=12, 데이터={"name":"한민호","email":"han@example.com","age":31}

=== B-Tree 인덱스 통계 ===
차수(degree): 4
최소 키 수: 1
최대 키 수: 3
총 레코드 수: 7
정렬된 키 목록: [3, 5, 7, 10, 12, 15, 18]

🌳 트리 구조 시각화
=== B-Tree 구조 ===
└── [10]
    ┌── [3,5,7]
    └── [12,15,18]
```

## 5. 성능 비교

### 시간복잡도 비교

| 연산     | 배열 (순차검색) | 이진트리     | B-Tree       | MySQL B-Tree |
| -------- | --------------- | ------------ | ------------ | ------------ |
| 검색     | O(n)            | O(log n)     | O(log n)     | O(log n)     |
| 삽입     | O(1)            | O(log n)     | O(log n)     | O(log n)     |
| 범위검색 | O(n)            | O(k + log n) | O(k + log n) | O(k + log n) |

### 디스크 I/O 비교

- **이진트리**: 불균형할 수 있어 디스크 I/O 많음
- **B-Tree**: 균형잡힌 구조로 디스크 I/O 최소화
- **MySQL B-Tree**: 페이지 단위로 데이터 관리

### 실제 성능 테스트

```javascript
const { BTree } = require("./b-tree.js");

function performanceTest() {
  const btree = new BTree(4);
  const array = [];

  console.log("=== B-Tree 성능 테스트 ===");

  // 데이터 크기를 늘려서 더 유의미한 테스트
  const dataSize = 100000; // 10만개 데이터

  // 데이터 삽입 성능
  const insertStart = Date.now();
  for (let i = 0; i < dataSize; i++) {
    btree.insert(i);
    array.push(i);
  }
  const insertEnd = Date.now();
  console.log(
    `B-Tree 삽입 시간: ${insertEnd - insertStart}ms (${dataSize}개 데이터)`
  );

  // 검색 성능 비교 - 여러 번 반복해서 평균 측정
  const searchValue = Math.floor(dataSize / 2); // 중간 값 검색
  const iterations = 1000; // 1000번 반복

  // B-Tree 검색 (반복)
  const btreeSearchStart = Date.now();
  for (let i = 0; i < iterations; i++) {
    btree.search(searchValue);
  }
  const btreeSearchEnd = Date.now();

  // 배열 순차검색 (반복)
  const arraySearchStart = Date.now();
  for (let i = 0; i < iterations; i++) {
    array.indexOf(searchValue);
  }
  const arraySearchEnd = Date.now();

  const btreeSearchTime = btreeSearchEnd - btreeSearchStart;
  const arraySearchTime = arraySearchEnd - arraySearchStart;

  console.log(
    `B-Tree 검색 시간: ${btreeSearchTime}ms (${iterations}번 반복, 평균: ${(
      btreeSearchTime / iterations
    ).toFixed(3)}ms)`
  );
  console.log(
    `배열 검색 시간: ${arraySearchTime}ms (${iterations}번 반복, 평균: ${(
      arraySearchTime / iterations
    ).toFixed(3)}ms)`
  );

  // 성능 비교
  if (btreeSearchTime === 0) {
    console.log(`성능 차이: B-Tree 검색이 너무 빠름 (0ms)`);
  } else {
    const performanceRatio = arraySearchTime / btreeSearchTime;
    console.log(`성능 차이: B-Tree가 ${performanceRatio.toFixed(2)}배 빠름`);
  }

  // 추가 테스트: 최악의 경우 (배열 끝에서 검색)
  console.log("\n=== 최악의 경우 테스트 (배열 끝에서 검색) ===");
  const worstCaseValue = dataSize - 1;

  const btreeWorstStart = Date.now();
  for (let i = 0; i < iterations; i++) {
    btree.search(worstCaseValue);
  }
  const btreeWorstEnd = Date.now();

  const arrayWorstStart = Date.now();
  for (let i = 0; i < iterations; i++) {
    array.indexOf(worstCaseValue);
  }
  const arrayWorstEnd = Date.now();

  const btreeWorstTime = btreeWorstEnd - btreeWorstStart;
  const arrayWorstTime = arrayWorstEnd - arrayWorstStart;

  console.log(`B-Tree 최악의 경우: ${btreeWorstTime}ms (${iterations}번 반복)`);
  console.log(`배열 최악의 경우: ${arrayWorstTime}ms (${iterations}번 반복)`);

  if (btreeWorstTime === 0) {
    console.log(`최악의 경우 성능 차이: B-Tree 검색이 너무 빠름`);
  } else {
    const worstCaseRatio = arrayWorstTime / btreeWorstTime;
    console.log(
      `최악의 경우 성능 차이: B-Tree가 ${worstCaseRatio.toFixed(2)}배 빠름`
    );
  }

  // 범위 검색 테스트
  console.log("\n=== 범위 검색 테스트 ===");
  const rangeStart = Math.floor(dataSize * 0.3);
  const rangeEnd = Math.floor(dataSize * 0.7);

  const btreeRangeStart = Date.now();
  for (let i = 0; i < 100; i++) {
    // 범위 검색은 더 적게 반복
    btree.rangeSearch(rangeStart, rangeEnd);
  }
  const btreeRangeEnd = Date.now();

  const arrayRangeStart = Date.now();
  for (let i = 0; i < 100; i++) {
    array.filter((x) => x >= rangeStart && x <= rangeEnd);
  }
  const arrayRangeEnd = Date.now();

  const btreeRangeTime = btreeRangeEnd - btreeRangeStart;
  const arrayRangeTime = arrayRangeEnd - arrayRangeStart;

  console.log(
    `B-Tree 범위 검색: ${btreeRangeTime}ms (100번 반복, ${
      rangeEnd - rangeStart
    }개 데이터)`
  );
  console.log(
    `배열 범위 검색: ${arrayRangeTime}ms (100번 반복, ${
      rangeEnd - rangeStart
    }개 데이터)`
  );

  if (btreeRangeTime === 0) {
    console.log(`범위 검색 성능 차이: B-Tree가 너무 빠름`);
  } else {
    const rangeRatio = arrayRangeTime / btreeRangeTime;
    console.log(
      `범위 검색 성능 차이: B-Tree가 ${rangeRatio.toFixed(2)}배 빠름`
    );
  }
}

module.exports = { performanceTest };
```

결과

```
=== B-Tree 성능 테스트 ===
B-Tree 삽입 시간: 45ms (100000개 데이터)
B-Tree 검색 시간: 1ms (1000번 반복, 평균: 0.001ms)
배열 검색 시간: 10ms (1000번 반복, 평균: 0.010ms)
성능 차이: B-Tree가 10.00배 빠름

=== 최악의 경우 테스트 (배열 끝에서 검색) ===
B-Tree 최악의 경우: 0ms (1000번 반복)
배열 최악의 경우: 19ms (1000번 반복)
최악의 경우 성능 차이: B-Tree 검색이 너무 빠름

=== 범위 검색 테스트 ===
B-Tree 범위 검색: 84ms (100번 반복, 40000개 데이터)
배열 범위 검색: 88ms (100번 반복, 40000개 데이터)
범위 검색 성능 차이: B-Tree가 1.05배 빠름
```

## 6. 뜯어보기

### B-Tree 구조

```
        [7]
       /   \
   [3,5]   [10,15]
   /  \     /    \
[1,2] [4] [8,9] [12,18]
```

위 구조에서 각 노드는 여러 개의 키를 가질 수 있고, 모든 리프 노드가 같은 레벨에 있습니다.

### MySQL B-Tree 동작 원리

1. **인덱스 생성**: CREATE INDEX로 B-Tree 구조 생성
2. **페이지 관리**: 디스크를 페이지 단위로 관리
3. **검색**: WHERE 조건에 맞는 레코드를 B-Tree에서 빠르게 찾기
4. **데이터 조회**: 찾은 위치에서 실제 테이블 데이터 조회

### B-Tree의 장점

- **균형잡힌 구조**: 모든 리프 노드가 같은 레벨
- **디스크 I/O 최소화**: 한 페이지에 많은 키 저장
- **범위 검색 효율성**: 연속된 키들을 빠르게 검색
- **삽입/삭제 안정성**: 재구성 없이 균형 유지

### 핵심 포인트

- **효율적인 검색**: O(log n) 시간복잡도로 대용량 데이터에서도 빠른 검색
- **범위 검색 최적화**: BETWEEN, <, > 연산에 유리
- **디스크 최적화**: 페이지 단위로 데이터 관리
- **자동 정렬**: 데이터가 자동으로 정렬된 상태 유지

## 7. 결론

```
B-Tree 이해
MySQL 인덱스 활용
디스크 I/O 최적화 완료
```

MySQL에서 B-Tree는 인덱싱의 핵심 자료구조로 사용됩니다. 이진트리보다 디스크 I/O를 최소화하고, 대용량 데이터에서도 안정적인 성능을 제공합니다.

B-Tree의 이해는 데이터베이스 성능 최적화와 효율적인 쿼리 작성에 필수적입니다.

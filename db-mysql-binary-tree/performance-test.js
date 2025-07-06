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

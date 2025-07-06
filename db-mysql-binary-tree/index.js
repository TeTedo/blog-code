const { MySQLBTreeSimulator } = require("./mysql-b-tree-simulator.js");
const { performanceTest } = require("./performance-test.js");

function main() {
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

  console.log("\n⚡ 성능 테스트");
  performanceTest();

  console.log("\n✅ 시뮬레이션 완료!");
}

// 스크립트가 직접 실행될 때만 main 함수 호출
if (typeof require !== "undefined" && require.main === module) {
  main();
}

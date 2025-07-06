const { BTree } = require("./b-tree.js");

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
    console.log(`총 레코드 수: ${this.data.size}`);

    const allKeys = this.btree.getAllKeys();
    console.log(`정렬된 키 목록: [${allKeys.join(", ")}]`);
  }

  // 트리 구조 시각화
  visualizeTree() {
    this.btree.visualize();
  }
}

module.exports = { MySQLBTreeSimulator };

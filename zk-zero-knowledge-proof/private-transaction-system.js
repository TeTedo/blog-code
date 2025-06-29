const crypto = require("crypto");

/**
 * 블록체인 거래 프라이버시 예제
 * 실제 거래 정보를 숨기면서도 거래의 유효성을 증명할 수 있다.
 */
class PrivateTransaction {
  constructor() {
    this.zkProof = null;
  }

  /**
   * 프라이빗 거래 생성
   * @param {string} from - 송신자 주소
   * @param {string} to - 수신자 주소
   * @param {number} amount - 거래 금액
   * @returns {Object} 프라이빗 거래 정보
   */
  createPrivateTransaction(from, to, amount) {
    if (amount <= 0) {
      throw new Error("거래 금액은 0보다 커야 합니다.");
    }

    // 실제 거래 정보를 숨기고 증명만 생성
    const transactionHash = this.hashTransaction(from, to, amount);

    // ZK 증명 생성 (실제로는 더 복잡한 과정)
    this.zkProof = this.generateZKProof(transactionHash, amount);

    return {
      proof: this.zkProof,
      publicData: {
        timestamp: Date.now(),
        transactionType: "private",
        transactionId: crypto.randomBytes(16).toString("hex"),
      },
    };
  }

  /**
   * 거래 해시 생성
   * @param {string} from - 송신자 주소
   * @param {string} to - 수신자 주소
   * @param {number} amount - 거래 금액
   * @returns {string} 거래 해시
   */
  hashTransaction(from, to, amount) {
    return crypto
      .createHash("sha256")
      .update(`${from}${to}${amount}`)
      .digest("hex");
  }

  /**
   * ZK 증명 생성 (간단한 예시)
   * @param {string} transactionHash - 거래 해시
   * @param {number} amount - 거래 금액
   * @returns {Object} ZK 증명
   */
  generateZKProof(transactionHash, amount) {
    // 실제로는 zk-SNARK나 zk-STARK 사용
    return {
      proofHash: crypto
        .createHash("sha256")
        .update(`${transactionHash}${amount}`)
        .digest("hex"),
      publicInputs: {
        transactionHash,
        amountRange: "positive", // 금액이 양수임만 증명
        amountValid: amount > 0,
      },
    };
  }

  /**
   * 거래 검증
   * @param {Object} transaction - 거래 정보
   * @returns {boolean} 거래 유효성
   */
  verifyTransaction(transaction) {
    // ZK 증명 검증
    const isValidProof = this.verifyZKProof(transaction.proof);

    // 공개 데이터 검증
    const isValidPublicData =
      transaction.publicData &&
      transaction.publicData.transactionType === "private";

    return isValidProof && isValidPublicData;
  }

  /**
   * ZK 증명 검증
   * @param {Object} proof - ZK 증명
   * @returns {boolean} 증명 유효성
   */
  verifyZKProof(proof) {
    // 실제로는 더 복잡한 검증 로직
    return (
      proof.proofHash && proof.publicInputs && proof.publicInputs.amountValid
    );
  }

  /**
   * 거래 정보 출력 (디버깅용)
   * @param {Object} transaction - 거래 객체
   */
  printTransactionInfo(transaction) {
    console.log("=== 프라이빗 거래 정보 ===");
    console.log("거래 ID:", transaction.publicData.transactionId);
    console.log("거래 타입:", transaction.publicData.transactionType);
    console.log(
      "생성 시간:",
      new Date(transaction.publicData.timestamp).toLocaleString()
    );
    console.log(
      "증명 해시:",
      transaction.proof.proofHash.substring(0, 16) + "..."
    );
    console.log("공개 입력:", transaction.proof.publicInputs);
    console.log("==========================");
  }

  /**
   * 프라이빗 거래 시스템 테스트
   */
  static runTest() {
    console.log("2️⃣ 프라이빗 거래 시스템 테스트");

    const privateTx = new PrivateTransaction();

    try {
      // 프라이빗 거래 생성
      console.log("📝 프라이빗 거래 생성 중...");
      const transaction = privateTx.createPrivateTransaction(
        "alice_wallet_0x1234...",
        "bob_wallet_0x5678...",
        100
      );
      privateTx.printTransactionInfo(transaction);

      // 거래 검증
      console.log("🔍 거래 검증 중...");
      const isTransactionValid = privateTx.verifyTransaction(transaction);
      console.log("✅ 거래 유효성:", isTransactionValid ? "유효함" : "무효함");

      // 잘못된 금액으로 거래 시도
      console.log("\n📝 잘못된 금액(-50)으로 거래 시도...");
      try {
        privateTx.createPrivateTransaction("alice", "bob", -50);
      } catch (error) {
        console.log("❌ 예상된 오류:", error.message);
      }

      // 다양한 거래 테스트
      console.log("\n📝 다양한 거래 테스트...");
      const testTransactions = [
        {
          from: "user1_wallet_0x1111...",
          to: "user2_wallet_0x2222...",
          amount: 500,
          description: "정상 거래 (500)",
        },
        {
          from: "user3_wallet_0x3333...",
          to: "user4_wallet_0x4444...",
          amount: 0,
          description: "0원 거래 (실패 예상)",
        },
        {
          from: "user5_wallet_0x5555...",
          to: "user6_wallet_0x6666...",
          amount: 1000,
          description: "대금액 거래 (1000)",
        },
      ];

      testTransactions.forEach((testCase, index) => {
        console.log(`\n테스트 케이스 ${index + 1}: ${testCase.description}`);
        try {
          const testTransaction = privateTx.createPrivateTransaction(
            testCase.from,
            testCase.to,
            testCase.amount
          );
          const testValid = privateTx.verifyTransaction(testTransaction);
          console.log(`✅ 결과: ${testValid ? "성공" : "실패"}`);
          console.log(
            `   거래 ID: ${testTransaction.publicData.transactionId}`
          );
        } catch (error) {
          console.log(`❌ 결과: ${error.message}`);
        }
      });

      // 거래 해시 비교 테스트
      console.log("\n📝 거래 해시 비교 테스트...");
      const hash1 = privateTx.hashTransaction("alice", "bob", 100);
      const hash2 = privateTx.hashTransaction("alice", "bob", 100);
      const hash3 = privateTx.hashTransaction("alice", "bob", 200);

      console.log("같은 거래 해시 비교:", hash1 === hash2 ? "일치" : "불일치");
      console.log("다른 거래 해시 비교:", hash1 === hash3 ? "일치" : "불일치");
    } catch (error) {
      console.error("❌ 프라이빗 거래 시스템 오류:", error.message);
    }
  }
}

// 스크립트가 직접 실행될 때만 테스트 실행
if (require.main === module) {
  console.log("🚀 프라이빗 거래 시스템 테스트 실행\n");
  PrivateTransaction.runTest();
}

module.exports = PrivateTransaction;

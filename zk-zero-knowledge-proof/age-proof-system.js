const crypto = require("crypto");

/**
 * ZK 기반 나이 증명 시스템
 * 사용자의 정확한 나이를 노출하지 않고도 최소 나이 조건을 증명할 수 있다.
 */
class AgeProofSystem {
  constructor() {
    this.trustedSetup = this.generateTrustedSetup();
  }

  /**
   * 신뢰 설정 생성 (실제로는 더 복잡한 과정)
   * @returns {Object} 신뢰 설정 정보
   */
  generateTrustedSetup() {
    const secret = crypto.randomBytes(32);
    const publicKey = crypto.createHash("sha256").update(secret).digest();
    return { secret, publicKey };
  }

  /**
   * 나이 증명 생성
   * @param {number} birthYear - 출생년도
   * @param {number} minimumAge - 최소 나이
   * @returns {Object} 나이 증명
   */
  generateAgeProof(birthYear, minimumAge) {
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    if (age < minimumAge) {
      throw new Error(
        `나이가 부족합니다. 현재 나이: ${age}세, 필요 나이: ${minimumAge}세`
      );
    }

    // 나이 정보를 해시하여 증명 생성
    const ageHash = crypto
      .createHash("sha256")
      .update(birthYear.toString())
      .digest("hex");

    // 최소 나이 조건을 만족하는 증명
    const proof = {
      ageHash,
      minimumAge,
      proofData: this.createProofData(age, minimumAge),
      timestamp: Date.now(),
    };

    return proof;
  }

  /**
   * 증명 검증
   * @param {Object} proof - 검증할 증명
   * @returns {boolean} 증명 유효성
   */
  verifyAgeProof(proof) {
    try {
      // 증명 데이터 검증
      const isValid = this.verifyProofData(proof.proofData, proof.minimumAge);

      // 타임스탬프 검증 (24시간 이내)
      const now = Date.now();
      const timeDiff = now - proof.timestamp;
      const isRecent = timeDiff < 24 * 60 * 60 * 1000; // 24시간

      return isValid && isRecent;
    } catch (error) {
      console.error("증명 검증 실패:", error.message);
      return false;
    }
  }

  /**
   * 증명 데이터 생성 (실제 구현에서는 더 복잡한 암호학적 증명 사용)
   * @param {number} age - 나이
   * @param {number} minimumAge - 최소 나이
   * @returns {string} 증명 데이터
   */
  createProofData(age, minimumAge) {
    return crypto
      .createHash("sha256")
      .update(`${age}-${minimumAge}-${this.trustedSetup.publicKey}`)
      .digest("hex");
  }

  /**
   * 증명 데이터 검증
   * @param {string} proofData - 증명 데이터
   * @param {number} minimumAge - 최소 나이
   * @returns {boolean} 검증 결과
   */
  verifyProofData(proofData, minimumAge) {
    // 실제로는 더 복잡한 검증 로직
    return proofData.length === 64; // SHA-256 해시 길이
  }

  /**
   * 증명 정보 출력 (디버깅용)
   * @param {Object} proof - 증명 객체
   */
  printProofInfo(proof) {
    console.log("=== 나이 증명 정보 ===");
    console.log("나이 해시:", proof.ageHash);
    console.log("최소 나이:", proof.minimumAge);
    console.log("증명 데이터:", proof.proofData.substring(0, 16) + "...");
    console.log("생성 시간:", new Date(proof.timestamp).toLocaleString());
    console.log("========================");
  }

  /**
   * 나이 증명 시스템 테스트
   */
  static runTest() {
    console.log("1️⃣ 나이 증명 시스템 테스트");

    const ageProof = new AgeProofSystem();

    try {
      // 25세 사용자가 18세 이상임을 증명
      console.log("📝 25세 사용자의 18세 이상 증명 생성 중...");
      const proof = ageProof.generateAgeProof(1998, 18);
      ageProof.printProofInfo(proof);

      // 증명 검증
      console.log("🔍 증명 검증 중...");
      const isValid = ageProof.verifyAgeProof(proof);
      console.log("✅ 증명 유효성:", isValid ? "유효함" : "무효함");

      // 나이 부족한 경우 테스트
      console.log("\n📝 16세 사용자의 18세 이상 증명 시도...");
      try {
        ageProof.generateAgeProof(2007, 18);
      } catch (error) {
        console.log("❌ 예상된 오류:", error.message);
      }

      // 다양한 나이 테스트
      console.log("\n📝 다양한 나이 테스트...");
      const testCases = [
        { birthYear: 1990, minimumAge: 20 }, // 33세, 20세 이상 ✓
        { birthYear: 2005, minimumAge: 25 }, // 18세, 25세 이상 ✗
        { birthYear: 1985, minimumAge: 30 }, // 38세, 30세 이상 ✓
      ];

      testCases.forEach((testCase, index) => {
        console.log(
          `\n테스트 케이스 ${index + 1}: ${testCase.birthYear}년생, ${
            testCase.minimumAge
          }세 이상`
        );
        try {
          const testProof = ageProof.generateAgeProof(
            testCase.birthYear,
            testCase.minimumAge
          );
          const testValid = ageProof.verifyAgeProof(testProof);
          console.log(`✅ 결과: ${testValid ? "성공" : "실패"}`);
        } catch (error) {
          console.log(`❌ 결과: ${error.message}`);
        }
      });
    } catch (error) {
      console.error("❌ 나이 증명 시스템 오류:", error.message);
    }
  }
}

// 스크립트가 직접 실행될 때만 테스트 실행
if (require.main === module) {
  console.log("🚀 나이 증명 시스템 테스트 실행\n");
  AgeProofSystem.runTest();
}

module.exports = AgeProofSystem;

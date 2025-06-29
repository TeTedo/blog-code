# ZK(Zero-Knowledge Proof)란 무엇인가?

모든 코드는 [깃허브](https://github.com/TeTedo/blog-code/tree/main/zk-zero-knowledge-proof)에서 볼 수 있습니다.

## 서론

최근 블록체인과 암호화폐 분야에서 자주 언급되는 **Zero-Knowledge Proof**에 대해 알아보려고 한다.

ZK는 개인정보를 노출하지 않으면서도 특정 사실을 증명할 수 있는 혁신적인 암호학 기술이다. 이 글에서는 ZK의 기본 개념부터 실제 활용 사례까지 자세히 살펴보겠다.

## 1. ZK(Zero-Knowledge Proof)란?

### 1.1 기본 개념

**Zero-Knowledge Proof**는 증명자(Prover)가 검증자(Verifier)에게 자신이 특정 정보를 알고 있다는 것을 증명할 때, **실제 정보를 노출하지 않고도** 증명할 수 있는 암호학적 방법이다.

### 1.2 ZK의 핵심 특징

ZK는 다음 세 가지 조건을 만족해야 한다:

1. **완전성(Completeness)**: 정직한 증명자는 정직한 검증자를 항상 설득할 수 있다.
2. **건전성(Soundness)**: 부정직한 증명자는 정직한 검증자를 거의 설득할 수 없다.
3. **영지식성(Zero-Knowledge)**: 검증자는 증명 과정에서 증명자가 알고 있는 정보 외의 다른 정보를 얻을 수 없다.

## 2. ZK의 동작 원리

### 2.1 간단한 예시: 동굴 비유

가장 유명한 ZK 예시는 **알리바바 동굴** 비유이다.

```
동굴 안에 비밀 문이 있고, 이 문을 열려면 마법의 주문을 알아야 한다.
앨리스는 이 주문을 알고 있고, 밥에게 자신이 주문을 알고 있다는 것을 증명하고 싶다.
하지만 밥에게 주문을 알려주고 싶지는 않다.
```

**해결 방법:**

1. 밥이 동굴 입구에서 기다린다
2. 알리스는 동굴 안으로 들어간다
3. 밥이 알리스에게 왼쪽 또는 오른쪽 출구로 나오라고 말한다
4. 알리스는 주문을 사용해 비밀 문을 통해 요청된 출구로 나온다
5. 이 과정을 여러 번 반복한다

이 과정을 통해 알리스는 주문을 알지 못하는 밥에게도 자신이 주문을 알고 있다는 것을 증명할 수 있다.

### 2.2 수학적 기반

ZK는 주로 다음과 같은 수학적 문제들을 기반으로 한다:

- **이산로그 문제**: g^x mod p에서 x를 찾는 문제
- **타원곡선 암호**: ECDSA, Ed25519 등
- **해시 함수**: SHA-256, Keccak 등

## 3. ZK의 종류

### 3.1 Interactive ZK (IZK)

증명자와 검증자가 실시간으로 상호작용하며 증명을 수행한다.

**장점:**

- 구현이 비교적 간단
- 계산량이 적음

**단점:**

- 실시간 상호작용 필요
- 오프라인에서 사용하기 어려움

### 3.2 Non-Interactive ZK (NIZK)

증명자가 검증자와 상호작용 없이 증명을 생성할 수 있다.

**장점:**

- 비대화형으로 사용 가능
- 증명을 저장하고 나중에 검증 가능

**단점:**

- 구현이 복잡
- 계산량이 많음

### 3.3 zk-SNARK

zk-SNARK(Zero-Knowledge Succinct Non-Interactive Argument of Knowledge)는 가장 널리 사용되는 ZK 기술 중 하나이다.

**특징:**

- 매우 작은 증명 크기 (수백 바이트)
- 빠른 검증 시간
- 신뢰 설정(Trusted Setup) 필요

### 3.4 zk-STARK

zk-STARK(Zero-Knowledge Scalable Transparent Argument of Knowledge)는 zk-SNARK의 개선된 버전이다.

**특징:**

- 신뢰 설정 불필요
- 양자 컴퓨터에 대한 저항성
- 더 큰 증명 크기

## 4. ZK의 실제 활용 사례

### 4.1 블록체인과 암호화폐

#### 4.1.1 Zcash

- **목적**: 거래의 프라이버시 보호
- **기술**: zk-SNARK
- **특징**: 송신자, 수신자, 거래 금액을 숨기면서도 거래의 유효성 증명

#### 4.1.2 Ethereum Layer 2 (zkRollup)

- **목적**: 확장성 향상
- **기술**: zk-SNARK/zk-STARK
- **특징**: 여러 거래를 묶어서 메인넷에 증명만 제출

### 4.2 디지털 신원증명

#### 4.2.1 나이 증명

```
사용자가 18세 이상임을 증명하고 싶다.
하지만 정확한 생년월일은 공개하고 싶지 않다.
```

**ZK 솔루션:**

- 생년월일을 해시하여 저장
- 18세 이상 여부만 증명
- 실제 나이는 노출하지 않음

#### 4.2.2 소득 증명

```
대출 신청 시 소득이 충분함을 증명하고 싶다.
하지만 정확한 소득 금액은 공개하고 싶지 않다.
```

**ZK 솔루션:**

- 소득이 특정 금액 이상임만 증명
- 실제 소득 금액은 노출하지 않음

### 4.3 기업 보안

#### 4.3.1 내부자 거래 방지

- 직원이 회사 정보를 가지고 있음을 증명
- 실제 정보 내용은 노출하지 않음

#### 4.3.2 규정 준수

- 특정 규정을 준수하고 있음을 증명
- 민감한 비즈니스 정보는 노출하지 않음

## 5. ZK 구현 예제

### 5.1 간단한 나이 증명 시스템

```javascript
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
```

### 실행 결과 예시

```
🚀 나이 증명 시스템 테스트 실행

1️⃣ 나이 증명 시스템 테스트
📝 25세 사용자의 18세 이상 증명 생성 중...
=== 나이 증명 정보 ===
나이 해시: d54123de468bd42ea00dafbd777f85fe5fa1ff6404d9838c007953c25c92a1c5
최소 나이: 18
증명 데이터: b50c3f4604cf7915...
생성 시간: 2025. 6. 29. 오후 5:29:09
========================
🔍 증명 검증 중...
✅ 증명 유효성: 유효함

📝 16세 사용자의 18세 이상 증명 시도...

📝 다양한 나이 테스트...

테스트 케이스 1: 1990년생, 20세 이상
✅ 결과: 성공

테스트 케이스 2: 2005년생, 25세 이상
❌ 결과: 나이가 부족합니다. 현재 나이: 20세, 필요 나이: 25세

테스트 케이스 3: 1985년생, 30세 이상
✅ 결과: 성공
```

### 5.2 블록체인 거래 프라이버시 예제

```javascript
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
```

### 실행 결과

```
🚀 프라이빗 거래 시스템 테스트 실행

2️⃣ 프라이빗 거래 시스템 테스트
📝 프라이빗 거래 생성 중...
=== 프라이빗 거래 정보 ===
거래 ID: 1c21791ead9ff65afee133da34815434
거래 타입: private
생성 시간: 2025. 6. 29. 오후 5:32:25
증명 해시: 479f9a4f092319d7...
공개 입력: {
  transactionHash: '8541ac38646cb05b46a581e9e83e4dcd3f5cfac7ba75a0f51966964f96a72dbb',
  amountRange: 'positive',
  amountValid: true
}
==========================
🔍 거래 검증 중...
✅ 거래 유효성: 유효함

📝 잘못된 금액(-50)으로 거래 시도...
❌ 예상된 오류: 거래 금액은 0보다 커야 합니다.

📝 다양한 거래 테스트...

테스트 케이스 1: 정상 거래 (500)
✅ 결과: 성공
   거래 ID: 690a3a1998786058665a1a1cdc6f35e3

테스트 케이스 2: 0원 거래 (실패 예상)
❌ 결과: 거래 금액은 0보다 커야 합니다.

테스트 케이스 3: 대금액 거래 (1000)
✅ 결과: 성공
   거래 ID: 3ab5087139aa0c940ae4ec1f6f501447

📝 거래 해시 비교 테스트...
같은 거래 해시 비교: 일치
다른 거래 해시 비교: 불일치
```

## 6. ZK의 장단점

### 6.1 장점

1. **프라이버시 보호**: 민감한 정보를 노출하지 않고 증명 가능
2. **보안성**: 암호학적으로 안전한 증명
3. **확장성**: 블록체인에서 확장성 문제 해결
4. **규정 준수**: 개인정보보호법 등 규정 준수 가능

### 6.2 단점

1. **복잡성**: 구현이 매우 복잡하고 어려움
2. **계산 비용**: 증명 생성에 많은 계산 자원 필요
3. **신뢰 설정**: 일부 ZK 기술은 신뢰 설정 필요
4. **검증 비용**: 증명 검증에도 일정한 비용 발생

## 7. ZK의 미래

### 7.1 기술 발전 방향

1. **성능 개선**: 더 빠른 증명 생성과 검증
2. **표준화**: ZK 기술의 표준화 및 상호운용성
3. **도구 개선**: 개발자 친화적인 도구와 라이브러리
4. **새로운 응용**: AI, IoT 등 새로운 분야로 확장

### 7.2 예상 활용 분야

1. **의료**: 환자 정보 보호하면서 의료 서비스 제공
2. **금융**: KYC/AML 규정 준수하면서 프라이버시 보호
3. **투표**: 투표 결과 검증하면서 개인 투표 내용 보호
4. **AI**: 모델 학습 데이터 보호하면서 AI 서비스 제공

## 8. 결론

ZK는 개인정보 보호와 디지털 신원증명의 새로운 패러다임을 제시하는 혁신적인 기술이다. 블록체인, 금융, 의료 등 다양한 분야에서 활용될 수 있으며, 특히 개인정보보호가 중요한 현대 사회에서 매우 중요한 역할을 할 것으로 예상된다.

하지만 ZK 기술은 아직 발전 단계에 있으며, 구현의 복잡성과 성능 문제 등 해결해야 할 과제들이 많다. 앞으로 기술 발전과 함께 더욱 실용적이고 접근하기 쉬운 ZK 솔루션들이 등장할 것으로 기대된다.

## 참고 자료

- [Zero-Knowledge Proofs: An illustrated primer](https://blog.cryptographyengineering.com/2014/11/27/zero-knowledge-proofs-illustrated-primer/)
- [zk-SNARKs: Under the Hood](https://medium.com/@VitalikButerin/zk-snarks-under-the-hood-b33151a013f6)
- [Zcash Protocol Specification](https://zips.z.cash/protocol/protocol.pdf)
- [Ethereum Layer 2 Scaling](https://ethereum.org/en/layer-2/)

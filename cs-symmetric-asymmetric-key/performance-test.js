const crypto = require("crypto");
const HybridEncryptionExample = require("./hybrid-encryption");

class PerformanceTest {
  static main() {
    console.log("🚀 암호화 성능 비교 테스트\n");

    // 테스트 데이터
    const testData = "이것은 성능 테스트를 위한 데이터입니다. ".repeat(1000); // 약 50KB
    const smallData = "작은 데이터"; // RSA 테스트용

    console.log("테스트 데이터 크기:", testData.length, "바이트");
    console.log("작은 데이터 크기:", smallData.length, "바이트\n");

    // 1. 대칭키 성능 테스트 (GCM 모드)
    this.testSymmetricEncryption(testData);

    // 2. 비대칭키 성능 테스트 (RSA)
    this.testAsymmetricEncryption(smallData);

    // 3. 하이브리드 암호화 성능 테스트
    this.testHybridEncryption(testData);

    // 4. 종합 비교
    this.comprehensiveComparison(testData, smallData);
  }

  static testSymmetricEncryption(testData) {
    console.log("=== 대칭키 암호화 성능 테스트 (AES-256-GCM) ===");

    const symmetricKey = crypto.randomBytes(32);
    const iterations = 100;

    const start = Date.now();
    for (let i = 0; i < iterations; i++) {
      const nonce = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv("aes-256-gcm", symmetricKey, nonce);
      let encrypted = cipher.update(testData, "utf8", "hex");
      encrypted += cipher.final("hex");
      const authTag = cipher.getAuthTag();

      const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        symmetricKey,
        nonce
      );
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");
    }
    const time = Date.now() - start;

    console.log(`총 시간: ${time}ms`);
    console.log(`평균 시간: ${(time / iterations).toFixed(2)}ms`);
    console.log(
      `처리량: ${(
        (testData.length * iterations) /
        (time / 1000) /
        1024 /
        1024
      ).toFixed(2)} MB/s\n`
    );
  }

  static testAsymmetricEncryption(smallData) {
    console.log("=== 비대칭키 암호화 성능 테스트 (RSA-2048) ===");

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    const iterations = 10; // RSA는 느리므로 적은 횟수

    const start = Date.now();
    for (let i = 0; i < iterations; i++) {
      const encrypted = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(smallData, "utf8")
      );

      const decrypted = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        encrypted
      );
    }
    const time = Date.now() - start;

    console.log(`총 시간: ${time}ms`);
    console.log(`평균 시간: ${(time / iterations).toFixed(2)}ms`);
    console.log(
      `처리량: ${(
        (smallData.length * iterations) /
        (time / 1000) /
        1024
      ).toFixed(2)} KB/s\n`
    );
  }

  static testHybridEncryption(testData) {
    console.log("=== 하이브리드 암호화 성능 테스트 (RSA + AES-GCM) ===");

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    const iterations = 10;

    const start = Date.now();
    for (let i = 0; i < iterations; i++) {
      const hybridEncrypted = HybridEncryptionExample.hybridEncrypt(
        testData,
        publicKey
      );
      const hybridDecrypted = HybridEncryptionExample.hybridDecrypt(
        hybridEncrypted,
        privateKey
      );
    }
    const time = Date.now() - start;

    console.log(`총 시간: ${time}ms`);
    console.log(`평균 시간: ${(time / iterations).toFixed(2)}ms`);
    console.log(
      `처리량: ${(
        (testData.length * iterations) /
        (time / 1000) /
        1024 /
        1024
      ).toFixed(2)} MB/s\n`
    );
  }

  static comprehensiveComparison(testData, smallData) {
    console.log("=== 종합 성능 비교 ===");

    // 대칭키 테스트
    const symmetricKey = crypto.randomBytes(32);
    const symmetricStart = Date.now();
    for (let i = 0; i < 100; i++) {
      const nonce = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv("aes-256-gcm", symmetricKey, nonce);
      let encrypted = cipher.update(testData, "utf8", "hex");
      encrypted += cipher.final("hex");
      const authTag = cipher.getAuthTag();

      const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        symmetricKey,
        nonce
      );
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");
    }
    const symmetricTime = Date.now() - symmetricStart;

    // 비대칭키 테스트 (작은 데이터)
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    const asymmetricStart = Date.now();
    for (let i = 0; i < 10; i++) {
      const encrypted = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(smallData, "utf8")
      );

      const decrypted = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        encrypted
      );
    }
    const asymmetricTime = Date.now() - asymmetricStart;

    // 하이브리드 테스트 (같은 작은 데이터로 비교)
    const hybridStart = Date.now();
    for (let i = 0; i < 10; i++) {
      const hybridEncrypted = HybridEncryptionExample.hybridEncrypt(
        smallData, // 같은 작은 데이터로 테스트
        publicKey
      );
      const hybridDecrypted = HybridEncryptionExample.hybridDecrypt(
        hybridEncrypted,
        privateKey
      );
    }
    const hybridTime = Date.now() - hybridStart;

    // 하이브리드 대용량 데이터 테스트
    const hybridLargeStart = Date.now();
    for (let i = 0; i < 10; i++) {
      const hybridLargeEncrypted = HybridEncryptionExample.hybridEncrypt(
        testData, // 큰 데이터
        publicKey
      );
      const hybridLargeDecrypted = HybridEncryptionExample.hybridDecrypt(
        hybridLargeEncrypted,
        privateKey
      );
    }
    const hybridLargeTime = Date.now() - hybridLargeStart;

    console.log("📊 성능 비교 결과:");
    console.log(`대칭키 암호화 (GCM, 100회): ${symmetricTime}ms`);
    console.log(
      `비대칭키 암호화 (RSA, 10회, ${smallData.length}바이트): ${asymmetricTime}ms`
    );
    console.log(
      `하이브리드 암호화 (10회, ${smallData.length}바이트): ${hybridTime}ms`
    );
    console.log(
      `하이브리드 암호화 (10회, ${testData.length}바이트): ${hybridLargeTime}ms\n`
    );

    const symmetricAvg = symmetricTime / 100;
    const asymmetricAvg = asymmetricTime / 10;
    const hybridAvg = hybridTime / 10;
    const hybridLargeAvg = hybridLargeTime / 10;

    console.log("📈 평균 처리 시간:");
    console.log(`대칭키: ${symmetricAvg.toFixed(2)}ms`);
    console.log(
      `비대칭키 (${smallData.length}바이트): ${asymmetricAvg.toFixed(2)}ms`
    );
    console.log(
      `하이브리드 (${smallData.length}바이트): ${hybridAvg.toFixed(2)}ms`
    );
    console.log(
      `하이브리드 (${testData.length}바이트): ${hybridLargeAvg.toFixed(2)}ms\n`
    );

    console.log("⚡ 성능 비율:");
    console.log(
      `대칭키가 비대칭키보다 약 ${Math.round(
        asymmetricAvg / symmetricAvg
      )}배 빠름`
    );
    console.log(
      `하이브리드가 순수 RSA보다 약 ${(asymmetricAvg / hybridAvg).toFixed(
        1
      )}배 빠름 (같은 데이터 크기)`
    );
    console.log(
      `하이브리드가 순수 RSA보다 약 ${(asymmetricAvg / hybridLargeAvg).toFixed(
        1
      )}배 빠름 (대용량 데이터)`
    );

    console.log("\n💡 결론:");
    console.log("• 대칭키: 가장 빠르지만 키 분배 문제");
    console.log("• 비대칭키: 안전하지만 매우 느림 (데이터 크기 제한)");
    console.log(
      "• 하이브리드: 안전성 + 성능의 최적 조합 (대용량 데이터 처리 가능)"
    );
    console.log("→ 실무에서는 하이브리드 방식이 표준!");
    console.log("→ RSA는 키 교환용, AES는 데이터 암호화용으로 분담!");
  }

  // 메모리 사용량 테스트
  static memoryUsageTest() {
    console.log("\n=== 메모리 사용량 테스트 ===");

    const testData = "A".repeat(1024 * 1024); // 1MB

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    const startMemory = process.memoryUsage();

    // 하이브리드 암호화
    const encrypted = HybridEncryptionExample.hybridEncrypt(
      testData,
      publicKey
    );
    const decrypted = HybridEncryptionExample.hybridDecrypt(
      encrypted,
      privateKey
    );

    const endMemory = process.memoryUsage();

    console.log("메모리 사용량 변화:");
    console.log(
      `RSS: ${((endMemory.rss - startMemory.rss) / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(
      `Heap Used: ${(
        (endMemory.heapUsed - startMemory.heapUsed) /
        1024 /
        1024
      ).toFixed(2)} MB`
    );
  }
}

// 실행
if (require.main === module) {
  PerformanceTest.main();

  // 메모리 사용량 테스트도 실행
  PerformanceTest.memoryUsageTest();
}

module.exports = PerformanceTest;

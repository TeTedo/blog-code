const crypto = require("crypto");

class HybridEncryptionExample {
  static main() {
    console.log("=== 하이브리드 암호화 예제 ===");

    // 대용량 데이터 시뮬레이션
    const largeData =
      "이것은 대용량 데이터를 시뮬레이션하기 위한 긴 텍스트입니다. " +
      "실제로는 파일이나 데이터베이스의 대용량 데이터를 암호화할 때 " +
      "비대칭키만 사용하면 매우 느리기 때문에 하이브리드 방식을 사용합니다. " +
      "대칭키로 데이터를 암호화하고, 비대칭키로 대칭키를 암호화하는 방식입니다.";

    // RSA 키쌍 생성
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    console.log("원본 데이터 길이:", largeData.length, "바이트");
    console.log("공개키 길이:", publicKey.length, "바이트");
    console.log("개인키 길이:", privateKey.length, "바이트");

    // 하이브리드 암호화 (GCM 모드 사용)
    const encryptedPackage = this.hybridEncrypt(largeData, publicKey);
    console.log("\n하이브리드 암호화 결과:");
    console.log(
      "- 암호화된 데이터 길이:",
      encryptedPackage.encryptedData.length,
      "바이트"
    );
    console.log(
      "- 암호화된 키 길이:",
      encryptedPackage.encryptedKey.length,
      "바이트"
    );
    console.log("- Nonce:", encryptedPackage.nonce);

    // 하이브리드 복호화
    const decryptedData = this.hybridDecrypt(encryptedPackage, privateKey);
    console.log("\n하이브리드 복호화 결과:", decryptedData);
    console.log("하이브리드 암호화/복호화 성공:", largeData === decryptedData);

    // 성능 비교 시연
    this.performanceComparison(largeData, publicKey, privateKey);
  }

  // 하이브리드 암호화 (대칭키 + 비대칭키)
  static hybridEncrypt(largeData, publicKey) {
    // 1. 대칭키 생성 (AES-256)
    const symmetricKey = crypto.randomBytes(32);
    const nonce = crypto.randomBytes(12);

    // 2. 대용량 데이터를 대칭키로 암호화 (GCM 모드)
    const cipher = crypto.createCipheriv("aes-256-gcm", symmetricKey, nonce);
    let encryptedData = cipher.update(largeData, "utf8", "hex");
    encryptedData += cipher.final("hex");
    const authTag = cipher.getAuthTag();

    // 3. 대칭키를 공개키로 암호화
    const encryptedKey = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      symmetricKey
    );

    return {
      encryptedData: encryptedData,
      encryptedKey: encryptedKey.toString("base64"),
      nonce: nonce.toString("hex"),
      authTag: authTag.toString("hex"),
    };
  }

  static hybridDecrypt(encryptedPackage, privateKey) {
    // 1. 개인키로 대칭키 복호화
    const symmetricKey = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(encryptedPackage.encryptedKey, "base64")
    );

    // 2. 대칭키로 데이터 복호화 (GCM 모드)
    const nonce = Buffer.from(encryptedPackage.nonce, "hex");
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      symmetricKey,
      nonce
    );
    decipher.setAuthTag(Buffer.from(encryptedPackage.authTag, "hex"));

    let decryptedData = decipher.update(
      encryptedPackage.encryptedData,
      "hex",
      "utf8"
    );
    decryptedData += decipher.final("utf8");

    return decryptedData;
  }

  // 성능 비교: 순수 RSA vs 하이브리드
  static performanceComparison(data, publicKey, privateKey) {
    console.log("\n=== 성능 비교: 순수 RSA vs 하이브리드 ===");

    const testData = data.substring(0, 100); // 100바이트로 제한 (RSA 제한)

    // 순수 RSA 암호화 시간 측정
    const rsaStart = Date.now();
    try {
      const rsaEncrypted = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(testData, "utf8")
      );
      const rsaDecrypted = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        rsaEncrypted
      );
      const rsaTime = Date.now() - rsaStart;
      console.log(`순수 RSA (${testData.length}바이트): ${rsaTime}ms`);
    } catch (e) {
      console.log("순수 RSA 실패 (데이터가 너무 큼):", e.message);
    }

    // 하이브리드 암호화 시간 측정
    const hybridStart = Date.now();
    const hybridEncrypted = this.hybridEncrypt(data, publicKey);
    const hybridDecrypted = this.hybridDecrypt(hybridEncrypted, privateKey);
    const hybridTime = Date.now() - hybridStart;
    console.log(`하이브리드 (${data.length}바이트): ${hybridTime}ms`);

    console.log("하이브리드가 훨씬 빠르고 대용량 데이터도 처리 가능!");
  }

  // 파일 암호화 시뮬레이션
  static simulateFileEncryption() {
    console.log("\n=== 파일 암호화 시뮬레이션 ===");

    // 가상의 파일 데이터 (1MB)
    const fileData = "A".repeat(1024 * 1024); // 1MB

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    console.log("파일 크기:", fileData.length, "바이트 (1MB)");

    const start = Date.now();
    const encrypted = this.hybridEncrypt(fileData, publicKey);
    const decrypted = this.hybridDecrypt(encrypted, privateKey);
    const time = Date.now() - start;

    console.log(`1MB 파일 암호화/복호화 시간: ${time}ms`);
    console.log("파일 무결성 검증:", fileData === decrypted ? "성공" : "실패");
  }
}

// 실행
if (require.main === module) {
  HybridEncryptionExample.main();

  // 파일 암호화 시뮬레이션도 실행
  HybridEncryptionExample.simulateFileEncryption();
}

module.exports = HybridEncryptionExample;

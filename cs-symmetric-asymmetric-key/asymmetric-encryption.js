const crypto = require("crypto");

class AsymmetricEncryptionExample {
  static main() {
    const plainText = "안녕하세요! 이것은 비대칭키 암호화 테스트입니다.";

    // RSA 키쌍 생성
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    console.log("=== 비대칭키 암호화 예제 ===");
    console.log("평문:", plainText);
    console.log("공개키 길이:", publicKey.length, "바이트");
    console.log("개인키 길이:", privateKey.length, "바이트");

    // 공개키로 암호화
    const encryptedText = this.encrypt(plainText, publicKey);
    console.log("암호화된 텍스트:", encryptedText);

    // 개인키로 복호화
    const decryptedText = this.decrypt(encryptedText, privateKey);
    console.log("복호화된 텍스트:", decryptedText);

    // 검증
    console.log("암호화/복호화 성공:", plainText === decryptedText);

    // RSA 제한사항 시연
    this.demonstrateRSALimitations(publicKey, privateKey);
  }

  static encrypt(plainText, publicKey) {
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(plainText, "utf8")
    );
    return encrypted.toString("base64");
  }

  static decrypt(encryptedText, privateKey) {
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(encryptedText, "base64")
    );
    return decrypted.toString("utf8");
  }

  // RSA 제한사항 시연
  static demonstrateRSALimitations(publicKey, privateKey) {
    console.log("\n=== RSA 제한사항 시연 ===");

    // RSA는 키 크기에 따라 암호화할 수 있는 데이터 크기가 제한됨
    // 2048비트 RSA의 경우 약 190바이트 정도만 암호화 가능

    const shortText = "짧은 텍스트";
    const longText = "A".repeat(300); // 300바이트 (RSA 제한 초과)

    console.log("짧은 텍스트 길이:", shortText.length, "바이트");
    console.log("긴 텍스트 길이:", longText.length, "바이트");

    // 짧은 텍스트는 성공
    try {
      const encryptedShort = this.encrypt(shortText, publicKey);
      const decryptedShort = this.decrypt(encryptedShort, privateKey);
      console.log(
        "짧은 텍스트 암호화/복호화:",
        shortText === decryptedShort ? "성공" : "실패"
      );
    } catch (e) {
      console.log("짧은 텍스트 실패:", e.message);
    }

    // 긴 텍스트는 실패
    try {
      const encryptedLong = this.encrypt(longText, publicKey);
      console.log("긴 텍스트 암호화 성공");
    } catch (e) {
      console.log("긴 텍스트 암호화 실패:", e.message);
      console.log("→ 이것이 하이브리드 암호화가 필요한 이유입니다!");
    }
  }
}

// 실행
if (require.main === module) {
  AsymmetricEncryptionExample.main();
}

module.exports = AsymmetricEncryptionExample;

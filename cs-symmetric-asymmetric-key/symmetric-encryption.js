const crypto = require("crypto");

class SymmetricEncryptionExample {
  static main() {
    const plainText = "안녕하세요! 이것은 대칭키 암호화 테스트입니다.";

    // AES-256 키 생성 (32바이트)
    const secretKey = crypto.randomBytes(32);

    console.log("=== 대칭키 암호화 예제 (GCM 모드) ===");
    console.log("평문:", plainText);
    console.log("키 길이:", secretKey.length * 8, "비트");

    // GCM 암호화 (권장)
    const encryptedData = this.encrypt(plainText, secretKey);
    console.log("GCM 암호화된 데이터:", encryptedData);

    // GCM 복호화
    const decryptedText = this.decrypt(encryptedData, secretKey);
    console.log("GCM 복호화된 텍스트:", decryptedText);

    // 검증
    console.log("GCM 암호화/복호화 성공:", plainText === decryptedText);

    // GCM 인증 태그 변조 시도 (무결성 검증 실패 예시)
    console.log("\n=== GCM 인증 태그 변조 시도 (실패 예시) ===");
    try {
      const tampered = {
        ...encryptedData,
        authTag: "00000000000000000000000000000000",
      };
      this.decrypt(tampered, secretKey);
    } catch (e) {
      console.log("GCM 인증 태그 검증 실패! 예외 발생:", e.message);
    }

    // Nonce의 중요성 시연
    this.demonstrateNonceImportance(plainText, secretKey);
  }

  static encrypt(plainText, secretKey) {
    // Nonce 생성 (12바이트) - GCM은 12바이트 nonce 권장
    // Nonce는 암호화할 때마다 새로 생성되어야 하며, 복호화할 때도 필요함
    const nonce = crypto.randomBytes(12);

    // AES-256-GCM 모드로 암호화 (권장)
    const cipher = crypto.createCipheriv("aes-256-gcm", secretKey, nonce);

    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");

    // 인증 태그 생성 (무결성 검증용)
    const authTag = cipher.getAuthTag();

    // Nonce, 암호문, 인증 태그를 함께 반환 (복호화 시 모두 필요함)
    return {
      nonce: nonce.toString("hex"),
      encrypted: encrypted,
      authTag: authTag.toString("hex"),
    };
  }

  static decrypt(encryptedData, secretKey) {
    // Nonce를 Buffer로 변환
    const nonce = Buffer.from(encryptedData.nonce, "hex");

    // AES-256-GCM 모드로 복호화
    const decipher = crypto.createDecipheriv("aes-256-gcm", secretKey, nonce);

    // 인증 태그 설정 (무결성 검증)
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, "hex"));

    let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }

  // Nonce의 중요성을 시연하는 함수
  static demonstrateNonceImportance(plainText, secretKey) {
    console.log("\n=== Nonce의 중요성 시연 ===");

    // 같은 평문을 여러 번 암호화
    const encrypted1 = this.encrypt(plainText, secretKey);
    const encrypted2 = this.encrypt(plainText, secretKey);
    const encrypted3 = this.encrypt(plainText, secretKey);

    console.log("같은 평문을 3번 암호화한 결과:");
    console.log("1번째 암호문:", encrypted1.encrypted.substring(0, 32) + "...");
    console.log("2번째 암호문:", encrypted2.encrypted.substring(0, 32) + "...");
    console.log("3번째 암호문:", encrypted3.encrypted.substring(0, 32) + "...");

    console.log(
      "모든 암호문이 다른가?",
      encrypted1.encrypted !== encrypted2.encrypted &&
        encrypted2.encrypted !== encrypted3.encrypted &&
        encrypted1.encrypted !== encrypted3.encrypted
    );

    // 복호화 검증
    const decrypted1 = this.decrypt(encrypted1, secretKey);
    const decrypted2 = this.decrypt(encrypted2, secretKey);
    const decrypted3 = this.decrypt(encrypted3, secretKey);

    console.log(
      "모든 복호화가 성공했는가?",
      decrypted1 === plainText &&
        decrypted2 === plainText &&
        decrypted3 === plainText
    );
  }
}

// 실행
if (require.main === module) {
  SymmetricEncryptionExample.main();
}

module.exports = SymmetricEncryptionExample;

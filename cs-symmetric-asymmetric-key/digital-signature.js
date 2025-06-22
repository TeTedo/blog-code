const crypto = require("crypto");

class DigitalSignatureExample {
  static main() {
    const message = "이 문서는 디지털 서명이 적용되었습니다.";

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

    console.log("=== 디지털 서명 예제 ===");
    console.log("원본 메시지:", message);

    // 개인키로 서명
    const signature = this.sign(message, privateKey);
    console.log("서명:", signature);

    // 공개키로 서명 검증
    const isValid = this.verify(message, signature, publicKey);
    console.log("서명 검증 결과:", isValid);

    // 메시지가 변경된 경우 검증
    const modifiedMessage = "이 문서는 디지털 서명이 적용되었습니다. (수정됨)";
    const isModifiedValid = this.verify(modifiedMessage, signature, publicKey);
    console.log("수정된 메시지 검증 결과:", isModifiedValid);
  }

  static sign(message, privateKey) {
    const sign = crypto.createSign("SHA256");
    sign.update(message);
    sign.end();

    const signature = sign.sign(privateKey, "base64");
    return signature;
  }

  static verify(message, signature, publicKey) {
    const verify = crypto.createVerify("SHA256");
    verify.update(message);
    verify.end();

    return verify.verify(publicKey, signature, "base64");
  }

  // 파일 서명 예제
  static signFile(filePath, privateKey) {
    const fs = require("fs");
    const fileBuffer = fs.readFileSync(filePath);

    const sign = crypto.createSign("SHA256");
    sign.update(fileBuffer);
    sign.end();

    const signature = sign.sign(privateKey, "base64");
    return signature;
  }

  static verifyFile(filePath, signature, publicKey) {
    const fs = require("fs");
    const fileBuffer = fs.readFileSync(filePath);

    const verify = crypto.createVerify("SHA256");
    verify.update(fileBuffer);
    verify.end();

    return verify.verify(publicKey, signature, "base64");
  }

  // 타임스탬프가 포함된 서명
  static signWithTimestamp(message, privateKey) {
    const timestamp = Date.now();
    const messageWithTimestamp = `${message}\nTimestamp: ${timestamp}`;

    const signature = this.sign(messageWithTimestamp, privateKey);

    return {
      message: message,
      timestamp: timestamp,
      signature: signature,
    };
  }

  static verifyWithTimestamp(signedData, publicKey, maxAge = 300000) {
    // 기본 5분
    const currentTime = Date.now();
    const age = currentTime - signedData.timestamp;

    if (age > maxAge) {
      console.log("서명이 만료되었습니다. (경과 시간:", age, "ms)");
      return false;
    }

    const messageWithTimestamp = `${signedData.message}\nTimestamp: ${signedData.timestamp}`;
    return this.verify(messageWithTimestamp, signedData.signature, publicKey);
  }
}

// 실행
if (require.main === module) {
  DigitalSignatureExample.main();

  console.log("\n=== 타임스탬프가 포함된 서명 예제 ===");
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  const message = "이 문서는 타임스탬프가 포함된 디지털 서명이 적용되었습니다.";
  const signedData = DigitalSignatureExample.signWithTimestamp(
    message,
    privateKey
  );
  console.log("타임스탬프 서명 결과:", signedData);

  const isValid = DigitalSignatureExample.verifyWithTimestamp(
    signedData,
    publicKey
  );
  console.log("타임스탬프 서명 검증 결과:", isValid);

  // 만료된 서명 시뮬레이션
  const expiredSignedData = {
    message: "만료된 서명",
    timestamp: Date.now() - 600000, // 10분 전
    signature: signedData.signature,
  };

  const isExpiredValid = DigitalSignatureExample.verifyWithTimestamp(
    expiredSignedData,
    publicKey
  );
  console.log("만료된 서명 검증 결과:", isExpiredValid);
}

module.exports = DigitalSignatureExample;

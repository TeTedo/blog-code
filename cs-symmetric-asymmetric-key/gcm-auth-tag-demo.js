const crypto = require("crypto");

// GCM 인증 태그 변조 시 복호화 실패 예제
function gcmAuthTagTamperDemo() {
  const secretKey = crypto.randomBytes(32);
  const nonce = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", secretKey, nonce);
  let encrypted = cipher.update("hello", "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  console.log("정상 인증 태그:", authTag.toString("hex"));
  console.log("암호문:", encrypted);

  // 인증 태그를 일부러 변조
  const tamperedAuthTag = Buffer.from(
    "00000000000000000000000000000000",
    "hex"
  );
  const decipher = crypto.createDecipheriv("aes-256-gcm", secretKey, nonce);
  decipher.setAuthTag(tamperedAuthTag);
  try {
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    console.log("복호화 결과:", decrypted);
  } catch (e) {
    console.log("GCM 인증 태그 검증 실패! 예외 발생:", e.message);
  }
}

if (require.main === module) {
  gcmAuthTagTamperDemo();
}

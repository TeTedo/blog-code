const SymmetricEncryptionExample = require("./symmetric-encryption");
const AsymmetricEncryptionExample = require("./asymmetric-encryption");
const DigitalSignatureExample = require("./digital-signature");

console.log("🔐 대칭키 vs 비대칭키 암호화 예제 실행\n");

// 1. 대칭키 암호화 예제
console.log("1️⃣ 대칭키 암호화 예제");
SymmetricEncryptionExample.main();

console.log("\n" + "=".repeat(80) + "\n");

// 2. 비대칭키 암호화 예제
console.log("2️⃣ 비대칭키 암호화 예제");
AsymmetricEncryptionExample.main();

console.log("\n" + "=".repeat(80) + "\n");

// 3. 디지털 서명 예제
console.log("3️⃣ 디지털 서명 예제");
DigitalSignatureExample.main();

console.log("\n" + "=".repeat(80) + "\n");

// 4. 성능 비교 테스트
console.log("4️⃣ 성능 비교 테스트");
performanceTest();

function performanceTest() {
  const crypto = require("crypto");

  // 테스트 데이터
  const testData = "이것은 성능 테스트를 위한 데이터입니다. ".repeat(1000); // 약 50KB

  // 대칭키 성능 테스트
  const symmetricKey = crypto.randomBytes(32);

  const symmetricStart = Date.now();
  for (let i = 0; i < 100; i++) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", symmetricKey, iv);
    let encrypted = cipher.update(testData, "utf8", "hex");
    encrypted += cipher.final("hex");

    const decipher = crypto.createDecipheriv("aes-256-cbc", symmetricKey, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
  }
  const symmetricTime = Date.now() - symmetricStart;

  // 비대칭키 성능 테스트 (작은 데이터만)
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  const smallData = "작은 데이터";
  const asymmetricStart = Date.now();
  for (let i = 0; i < 10; i++) {
    const encrypted = crypto.publicEncrypt(
      { key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
      Buffer.from(smallData, "utf8")
    );

    const decrypted = crypto.privateDecrypt(
      { key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
      encrypted
    );
  }
  const asymmetricTime = Date.now() - asymmetricStart;

  console.log(`대칭키 암호화 (100회): ${symmetricTime}ms`);
  console.log(`비대칭키 암호화 (10회): ${asymmetricTime}ms`);
  console.log(
    `대칭키가 비대칭키보다 약 ${
      asymmetricTime / 10 / (symmetricTime / 100)
    }배 빠름`
  );
}

console.log("\n✅ 모든 예제 실행 완료!");

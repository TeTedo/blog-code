const SymmetricEncryptionExample = require("./symmetric-encryption");
const AsymmetricEncryptionExample = require("./asymmetric-encryption");
const DigitalSignatureExample = require("./digital-signature");
const HybridEncryptionExample = require("./hybrid-encryption");

console.log("🔐 대칭키 vs 비대칭키 암호화 예제 실행\n");

// 1. 대칭키 암호화 예제 (GCM 모드)
console.log("1️⃣ 대칭키 암호화 예제 (GCM 모드)");
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

// 4. 하이브리드 암호화 예제
console.log("4️⃣ 하이브리드 암호화 예제");
HybridEncryptionExample.main();

console.log("\n" + "=".repeat(80) + "\n");

console.log("✅ 모든 예제 실행 완료!");
console.log("\n💡 성능 비교 테스트를 원하시면 다음 명령어를 실행하세요:");
console.log("   npm run performance");

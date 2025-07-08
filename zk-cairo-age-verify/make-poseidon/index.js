const circomlib = require("circomlibjs");
const readline = require("readline");

// CLI 입력 받기용 설정
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Poseidon 해시 생성 함수
async function generateCommitment(age, nonce) {
  const poseidon = await circomlib.buildPoseidon();
  const hash = poseidon.F.toString(poseidon([BigInt(age), BigInt(nonce)]));
  return hash;
}

rl.question("Enter age: ", (ageInput) => {
  rl.question("Enter nonce: ", async (nonceInput) => {
    const age = parseInt(ageInput);
    const nonce = parseInt(nonceInput);

    if (isNaN(age) || isNaN(nonce)) {
      console.error("❌ Invalid input: age and nonce must be numbers.");
      rl.close();
      return;
    }

    const commitment = await generateCommitment(age, nonce);
    console.log(`✅ Poseidon Commitment: ${commitment}`);
    rl.close();
  });
});

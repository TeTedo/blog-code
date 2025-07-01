import { UltraHonkBackend } from "@aztec/bb.js";
import { Noir } from "@noir-lang/noir_js";
import circuit from "./circuit/target/circuit.json";

const show = (id, content) => {
  const container = document.getElementById(id);
  container.appendChild(document.createTextNode(content));
  container.appendChild(document.createElement("br"));
};

document.getElementById("submit").addEventListener("click", async () => {
  try {
    // 1. Noir 회로 및 증명 백엔드 초기화
    const noir = new Noir(circuit);
    const backend = new UltraHonkBackend(circuit.bytecode); // 회로의 바이트코드로 증명 백엔드 초기화

    // 2. 회로 실행을 위한 입력값 가져오기
    const age = document.getElementById("age").value;

    // 3. Witness 생성 (회로 실행)
    show("logs", "Generating witness... ⏳");
    // noir.execute()는 회로를 실행하여 모든 내부 계산 결과(witness)를 생성합니다.
    // 이 과정에서 age >= 18 조건이 만족하는지 확인됩니다.
    const { witness } = await noir.execute({ age });
    show("logs", "Generated witness... ✅");

    // 4. 증명 생성
    show("logs", "Generating proof... ⏳");
    // 생성된 witness를 사용하여 암호학적 증명(proof)을 생성합니다.
    // 이 proof는 age 값을 공개하지 않고도 age >= 18이 참임을 증명합니다.
    const proof = await backend.generateProof(witness);
    show("logs", "Generated proof... ✅");
    show("logs", "public inputs: " + proof.publicInputs);
    show("results", proof.proof);

    // 5. 증명 검증
    show("logs", "Verifying proof... ⌛");
    // 생성된 proof가 유효한지 검증합니다.
    // 검증자는 proof와 회로의 공개 정보(circuit.json)만으로 age 값을 알지 못한 채 증명의 유효성을 확인합니다.
    const isValid = await backend.verifyProof(proof);
    show("logs", `Proof is ${isValid ? "valid" : "invalid"}... ✅`);
  } catch (e) {
    show("logs", e);
    show("logs", "Oh 💔");
  }
});

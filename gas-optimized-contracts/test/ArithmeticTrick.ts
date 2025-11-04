import hre from "hardhat";
import { expect } from "chai";

describe("ArithmeticTrick", function () {
  it("should compare gas usage between bitwiseAdd and arithmeticAdd", async function () {
    const ArithmeticTrick = await hre.ethers.getContractFactory(
      "ArithmeticTrick"
    );
    const arithmeticTrick = await ArithmeticTrick.deploy();
    await arithmeticTrick.waitForDeployment();

    const bitwiseAddGas = await arithmeticTrick.bitwiseAdd.estimateGas(1);
    const arithmeticAddGas = await arithmeticTrick.arithmeticAdd.estimateGas(1);

    console.log(`bitwise add gas: ${bitwiseAddGas}`);
    console.log(`arithmetic add gas: ${arithmeticAddGas}`);
    expect(bitwiseAddGas).to.be.lessThan(arithmeticAddGas);
  });
});

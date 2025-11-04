import hre from "hardhat";
import { expect } from "chai";

describe("Calldata", function () {
  it("should compare gas usage between calldata and memory parameters", async function () {
    const Calldata = await hre.ethers.getContractFactory("Calldata");
    const calldata = await Calldata.deploy();
    await calldata.waitForDeployment();

    const calldataParameterGas = await calldata.calldataParameter.estimateGas([
      1, 2, 3,
    ]);
    const memoryParameterGas = await calldata.memoryParameter.estimateGas([
      1, 2, 3,
    ]);

    console.log(`calldata parameter gas: ${calldataParameterGas}`);
    console.log(`memory parameter gas: ${memoryParameterGas}`);
    expect(calldataParameterGas).to.be.lessThan(memoryParameterGas);
  });
});

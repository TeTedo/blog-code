import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";

describe("Comparison of Packed and NoPacked Variables", function () {
  async function deployContract() {
    const PackedVariables = await hre.ethers.getContractFactory(
      "PackedVariables"
    );
    const packedVariables = await PackedVariables.deploy();

    const NoPackedVariables = await hre.ethers.getContractFactory(
      "NoPackedVariables"
    );
    const noPackedVariables = await NoPackedVariables.deploy();

    return { packedVariables, noPackedVariables };
  }

  describe("Gas Comparison", function () {
    it("PackedVariables should use less gas than NoPackedVariables in readSum function", async function () {
      const { packedVariables, noPackedVariables } = await loadFixture(
        deployContract
      );

      const measureAverageGas = async (
        contract: any,
        functionName: string,
        times: number
      ) => {
        const gasPromises = [];
        for (let i = 0; i < times; i++) {
          gasPromises.push(contract[functionName].estimateGas());
        }
        const gasUsages = await Promise.all(gasPromises);
        return gasUsages.reduce((a, b) => a + Number(b), 0) / gasUsages.length;
      };

      const packedVariablesGas = await measureAverageGas(
        packedVariables,
        "readSum",
        10
      );

      const noPackedVariablesGas = await measureAverageGas(
        noPackedVariables,
        "readSum",
        10
      );

      console.log(`\n=== Gas Comparison (10 runs) ===`);
      console.log(
        `PackedVariables.readSum() average gas: ${packedVariablesGas.toFixed(
          0
        )}`
      );
      console.log(
        `NoPackedVariables.readSum() average gas: ${noPackedVariablesGas.toFixed(
          0
        )}`
      );
      console.log(
        `Gas saved: ${(noPackedVariablesGas - packedVariablesGas).toFixed(0)}`
      );

      expect(packedVariablesGas).to.be.lessThan(noPackedVariablesGas);
    });

    it("NoPackedVariables should use less gas than PackedVariables in readA function", async function () {
      const { packedVariables, noPackedVariables } = await loadFixture(
        deployContract
      );

      const measureAverageGas = async (
        contract: any,
        functionName: string,
        times: number
      ) => {
        const gasPromises = [];
        for (let i = 0; i < times; i++) {
          gasPromises.push(contract[functionName].estimateGas());
        }
        const gasUsages = await Promise.all(gasPromises);
        return gasUsages.reduce((a, b) => a + Number(b), 0) / gasUsages.length;
      };

      const noPackedVariablesGas = await measureAverageGas(
        noPackedVariables,
        "readA",
        10
      );

      const packedVariablesGas = await measureAverageGas(
        packedVariables,
        "readA",
        10
      );

      console.log(`\n=== Gas Comparison (10 runs) ===`);
      console.log(
        `NoPackedVariables.readA() average gas: ${noPackedVariablesGas.toFixed(
          0
        )}`
      );
      console.log(
        `PackedVariables.readA() average gas: ${packedVariablesGas.toFixed(0)}`
      );
      console.log(
        `Gas saved: ${(packedVariablesGas - noPackedVariablesGas).toFixed(0)}`
      );

      expect(noPackedVariablesGas).to.be.lessThan(packedVariablesGas);
    });
  });
});

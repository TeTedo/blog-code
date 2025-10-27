import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ContractTransactionResponse } from "ethers";
import hre from "hardhat";

describe("Sload", function () {
  async function deploySloadFixture() {
    const Sload = await hre.ethers.getContractFactory("Sload");
    const sload = await Sload.deploy();

    return { sload };
  }

  describe("Gas Comparison", function () {
    it("unoptimized function should use more gas than optimized function", async function () {
      const { sload } = await loadFixture(deploySloadFixture);

      // Helper function to measure average gas usage
      const measureAverageGas = async (
        func: (iterations: number) => Promise<ContractTransactionResponse>,
        iterations: number,
        times: number
      ) => {
        const txPromises = [];
        for (let i = 0; i < times; i++) {
          txPromises.push(func(iterations));
        }
        const txs = await Promise.all(txPromises);
        const receipts = await Promise.all(
          txs.map((tx) => tx.wait().then((receipt) => receipt!.gasUsed))
        );
        return receipts.reduce((a, b) => a + Number(b), 0) / receipts.length;
      };

      // Measure unoptimized function
      const unoptimizedGas = await measureAverageGas(
        (iterations) => sload.unoptimized(iterations),
        10,
        10
      );

      // Measure optimized function
      const optimizedGas = await measureAverageGas(
        (iterations) => sload.optimized(iterations),
        10,
        10
      );

      // Calculate results
      const gasSaved = unoptimizedGas - optimizedGas;
      const gasSavedPercentage = (gasSaved / unoptimizedGas) * 100;

      // Print results
      console.log(`\n=== Gas Comparison (10 iterations, 10 runs) ===`);
      console.log(`Unoptimized average gas used: ${unoptimizedGas.toFixed(0)}`);
      console.log(`Optimized average gas used: ${optimizedGas.toFixed(0)}`);
      console.log(`Gas saved: ${gasSaved.toFixed(0)}`);
      console.log(`Gas saving percentage: ${gasSavedPercentage.toFixed(2)}%`);

      // Assert optimized uses less gas
      expect(optimizedGas).to.be.lessThan(unoptimizedGas);
    });
  });
});

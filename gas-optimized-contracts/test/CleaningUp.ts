import { expect } from "chai";
import { Signer, ZeroAddress } from "ethers";
import hre from "hardhat";

describe("Cleaning Up", function () {
  let owner: Signer;

  async function deployCleaningUpFixture() {
    [owner] = await hre.ethers.getSigners();
    const CleaningUpStorage = await hre.ethers.getContractFactory(
      "CleaningUpStorage"
    );
    const cleaningUpStorage = await CleaningUpStorage.deploy();
    await cleaningUpStorage.waitForDeployment();

    const CleaningUpStorage2 = await hre.ethers.getContractFactory(
      "CleaningUpStorage2"
    );
    const cleaningUpStorage2 = await CleaningUpStorage2.deploy();
    await cleaningUpStorage2.waitForDeployment();
    return { cleaningUpStorage, cleaningUpStorage2 };
  }

  describe("Compare Contract Creation Gas", function () {
    it("should compare gas usage between selfdestruct and normal contract", async function () {
      [owner] = await hre.ethers.getSigners();

      const CreateContractFactory = await hre.ethers.getContractFactory(
        "CreateContract"
      );
      const createContract = await CreateContractFactory.deploy();
      await createContract.waitForDeployment();

      const createContractTx = createContract.deploymentTransaction();
      if (!createContractTx) {
        throw new Error("Deployment transaction not found");
      }
      const createContractReceipt = await createContractTx.wait();
      const createContractGas = createContractReceipt!.gasUsed;

      const CleaningUpContractFactory = await hre.ethers.getContractFactory(
        "CleaningUpContract"
      );
      const cleaningUp = await CleaningUpContractFactory.deploy(
        await owner.getAddress()
      );
      await cleaningUp.waitForDeployment();

      const cleaningUpTx = cleaningUp.deploymentTransaction();
      if (!cleaningUpTx) {
        throw new Error("Deployment transaction not found");
      }
      const cleaningUpReceipt = await cleaningUpTx.wait();
      const cleaningUpGas = cleaningUpReceipt!.gasUsed;

      expect(cleaningUpGas).to.be.lessThan(createContractGas);
    });
  });

  describe("Compare Gas Usage between evolveKitten and evolveKitten2", function () {
    it("should evolveKitten be more gas efficient than evolveKitten2", async function () {
      const CleaningUpStorage = await hre.ethers.getContractFactory(
        "CleaningUpStorage"
      );
      const cleaningUpStorage = await CleaningUpStorage.deploy();
      await cleaningUpStorage.waitForDeployment();

      const CleaningUpStorage2 = await hre.ethers.getContractFactory(
        "CleaningUpStorage"
      );
      const cleaningUpStorage2 = await CleaningUpStorage2.deploy();
      await cleaningUpStorage2.waitForDeployment();

      const testId = 1;
      const testOwner = await owner.getAddress();
      const testName = "Kitten";

      await cleaningUpStorage.setKitten(testId, testOwner, testName);
      await cleaningUpStorage2.setKitten(testId, testOwner, testName);

      const evolveKittenGas = await cleaningUpStorage.evolveKitten
        .send(testId)
        .then((tx) => tx.wait().then((receipt) => receipt!.gasUsed));
      const evolveKitten2Gas = await cleaningUpStorage2.evolveKitten2
        .send(testId)
        .then((tx) => tx.wait().then((receipt) => receipt!.gasUsed));

      expect(evolveKittenGas).to.be.lessThan(evolveKitten2Gas);
    });
  });
});

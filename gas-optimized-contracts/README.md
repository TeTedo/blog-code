# Gas Optimized Contracts

I will explain about gas optimization when writing contract code with reference to [nodeguardians gas optimization campaign](https://nodeguardians.io/campaigns/gas-optimization)

You can find the all of codes in [Github](https://github.com/TeTedo/blog-code/tree/main/gas-optimized-contracts).

## 1. Reducing Storage Access

Accessing contract storage is a very expensive operation.

The opcodes for accessing storage are SLOAD and SSTORE. we can see that [SLOAD](https://github.com/wolflo/evm-opcodes/blob/main/gas.md#a6-sload) and [SSTORE](https://github.com/wolflo/evm-opcodes/blob/main/gas.md#a7-sstore) are very expensive operations.

Here is an example of a gas-optimized contract.

```solidity
contract Sload {
    uint256 public stateVariable;

    function unoptimized(uint256 interation) public {
        for (uint256 i = 0; i < interation; i++) {
            stateVariable += i;
        }
    }

    function optimized(uint256 interation) public {
        uint256 cache = stateVariable;
        for (uint256 i = 0; i < interation; i++) {
            cache += i;
        }

        stateVariable = cache;
    }
}
```

First, let's see the unoptimized function.

```solidity
function unoptimized(uint256 interation) public {
    for (uint256 i = 0; i < interation; i++) {
        stateVariable += i;
    }
}
```

This function uses state variable directly in each iteration.

Second, let's see the optimized function.

```solidity
function optimized(uint256 interation) public {
    uint256 cache = stateVariable;
    for (uint256 i = 0; i < interation; i++) {
        cache += i;
    }
}
```

This function uses a cache variable to store the state variable and uses it in each iteration.

Predicting the result, the optimized function's gas usage should be less than the unoptimized function's gas usage.

Why? Because the unoptimized function accesses the state variable directly, which is more expensive than using a cache variable.

The unoptimized function uses SLOAD and SSTORE opcodes in each iteration.

On the other hand, the optimized function uses SLOAD and SSTORE opcodes only once. After that, it uses MLOAD and MSTORE opcodes instead.

[EVM.codes](https://www.evm.codes/) shows the opcodes and their gas usage.

MLOAD and MSTORE opcodes require "3" minimum gas and SLOAD and SSTORE opcodes require "100" minimum gas.

Let's see the result.

Here is the test code for the Sload contract.

```ts
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
```

I suppose that unoptimized function and optimized function call 10 times each.

And the result is like this.

```
=== Gas Comparison (10 iterations, 10 runs) ===
Unoptimized average gas used: 32862
Optimized average gas used: 29167
Gas saved: 3695
Gas saving percentage: 11.24%
```

Hence, the optimized function uses less gas than the unoptimized function.

## 2. Packing Variables

Similar to memory, storage in the EVM is also segmented into 256-bit slots.

When we declare a variable, it is stored in a 256-bit slot.

Let's see the example of a packed variable.

There are two types of contracts.

```solidity
contract PackedVariables {
    uint128 a; // ┐
    uint128 b; // ┴─ Slot 0

    function readSum() public view returns (uint128) {
        return a + b;
    }
}

contract NoPackedVariables {
    uint256 a; // └─ Slot 0
    uint256 b; // └─ Slot 1

    function readSum() public view returns (uint128) {
        return a + b;
    }
}
```

PackedVariables contract will require 1 256-bit storage slot.

NoPackedVariables contract will require 2 256-bit storage slots.

In `readSum` function, the PackedVariables contract will use 1 SLOAD opcode and 1 ADD opcode.

On the other hand, the NoPackedVariables contract will use 2 SLOAD opcodes and 1 ADD opcode.

Does this mean, ignoring overflow, packed variable contract is more gas efficient always?

But it's not true always. Let's see the next example.

```solidity
contract PackedVariables {
    uint128 a; // ┐
    uint128 b; // ┴─ Slot 0

    function readA() public view returns (uint128) {
        return a;
    }
}
```

```solidity
contract NoPackedVariables {
    uint256 a; // └─ Slot 0
    uint256 b; // └─ Slot 1

    function readA() public view returns (uint256) {
        return a;
    }
}
```

The PackedVariables contract will require 1 SLOAD opcode and more to devide a and b.

On the other hand, the NoPackedVariables contract will require just 1 SLOAD.

The NoPackedVariables contract is more gas efficient than the PackedVariables contract in this case.

Let's see the result by test code.

```ts
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
      `PackedVariables.readSum() average gas: ${packedVariablesGas.toFixed(0)}`
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
```

The result is like this.

```
=== Gas Comparison (10 runs) ===
PackedVariables.readSum() average gas: 23926
NoPackedVariables.readSum() average gas: 25789
Gas saved: 1863
      ✔ PackedVariables should use less gas than NoPackedVariables in readSum function

=== Gas Comparison (10 runs) ===
NoPackedVariables.readA() average gas: 23479
PackedVariables.readA() average gas: 23521
Gas saved: 42
      ✔ NoPackedVariables should use less gas than PackedVariables in readA function
```

## 3. Cleaning Up State

Contracts can `selfdestruct()`, and a contract's storage can be cleared by setting any non-zero slot back to 0.

### History of `selfdestruct` Changes

1. **Before London Hardfork**: `selfdestruct()` would destroy contracts and refund gas to the caller. The gas refund was significant.

2. **London Hardfork [EIP-3529](https://eips.ethereum.org/EIPS/eip-3529)**: Gas refunds were removed or significantly reduced. `selfdestruct` no longer provides gas refunds.

3. **Cancun Hardfork [EIP-6780](https://eips.ethereum.org/EIPS/eip-6780)**: `selfdestruct` can only destroy contracts if it's called in the same transaction where the contract was created. In all other cases, `selfdestruct` only transfers Ether to the beneficiary but does not delete the contract code or storage.

When `selfdestruct` is called in the constructor (same transaction), the contract code is not stored, which means the code storage cost (code size × 200 gas/byte) is refunded. This can result in lower deployment gas costs compared to a normal contract.

Then we can guess that selfdestruct contract is cheaper than normal contract.

Below is the test code for comparing gas usage between selfdestruct and normal contract.

```ts
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
```

And contract's storage can be cleared by `delete`.

```solidity
contract CleaningUpStorage {
    mapping(uint256 => address) kittenOwner;
    mapping(uint256 => string) kittenName;

    mapping(uint256 => address) catOwner;
    mapping(uint256 => string) catName;

    function evolveKitten(uint256 id) public {
        catOwner[id] = kittenOwner[id];
        catName[id] = kittenName[id]; // Accessing storage incurs X gas
        delete kittenOwner[id];
        delete kittenName[id]; // Deleting storage refunds Y gas
    }

    function evolveKitten2(uint256 id) public {
        catOwner[id] = kittenOwner[id];
        catName[id] = kittenName[id]; // Accessing storage incurs X gas
        delete kittenOwner[id];
    }
}
```

In this case, the `evolveKitten` function is more gas efficient than the `evolveKitten2` function. Because the `evolveKitten` function deletes the storage and refunds the gas more than the `evolveKitten2` function does.

Below is the test code for comparing gas usage between `evolveKitten` and `evolveKitten2`.

```ts
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

evolveKitten : 68,115 gas
evolveKitten2 : 69,583 gas
```

## 4. Hardcoding State Variables

State variables that are labeled as `immutable` or `constant` can be hardcoded in the contract code.

There are two types of contract's bytecode.

1. Contract Creation Bytecode
2. Runtime Bytecode

`constant` value is stored in the contract creation bytecode.

`immutable` value is stored in the runtime bytecode.

When we use `constant` or `immutable` value, the value is hardcoded in the contract code.

Hence, we can save gas by using `constant` or `immutable` value instead of `storage` or `memory` value.

```solidity
contract myContract {

    uint256 constant a = 100; // Declared as literal
    uint256 immutable b; // Initialized in constructor

    constructor(uint256 _b) {
        b = _b;
    }
}
```

One restriction regarding `immutable` variables is that you cannot use them inside a `pure` function.

## 5. Calldata or Memory Parameters

Calldata is a cheap read-only data location that stores the arguments of function calls.

When we use calldata, the data is stored in the calldata memory.

When we use memory, the data is stored in the memory.

Calldata is cheaper than memory because it is read-only and does not require copying the data to the memory.

```solidity
contract Calldata {
    function calldataParameter(uint256[] calldata a) public pure returns (uint256[] calldata) {
        return a;
    }

    function memoryParameter(uint256[] memory a) public pure returns (uint256[] memory) {
        return a;
    }
}
```

```ts
const calldataParameterGas = await calldata.calldataParameter.estimateGas([
  1, 2, 3,
]);
const memoryParameterGas = await calldata.memoryParameter.estimateGas([
  1, 2, 3,
]);

console.log(`calldata parameter gas: ${calldataParameterGas}`);
console.log(`memory parameter gas: ${memoryParameterGas}`);
expect(calldataParameterGas).to.be.lessThan(memoryParameterGas);

calldata parameter gas: 22910
memory parameter gas: 24523
```

## 6. Arithmetic Tricks

Bitwise operations are cheaper than arithmetic operations.

```solidity
contract ArithmeticTrick {
    function bitwiseAdd(uint256 a) public pure returns (uint256) {
        return a << 1;
    }

    function arithmeticAdd(uint256 a) public pure returns (uint256) {
        return a * 2;
    }
}
```

```ts
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

bitwise add gas: 21815
arithmetic add gas: 22036
```

## 7. Inline Assembly

In some specific cases, directly using inline assembly can be more gas efficient than using Solidity code.

## 8. Custom Errors

Custom errors are cheaper than revert strings.

```solidity
contract A {
    function isAuthorized() public {
        if (msg.sender != owner) {
            revert "Unauthorized";
        }
    }
}

contract B {

    error unauthorizedError();

    function isAuthorized() public {
        if (msg.sender != owner) {
            revert unauthorizedError();
        }
    }

}
```

Custom errors is only 4 bytes. So it is cheaper than revert strings.

The encoded error would be the first 4 bytes of `keccak256(unauthorizedError())`.

## 9. Modifier Wrappers

When functions use modifiers, the Solidity compiler embeds a copy of the modifier's code into the function's bytecode.

If the modifier is heavy, it is more gas efficient using a wrapper function instead of a modifier.

```solidity
modifier myExpensiveModifier() {
    _myExpensiveModifier();
    _;
}

function _myExpensiveModifier() internal view {
    // do something gas expensive
}

function aFunction() public view myExpensiveModifier() {
    // ...
}
```

## references

[Ethereum opcode docs](https://ethereum.org/developers/docs/evm/opcodes/)

[nodeguardians gas optimization campaign](https://nodeguardians.io/campaigns/gas-optimization)

[EVM.codes](https://www.evm.codes/)

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

## references

[Ethereum opcode docs](https://ethereum.org/developers/docs/evm/opcodes/)

[nodeguardians gas optimization campaign](https://nodeguardians.io/campaigns/gas-optimization)

[EVM.codes](https://www.evm.codes/)

```

```

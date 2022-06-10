# Contracts Commons

Abstract contracts to be used and reused on different projects.

## Install

```
npm install @dcl/contracts-commons
```

## Usage

```
import "@dcl/contracts-commons/signatures/NonceVerifiable.sol";
```

## Contracts

### NativeMetaTransaction

Allows a contract to support meta transactions.

A relayer (Biconomy for example), can call the `executeMetaTransaction` function and call a function for another user instead. Saving gas fees for them.

### NonceVerifiable

Allows signatures to be invalidated on 3 different levels. Contract, Signer and Asset levels.

The contract should be queried for the current nonces on each level and use those nonces to create a signature.

When the signatures are recovered, they have to be verifies with these nonces.

They can be updated in order to invalidate signatures that were created with previous values.

## Running Tests

Install dependencies with `npm ci`

Run tests with `npx hardhat test`

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

What are meta transactions? 

They provide a way for users to enjoy "gasless" transactions by just signing the data of the transaction they want to execute and letting a relayer, which is the one that ends up paying the fees, to execute it.

### NonceVerifiable

Allows signatures to be invalidated on 3 different levels. Contract, Signer and Asset levels.

The contract should be queried for the current nonces on each level and use those nonces to create a signature.

When the signatures are recovered, they have to be verifies with these nonces.

They can be updated in order to invalidate signatures that were created with previous values.

## Running Tests

Install dependencies with `npm ci`

Run tests with `npx hardhat test`

# Common Contracts

Abstract contracts to be used and reused on different projects.

## Install

```
npm install -D @dcl/common-contracts
```

Requires Open Zeppelin upgradable contracts v4.5 as a peer dependency.

```
npm install -D @openzeppelin/contracts-upgradeable@4.5.0
```

## Usage

```
import "@dcl/common-contracts/signatures/NonceVerifiable.sol";
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

## Development

### Requirements

- Node 16
- Npm 8

### Install dependencies

```
npm ci
```

### Compile

```
npx hardhat compile
```

### Test

```
npx hardhat test
```

Will report gas usage.

```
npx hardhat coverage
```

Will report coverage in the `coverage` directory.

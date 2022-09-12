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
import "@dcl/common-contracts/signatures/ContractVerificationIndex.sol";
import "@dcl/common-contracts/signatures/SignerVerificationIndex.sol";
import "@dcl/common-contracts/signatures/AssetVerificationIndex.sol";
```

## Contracts

### NativeMetaTransaction

Allows a contract to support meta transactions.

What are meta transactions?

They provide a way for users to enjoy "gasless" transactions by just signing the data of the transaction they want to execute and letting a relayer, which is the one that ends up paying the fees, to execute it.

### ContractVerificationIndex, SignerVerificationIndex, AssetVerificationIndex

Allows signatures to be invalidated on 3 different levels. Contract, Signer and Asset levels.

The contract should be queried for the current verification indexes on each level and use those indexes to create a signature.

When the signatures are recovered, they have to be verified with these indexes.

They can be updated in order to invalidate signatures that were created with previous values.

They come separated in 3 different contracts for each level but you might choose if you want all or just a couple depending on your requirements.

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
npm run compile
```

### Test

```
npm run test
```

Will report gas usage.

```
npx run test:coverage
```

Will report coverage in the `coverage` directory.

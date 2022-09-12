import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { DummyNonceVerifiableImplementor, DummyNonceVerifiableImplementor__factory } from '../typechain-types'

describe('NonceVerifiable', () => {
  let deployer: SignerWithAddress
  let owner: SignerWithAddress
  let signer: SignerWithAddress
  let extra: SignerWithAddress

  let contractFactory: DummyNonceVerifiableImplementor__factory
  let contract: DummyNonceVerifiableImplementor

  beforeEach(async () => {
    ;[deployer, owner, signer, extra] = await ethers.getSigners()

    contractFactory = await ethers.getContractFactory('DummyNonceVerifiableImplementor')
    contract = await contractFactory.deploy()

    await contract.connect(deployer).initialize()
    await contract.connect(deployer).transferOwnership(owner.address)
  })

  describe('initialize', () => {
    it('should set the owner as the caller after initializing', async () => {
      contractFactory = await ethers.getContractFactory('DummyNonceVerifiableImplementor')
      contract = await contractFactory.deploy()

      expect(await contract.owner()).to.be.equal('0x0000000000000000000000000000000000000000')

      await contract.initialize()

      expect(await contract.owner()).to.be.equal(deployer.address)
    })

    it('should revert when initialized twice', async () => {
      await expect(contract.initialize()).to.be.revertedWith('Initializable: contract is already initialized')
    })
  })

  describe('__NonceVerifiable_init', () => {
    it('should set the owner', async () => {
      expect(await contract.owner()).to.be.equal(owner.address)
    })

    it('should revert when called after initialization', async () => {
      await expect(contract.connect(deployer).test__ContractNonceVerifiable_init()).to.be.revertedWith('Initializable: contract is not initializing')
    })
  })

  describe('bumpContractNonce', () => {
    it('should increase the contract nonce by 1', async () => {
      expect(await contract.getContractNonce()).to.be.equal(0)
      await contract.connect(owner).bumpContractNonce()
      expect(await contract.getContractNonce()).to.be.equal(1)
    })

    it('should emit an event regarding the contract nonce update', async () => {
      await expect(contract.connect(owner).bumpContractNonce()).to.emit(contract, 'ContractNonceUpdated').withArgs(1, owner.address)
    })

    it('should revert if the caller is not the contract owner', async () => {
      await expect(contract.connect(extra).bumpContractNonce()).to.be.revertedWith('Ownable: caller is not the owner')
    })
  })

  describe('bumpSignerNonce', () => {
    it('should increase the signer nonce by 1', async () => {
      expect(await contract.getSignerNonce(signer.address)).to.be.equal(0)
      await contract.connect(signer).bumpSignerNonce()
      expect(await contract.getSignerNonce(signer.address)).to.be.equal(1)
    })

    it('should emit an event regarding the contract nonce update', async () => {
      await expect(contract.connect(signer).bumpSignerNonce()).to.emit(contract, 'SignerNonceUpdated').withArgs(signer.address, 1, signer.address)
    })
  })

  describe('bumpAssetVerificationIndex', () => {
    it('should increase the asset nonce by 1', async () => {
      expect(await contract.getAssetVerificationIndex(extra.address, 0, signer.address)).to.be.equal(0)
      await contract.connect(signer).bumpAssetVerificationIndex(extra.address, 0)
      expect(await contract.getAssetVerificationIndex(extra.address, 0, signer.address)).to.be.equal(1)
    })

    it('should emit an event regarding the contract nonce update', async () => {
      await expect(contract.connect(signer).bumpAssetVerificationIndex(extra.address, 0))
        .to.emit(contract, 'AssetVerificationIndexUpdated')
        .withArgs(signer.address, extra.address, 0, 1, signer.address)
    })
  })

  describe('_verifyContractNonce', () => {
    const err = 'ContractNonceVerifiable#_verifyContractNonce: CONTRACT_NONCE_MISMATCH'

    it('should revert when the provided nonce does not match with the contract nonce', async () => {
      await expect(contract.verifyContractNonce(1)).to.be.revertedWith(err)
    })

    it('should NOT revert when the provided nonce matches with the contract nonce', async () => {
      await expect(contract.verifyContractNonce(0)).to.not.be.revertedWith(err)
    })
  })

  describe('_verifySignerNonce', () => {
    const err = 'SignerNonceVerifiable#_verifySignerNonce: SIGNER_NONCE_MISMATCH'

    it('should revert when the provided nonce does not match with the signer nonce', async () => {
      await expect(contract.verifySignerNonce(signer.address, 1)).to.be.revertedWith(err)
    })

    it('should NOT revert when the provided nonce matches with the signer nonce', async () => {
      await expect(contract.verifySignerNonce(signer.address, 0)).to.not.be.revertedWith(err)
    })
  })

  describe('_verifyAssetVerificationIndex', () => {
    const err = 'AssetVerificationIndex#_verifyAssetVerificationIndex: ASSET_VERIFICATION_INDEX_MISMATCH'

    it('should revert when the provided nonce does not match with the asset nonce', async () => {
      await expect(contract.verifyAssetVerificationIndex(extra.address, 0, signer.address, 1)).to.be.revertedWith(err)
    })

    it('should NOT revert when the provided nonce matches with the asset nonce', async () => {
      await expect(contract.verifyAssetVerificationIndex(extra.address, 0, signer.address, 0)).to.not.be.revertedWith(err)
    })
  })

  describe('bumpAll (mock)', () => {
    it('should emit ContractNonceUpdated, SignerNonceUpdated and AssetVerificationIndexUpdated events', async () => {
      await expect(contract.connect(owner).bumpAll(extra.address, 0, signer.address))
        .to.emit(contract, 'ContractNonceUpdated')
        .withArgs(1, owner.address)
        .and.to.emit(contract, 'SignerNonceUpdated')
        .withArgs(signer.address, 1, owner.address)
        .and.to.emit(contract, 'AssetVerificationIndexUpdated')
        .withArgs(signer.address, extra.address, 0, 1, owner.address)
    })
  })
})

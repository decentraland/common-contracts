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
      await expect(contract.connect(deployer).test__NonceVerifiable_init()).to.be.revertedWith('Initializable: contract is not initializing')
    })
  })

  describe('bumpContractNonce', () => {
    it('should increase the contract nonce by 1', async () => {
      expect(await contract.getContractNonce()).to.be.equal(0)
      await contract.connect(owner).bumpContractNonce()
      expect(await contract.getContractNonce()).to.be.equal(1)
    })

    it('should emit an event regarding the contract nonce update', async () => {
      await expect(contract.connect(owner).bumpContractNonce()).to.emit(contract, 'ContractNonceUpdated').withArgs(0, 1, owner.address)
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
      await expect(contract.connect(signer).bumpSignerNonce()).to.emit(contract, 'SignerNonceUpdated').withArgs(0, 1, signer.address, signer.address)
    })
  })

  describe('bumpAssetNonce', () => {
    it('should increase the asset nonce by 1', async () => {
      expect(await contract.getAssetNonce(extra.address, 0, signer.address)).to.be.equal(0)
      await contract.connect(signer).bumpAssetNonce(extra.address, 0)
      expect(await contract.getAssetNonce(extra.address, 0, signer.address)).to.be.equal(1)
    })

    it('should emit an event regarding the contract nonce update', async () => {
      await expect(contract.connect(signer).bumpAssetNonce(extra.address, 0))
        .to.emit(contract, 'AssetNonceUpdated')
        .withArgs(0, 1, extra.address, 0, signer.address, signer.address)
    })
  })

  describe('_verifyContractNonce', () => {
    const err = 'NonceVerifiable#_verifyContractNonce: CONTRACT_NONCE_MISMATCH'

    it('should revert when the provided nonce does not match with the contract nonce', async () => {
      await expect(contract.verifyContractNonce(1)).to.be.revertedWith(err)
    })

    it('should NOT revert when the provided nonce matches with the contract nonce', async () => {
      await expect(contract.verifyContractNonce(0)).to.not.be.revertedWith(err)
    })
  })

  describe('_verifySignerNonce', () => {
    const err = 'NonceVerifiable#_verifySignerNonce: SIGNER_NONCE_MISMATCH'

    it('should revert when the provided nonce does not match with the signer nonce', async () => {
      await expect(contract.verifySignerNonce(signer.address, 1)).to.be.revertedWith(err)
    })

    it('should NOT revert when the provided nonce matches with the signer nonce', async () => {
      await expect(contract.verifySignerNonce(signer.address, 0)).to.not.be.revertedWith(err)
    })
  })

  describe('_verifyAssetNonce', () => {
    const err = 'NonceVerifiable#_verifyAssetNonce: ASSET_NONCE_MISMATCH'

    it('should revert when the provided nonce does not match with the asset nonce', async () => {
      await expect(contract.verifyAssetNonce(extra.address, 0, signer.address, 1)).to.be.revertedWith(err)
    })

    it('should NOT revert when the provided nonce matches with the asset nonce', async () => {
      await expect(contract.verifyAssetNonce(extra.address, 0, signer.address, 0)).to.not.be.revertedWith(err)
    })
  })
})

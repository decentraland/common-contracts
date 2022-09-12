import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { DummyIndexVerificationImplementor, DummyIndexVerificationImplementor__factory } from '../typechain-types'

describe('NonceVerifiable', () => {
  let deployer: SignerWithAddress
  let owner: SignerWithAddress
  let signer: SignerWithAddress
  let extra: SignerWithAddress

  let contractFactory: DummyIndexVerificationImplementor__factory
  let contract: DummyIndexVerificationImplementor

  beforeEach(async () => {
    ;[deployer, owner, signer, extra] = await ethers.getSigners()

    contractFactory = await ethers.getContractFactory('DummyIndexVerificationImplementor')
    contract = await contractFactory.deploy()

    await contract.connect(deployer).initialize()
    await contract.connect(deployer).transferOwnership(owner.address)
  })

  describe('initialize', () => {
    it('should set the owner as the caller after initializing', async () => {
      contractFactory = await ethers.getContractFactory('DummyIndexVerificationImplementor')
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
      await expect(contract.connect(deployer).test__ContractVerificationIndex_init()).to.be.revertedWith('Initializable: contract is not initializing')
    })
  })

  describe('bumpContractVerificationIndex', () => {
    it('should increase the contract nonce by 1', async () => {
      expect(await contract.getContractVerificationIndex()).to.be.equal(0)
      await contract.connect(owner).bumpContractVerificationIndex()
      expect(await contract.getContractVerificationIndex()).to.be.equal(1)
    })

    it('should emit an event regarding the contract nonce update', async () => {
      await expect(contract.connect(owner).bumpContractVerificationIndex()).to.emit(contract, 'ContractVerificationIndexUpdated').withArgs(1, owner.address)
    })

    it('should revert if the caller is not the contract owner', async () => {
      await expect(contract.connect(extra).bumpContractVerificationIndex()).to.be.revertedWith('Ownable: caller is not the owner')
    })
  })

  describe('bumpSignerVerificationIndex', () => {
    it('should increase the signer nonce by 1', async () => {
      expect(await contract.getSignerVerificationIndex(signer.address)).to.be.equal(0)
      await contract.connect(signer).bumpSignerVerificationIndex()
      expect(await contract.getSignerVerificationIndex(signer.address)).to.be.equal(1)
    })

    it('should emit an event regarding the contract nonce update', async () => {
      await expect(contract.connect(signer).bumpSignerVerificationIndex()).to.emit(contract, 'SignerVerificationIndexUpdated').withArgs(signer.address, 1, signer.address)
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

  describe('_verifyContractVerificationIndex', () => {
    const err = 'ContractVerificationIndex#_verifyContractVerificationIndex: CONTRACT_VERIFICATION_INDEX_MISMATCH'

    it('should revert when the provided nonce does not match with the contract nonce', async () => {
      await expect(contract.verifyContractVerificationIndex(1)).to.be.revertedWith(err)
    })

    it('should NOT revert when the provided nonce matches with the contract nonce', async () => {
      await expect(contract.verifyContractVerificationIndex(0)).to.not.be.revertedWith(err)
    })
  })

  describe('_verifySignerVerificationIndex', () => {
    const err = 'SignerVerificationIndex#_verifySignerVerificationIndex: SIGNER_VERIFICATION_INDEX_MISMATCH'

    it('should revert when the provided nonce does not match with the signer nonce', async () => {
      await expect(contract.verifySignerVerificationIndex(signer.address, 1)).to.be.revertedWith(err)
    })

    it('should NOT revert when the provided nonce matches with the signer nonce', async () => {
      await expect(contract.verifySignerVerificationIndex(signer.address, 0)).to.not.be.revertedWith(err)
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
    it('should emit ContractVerificationIndexUpdated, SignerVerificationIndexUpdated and AssetVerificationIndexUpdated events', async () => {
      await expect(contract.connect(owner).bumpAll(extra.address, 0, signer.address))
        .to.emit(contract, 'ContractVerificationIndexUpdated')
        .withArgs(1, owner.address)
        .and.to.emit(contract, 'SignerVerificationIndexUpdated')
        .withArgs(signer.address, 1, owner.address)
        .and.to.emit(contract, 'AssetVerificationIndexUpdated')
        .withArgs(signer.address, extra.address, 0, 1, owner.address)
    })
  })
})

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { DummyIndexVerifiableImplementor, DummyIndexVerifiableImplementor__factory } from '../typechain-types'

describe('IndexVerifiable', () => {
  let deployer: SignerWithAddress
  let owner: SignerWithAddress
  let signer: SignerWithAddress
  let extra: SignerWithAddress

  let contractFactory: DummyIndexVerifiableImplementor__factory
  let contract: DummyIndexVerifiableImplementor

  beforeEach(async () => {
    ;[deployer, owner, signer, extra] = await ethers.getSigners()

    contractFactory = await ethers.getContractFactory('DummyIndexVerifiableImplementor')
    contract = await contractFactory.deploy()

    await contract.connect(deployer).initialize()
    await contract.connect(deployer).transferOwnership(owner.address)
  })

  describe('initialize', () => {
    it('should set the owner as the caller after initializing', async () => {
      contractFactory = await ethers.getContractFactory('DummyIndexVerifiableImplementor')
      contract = await contractFactory.deploy()

      expect(await contract.owner()).to.be.equal('0x0000000000000000000000000000000000000000')

      await contract.initialize()

      expect(await contract.owner()).to.be.equal(deployer.address)
    })

    it('should revert when initialized twice', async () => {
      await expect(contract.initialize()).to.be.revertedWith('Initializable: contract is already initialized')
    })
  })

  describe('__ContractIndexVerifiable_init', () => {
    it('should set the owner', async () => {
      expect(await contract.owner()).to.be.equal(owner.address)
    })

    it('should revert when called after initialization', async () => {
      await expect(contract.connect(deployer).test__ContractIndexVerifiable_init()).to.be.revertedWith('Initializable: contract is not initializing')
    })
  })

  describe('bumpContractIndex', () => {
    it('should increase the contract index by 1', async () => {
      expect(await contract.getContractIndex()).to.be.equal(0)
      await contract.connect(owner).bumpContractIndex()
      expect(await contract.getContractIndex()).to.be.equal(1)
    })

    it('should emit an event regarding the contract index update', async () => {
      await expect(contract.connect(owner).bumpContractIndex()).to.emit(contract, 'ContractIndexUpdated').withArgs(1, owner.address)
    })

    it('should revert if the caller is not the contract owner', async () => {
      await expect(contract.connect(extra).bumpContractIndex()).to.be.revertedWith('Ownable: caller is not the owner')
    })
  })

  describe('bumpSignerIndex', () => {
    it('should increase the signer index by 1', async () => {
      expect(await contract.getSignerIndex(signer.address)).to.be.equal(0)
      await contract.connect(signer).bumpSignerIndex()
      expect(await contract.getSignerIndex(signer.address)).to.be.equal(1)
    })

    it('should emit an event regarding the contract index update', async () => {
      await expect(contract.connect(signer).bumpSignerIndex()).to.emit(contract, 'SignerIndexUpdated').withArgs(signer.address, 1, signer.address)
    })
  })

  describe('bumpAssetIndex', () => {
    it('should increase the asset index by 1', async () => {
      expect(await contract.getAssetIndex(extra.address, 0, signer.address)).to.be.equal(0)
      await contract.connect(signer).bumpAssetIndex(extra.address, 0)
      expect(await contract.getAssetIndex(extra.address, 0, signer.address)).to.be.equal(1)
    })

    it('should emit an event regarding the contract index update', async () => {
      await expect(contract.connect(signer).bumpAssetIndex(extra.address, 0))
        .to.emit(contract, 'AssetIndexUpdated')
        .withArgs(signer.address, extra.address, 0, 1, signer.address)
    })
  })

  describe('_verifyContractIndex', () => {
    const err = 'ContractIndexVerifiable#_verifyContractIndex: CONTRACT_INDEX_MISMATCH'

    it('should revert when the provided index does not match with the contract index', async () => {
      await expect(contract.verifyContractIndex(1)).to.be.revertedWith(err)
    })

    it('should NOT revert when the provided index matches with the contract index', async () => {
      await expect(contract.verifyContractIndex(0)).to.not.be.revertedWith(err)
    })
  })

  describe('_verifySignerIndex', () => {
    const err = 'SignerIndexVerifiable#_verifySignerIndex: SIGNER_INDEX_MISMATCH'

    it('should revert when the provided index does not match with the signer index', async () => {
      await expect(contract.verifySignerIndex(signer.address, 1)).to.be.revertedWith(err)
    })

    it('should NOT revert when the provided index matches with the signer index', async () => {
      await expect(contract.verifySignerIndex(signer.address, 0)).to.not.be.revertedWith(err)
    })
  })

  describe('_verifyAssetIndex', () => {
    const err = 'AssetIndexVerifiable#_verifyAssetIndex: ASSET_INDEX_MISMATCH'

    it('should revert when the provided index does not match with the asset index', async () => {
      await expect(contract.verifyAssetIndex(extra.address, 0, signer.address, 1)).to.be.revertedWith(err)
    })

    it('should NOT revert when the provided index matches with the asset index', async () => {
      await expect(contract.verifyAssetIndex(extra.address, 0, signer.address, 0)).to.not.be.revertedWith(err)
    })
  })

  describe('bumpAll (mock)', () => {
    it('should emit ContractIndexUpdated, SignerIndexUpdated and AssetIndexUpdated events', async () => {
      await expect(contract.connect(owner).bumpAll(extra.address, 0, signer.address))
        .to.emit(contract, 'ContractIndexUpdated')
        .withArgs(1, owner.address)
        .and.to.emit(contract, 'SignerIndexUpdated')
        .withArgs(signer.address, 1, owner.address)
        .and.to.emit(contract, 'AssetIndexUpdated')
        .withArgs(signer.address, extra.address, 0, 1, owner.address)
    })
  })
})

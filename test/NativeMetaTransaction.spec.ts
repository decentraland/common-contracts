import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import {
  DummyNativeMetaTransactionImplementor,
  DummyNativeMetaTransactionImplementor__factory,
  DummyRelayer,
  DummyRelayer__factory,
} from '../typechain-types'
import { getMetaTxFunctionData, getMetaTxSignature } from './utils/nativeMetaTransaction'

describe('NativeMetaTransaction', () => {
  let deployer: SignerWithAddress
  let user: SignerWithAddress
  let extra: SignerWithAddress
  let NMTImplementorFactory: DummyNativeMetaTransactionImplementor__factory
  let nmtImplementor: DummyNativeMetaTransactionImplementor
  let RelayerFactory: DummyRelayer__factory
  let relayer: DummyRelayer

  beforeEach(async () => {
    ;[deployer, user, extra] = await ethers.getSigners()

    NMTImplementorFactory = await ethers.getContractFactory('DummyNativeMetaTransactionImplementor')
    nmtImplementor = await NMTImplementorFactory.connect(deployer).deploy()

    await nmtImplementor.connect(deployer).initialize()

    RelayerFactory = await ethers.getContractFactory('DummyRelayer')
    relayer = await RelayerFactory.connect(deployer).deploy(nmtImplementor.address)
  })

  describe('initialize', () => {
    it('should set eip712 name and version hash after initialize', async () => {
      NMTImplementorFactory = await ethers.getContractFactory('DummyNativeMetaTransactionImplementor')
      nmtImplementor = await NMTImplementorFactory.connect(deployer).deploy()

      let nameAndVersionHashes = await nmtImplementor.getNameAndVersionHash()

      expect(nameAndVersionHashes[0]).to.be.equal('0x0000000000000000000000000000000000000000000000000000000000000000')
      expect(nameAndVersionHashes[1]).to.be.equal('0x0000000000000000000000000000000000000000000000000000000000000000')

      await nmtImplementor.connect(deployer).initialize()

      nameAndVersionHashes = await nmtImplementor.getNameAndVersionHash()

      expect(nameAndVersionHashes[0]).to.be.equal('0x6bf9d3b058d3ba7d7532b3d9045ec9ccd0b6714f631fe5851085da8ac7079798')
      expect(nameAndVersionHashes[1]).to.be.equal('0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6')
    })

    it('should revert when initialized twice', async () => {
      await expect(nmtImplementor.initialize()).to.be.revertedWith('Initializable: contract is already initialized')
    })
  })

  describe('__NativeMetaTransaction_init', () => {
    it('should revert when called after initialization', async () => {
      await expect(nmtImplementor.test__NativeMetaTransaction_init()).to.be.revertedWith('Initializable: contract is not initializing')
    })
  })

  describe('_getMsgSender', () => {
    it('should extract the provided _userAddress instead of the msg.sender', async () => {
      const abi = ['function increaseCounter(uint256 _amount)']
      const metaTxFunctionData = getMetaTxFunctionData(abi, 'increaseCounter', [10])
      const metaTxSignature = await getMetaTxSignature(user, nmtImplementor, metaTxFunctionData)

      expect(await nmtImplementor.counter()).to.be.equal(0)
      expect(await nmtImplementor.increaseCounterCaller()).to.be.equal('0x0000000000000000000000000000000000000000')

      await nmtImplementor.connect(deployer).executeMetaTransaction(user.address, metaTxFunctionData, metaTxSignature)

      expect(await nmtImplementor.counter()).to.be.equal(10)
      expect(await nmtImplementor.increaseCounterCaller()).to.be.equal(user.address)
    })

    it('should return the msg.sender if msg.data does not have the address appended', async () => {
      expect(await nmtImplementor.counter()).to.be.equal(0)
      expect(await nmtImplementor.increaseCounterCaller()).to.be.equal('0x0000000000000000000000000000000000000000')

      await nmtImplementor.connect(extra).increaseCounter(20)

      expect(await nmtImplementor.counter()).to.be.equal(20)
      expect(await nmtImplementor.increaseCounterCaller()).to.be.equal(extra.address)
    })
  })

  describe('executeMetaTransaction', () => {
    it('should increase the contract counter using a meta transaction', async () => {
      const abi = ['function increaseCounter(uint256 _amount)']
      const metaTxFunctionData = getMetaTxFunctionData(abi, 'increaseCounter', [10])
      const metaTxSignature = await getMetaTxSignature(user, nmtImplementor, metaTxFunctionData)

      expect(await nmtImplementor.counter()).to.be.equal(0)

      await nmtImplementor.connect(deployer).executeMetaTransaction(user.address, metaTxFunctionData, metaTxSignature)

      expect(await nmtImplementor.counter()).to.be.equal(10)
    })

    it('should increase the user address nonce after a meta transaction', async () => {
      const abi = ['function increaseCounter(uint256 _amount)']
      const metaTxFunctionData = getMetaTxFunctionData(abi, 'increaseCounter', [10])
      const metaTxSignature = await getMetaTxSignature(user, nmtImplementor, metaTxFunctionData)

      expect(await nmtImplementor.nonces(user.address)).to.be.equal(0)

      await nmtImplementor.connect(deployer).executeMetaTransaction(user.address, metaTxFunctionData, metaTxSignature)

      expect(await nmtImplementor.nonces(user.address)).to.be.equal(1)
    })

    it('should return the relayed function transaction response data', async () => {
      const abi = ['function sum(uint256 _a, uint256 _b)']
      const metaTxFunctionData = getMetaTxFunctionData(abi, 'sum', [10, 20])
      const metaTxSignature = await getMetaTxSignature(user, nmtImplementor, metaTxFunctionData)

      let data = await relayer.data()

      expect(data).to.be.equal('0x')

      await relayer.connect(deployer).executeAndStoreMetaTransactionResult(user.address, metaTxFunctionData, metaTxSignature)

      data = await relayer.data()

      expect(data).to.be.equal('0x000000000000000000000000000000000000000000000000000000000000001e')
      expect(ethers.utils.defaultAbiCoder.decode(['uint256'], data)[0]).to.be.equal(30)
    })

    it('should revert with the relayed funcion revert message', async () => {
      const abi = ['function functionThatReverts()']
      const metaTxFunctionData = getMetaTxFunctionData(abi, 'functionThatReverts')
      const metaTxSignature = await getMetaTxSignature(user, nmtImplementor, metaTxFunctionData)

      const functionThatReverts = nmtImplementor.connect(deployer).executeMetaTransaction(user.address, metaTxFunctionData, metaTxSignature)

      await expect(functionThatReverts).to.be.revertedWith('ALWAYS_REVERTING_NEVER_INREVERTING')
    })

    it('should revert without a reason if the relayed function reverted silently', async () => {
      const abi = ['function functionThatRevertsSilently()']
      const metaTxFunctionData = getMetaTxFunctionData(abi, 'functionThatRevertsSilently')
      const metaTxSignature = await getMetaTxSignature(user, nmtImplementor, metaTxFunctionData)

      const functionThatRevertsSilently = nmtImplementor.connect(deployer).executeMetaTransaction(user.address, metaTxFunctionData, metaTxSignature)

      await expect(functionThatRevertsSilently).to.be.revertedWith(
        "Transaction reverted and Hardhat couldn't infer the reason. Please report this to help us improve Hardhat"
      )
    })

    it('should revert when the recovered signer is not the same as the one provided as _userAddress', async () => {
      const abi = ['function increaseCounter(uint256 _amount)']
      const metaTxFunctionData = getMetaTxFunctionData(abi, 'increaseCounter', [10])
      const metaTxSignature = await getMetaTxSignature(user, nmtImplementor, metaTxFunctionData)

      expect(await nmtImplementor.counter()).to.be.equal(0)

      const execute = nmtImplementor.connect(deployer).executeMetaTransaction(extra.address, metaTxFunctionData, metaTxSignature)

      await expect(execute).to.be.revertedWith('NativeMetaTransaction#executeMetaTransaction: SIGNER_AND_SIGNATURE_DO_NOT_MATCH')
    })
  })
})

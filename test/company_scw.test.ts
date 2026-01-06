import { expect } from 'chai';
import { network } from 'hardhat';
import {
  parseEther,
  toHex,
  encodeAbiParameters,
  parseAbiParameters,
  keccak256,
  type Hex,
  type Address,
} from 'viem';
import crypto from 'crypto';
import { describe, it } from 'node:test';

// --- Type Definitions ---

interface IP256Account {
  publicKey: crypto.KeyObject;
  privateKey: crypto.KeyObject;
  x: bigint;
  y: bigint;
}

interface IWebAuthnSignatureStruct {
  authenticatorData: Hex;
  clientDataJSON: Hex;
  challengeLocation: bigint;
  responseTypeLocation: bigint;
  r: bigint;
  s: bigint;
  pubKeyX: bigint;
  pubKeyY: bigint;
}

// --- Helper Functions ---

function generateP256KeyPair(): IP256Account {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
  });

  const jwk = publicKey.export({ format: 'jwk' });

  if (!jwk.x || !jwk.y) {
    throw new Error('Failed to export JWK coordinates');
  }

  const x = BigInt('0x' + Buffer.from(jwk.x, 'base64url').toString('hex'));
  const y = BigInt('0x' + Buffer.from(jwk.y, 'base64url').toString('hex'));

  return { publicKey, privateKey, x, y };
}

function signUserOpHash(userOpHash: Hex, account: IP256Account): IWebAuthnSignatureStruct {
  const challengeBase64 = Buffer.from(userOpHash.slice(2), 'hex')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  const clientDataJSONStr = `{"type":"webauthn.get","challenge":"${challengeBase64}","origin":"http://localhost:3000"}`;
  const clientDataJSONBuffer = Buffer.from(clientDataJSONStr, 'utf-8');
  const clientDataJSON = toHex(clientDataJSONBuffer);

  const challengeLocation = BigInt(clientDataJSONStr.indexOf(challengeBase64));
  const responseTypeLocation = BigInt(clientDataJSONStr.indexOf('webauthn.get'));

  const authenticatorDataBuffer = crypto.randomBytes(37);
  const authenticatorData = toHex(authenticatorDataBuffer);

  const clientDataHash = crypto.createHash('sha256').update(clientDataJSONBuffer).digest();
  const messageToSign = crypto
    .createHash('sha256')
    .update(Buffer.concat([authenticatorDataBuffer, clientDataHash]))
    .digest();

  const signature = crypto.sign(null, messageToSign, account.privateKey);

  let offset = 2;
  if (signature[1] & 0x80) offset += signature[1] & 0x7f;

  offset += 2;
  const rLen = signature[offset - 1];
  const rHex = signature.subarray(offset, offset + rLen).toString('hex');
  const r = BigInt('0x' + rHex);

  offset += rLen + 2;
  const sLen = signature[offset - 1];
  const sHex = signature.subarray(offset, offset + sLen).toString('hex');
  const s = BigInt('0x' + sHex);

  return {
    authenticatorData,
    clientDataJSON,
    challengeLocation,
    responseTypeLocation,
    r,
    s,
    pubKeyX: account.x,
    pubKeyY: account.y,
  };
}

function encodeMultiSig(signatures: IWebAuthnSignatureStruct[]): Hex {
  // ABI 定義需與 Solidity 結構完全一致
  // CompanySCW.validateUserOp 預期的是 WebAuthnSignature[]
  // 所以這裡 encodeAbiParameters 應該對應其參數結構
  const structAbi =
    '((bytes authenticatorData, bytes clientDataJSON, uint256 challengeLocation, uint256 responseTypeLocation, uint256 r, uint256 s, uint256 pubKeyX, uint256 pubKeyY)[])';

  return encodeAbiParameters(parseAbiParameters(structAbi), [[signatures]]);
}

// --- Tests ---

describe('CompanySCW (Multi-Sig)', function () {
  async function deployFixture() {
    const { viem } = await network.connect();
    const [relayer] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();
    const testClient = await viem.getTestClient();

    // 1. 部署 EntryPoint
    const entryPoint = await viem.deployContract('EntryPoint', []);

    // 2. 部署 Factory
    const factory = await viem.deployContract('SCWFactory', [entryPoint.address]);

    // 3. 準備 Keys
    const ownerA = generateP256KeyPair();
    const ownerB = generateP256KeyPair();
    const ownerC = generateP256KeyPair();

    const owners: IP256Account[] = [ownerA, ownerB, ownerC].sort((a, b) => {
      const hashA = keccak256(
        encodeAbiParameters(parseAbiParameters('uint256 x, uint256 y'), [a.x, a.y])
      );
      const hashB = keccak256(
        encodeAbiParameters(parseAbiParameters('uint256 x, uint256 y'), [b.x, b.y])
      );
      return BigInt(hashA) < BigInt(hashB) ? -1 : 1;
    });

    const ownersArg = owners.map((o) => [o.x, o.y]);
    const threshold = BigInt(2);
    const salt = BigInt(12345);

    // 4. 部署 Company Wallet
    await factory.write.createCompanyAccount([
      ownersArg,
      threshold,
      salt,
      'Test Company',
      'https://example.com/logo.png',
    ]);

    const companyAddress = (await factory.read.getCompanyAddress([
      ownersArg,
      threshold,
      salt,
    ])) as Address;
    const companySCW = await viem.getContractAt('CompanySCW', companyAddress as Address);

    await relayer.sendTransaction({
      to: companyAddress,
      value: parseEther('1.0'),
    });

    await companySCW.write.addDeposit([], { value: parseEther('0.5') });

    return {
      entryPoint,
      factory,
      companySCW,
      companyAddress,
      owners,
      threshold,
      relayer,
      publicClient,
      testClient,
    };
  }

  it('Should PASS with 2 valid sorted signatures (2-of-3)', async function () {
    const { viem } = await network.connect();
    const { companySCW, entryPoint, owners, testClient } = await deployFixture();

    const userOp = {
      sender: companySCW.address,
      nonce: BigInt(0),
      initCode: '0x' as Hex,
      callData: '0x' as Hex,
      callGasLimit: BigInt(100000),
      verificationGasLimit: BigInt(2000000),
      preVerificationGas: BigInt(50000),
      maxFeePerGas: BigInt(100),
      maxPriorityFeePerGas: BigInt(10),
      paymasterAndData: '0x' as Hex,
      signature: '0x' as Hex,
    };

    const userOpHash = (await entryPoint.read.getUserOpHash([userOp])) as Hex;

    const sig1 = signUserOpHash(userOpHash, owners[0]);
    const sig2 = signUserOpHash(userOpHash, owners[1]);

    const encodedSig = encodeMultiSig([sig1, sig2]);
    const userOpWithSig = { ...userOp, signature: encodedSig };

    await testClient.impersonateAccount({
      address: entryPoint.address,
    });

    const [deployer] = await viem.getWalletClients();
    await deployer.sendTransaction({ to: entryPoint.address, value: parseEther('1') });

    const validationResult = await companySCW.read.validateUserOp(
      [userOpWithSig, userOpHash, BigInt(0)],
      {
        account: entryPoint.address as Address,
      }
    );

    expect(validationResult).to.equal(BigInt(0));
  });

  it('Should FAIL with insufficient signatures (1-of-3)', async function () {
    const { companySCW, entryPoint, owners } = await deployFixture();

    const userOp = {
      sender: companySCW.address,
      nonce: BigInt(0),
      initCode: '0x' as Hex,
      callData: '0x' as Hex,
      callGasLimit: BigInt(100000),
      verificationGasLimit: BigInt(2000000),
      preVerificationGas: BigInt(50000),
      maxFeePerGas: BigInt(100),
      maxPriorityFeePerGas: BigInt(10),
      paymasterAndData: '0x' as Hex,
      signature: '0x' as Hex,
    };

    const userOpHash = (await entryPoint.read.getUserOpHash([userOp])) as Hex;

    const sig1 = signUserOpHash(userOpHash, owners[0]);
    const encodedSig = encodeMultiSig([sig1]);

    const userOpWithSig = { ...userOp, signature: encodedSig };

    const validationResult = await companySCW.read.validateUserOp(
      [userOpWithSig, userOpHash, BigInt(0)],
      {
        account: entryPoint.address as Address,
      }
    );

    expect(validationResult).to.equal(BigInt(1));
  });

  it('Should FAIL with duplicate signatures', async function () {
    const { companySCW, entryPoint, owners } = await deployFixture();

    const userOp = {
      sender: companySCW.address,
      nonce: BigInt(0),
      initCode: '0x' as Hex,
      callData: '0x' as Hex,
      callGasLimit: BigInt(100000),
      verificationGasLimit: BigInt(2000000),
      preVerificationGas: BigInt(50000),
      maxFeePerGas: BigInt(100),
      maxPriorityFeePerGas: BigInt(10),
      paymasterAndData: '0x' as Hex,
      signature: '0x' as Hex,
    };
    const userOpHash = (await entryPoint.read.getUserOpHash([userOp])) as Hex;

    const sig1 = signUserOpHash(userOpHash, owners[0]);
    const encodedSig = encodeMultiSig([sig1, sig1]);

    const userOpWithSig = { ...userOp, signature: encodedSig };

    const validationResult = await companySCW.read.validateUserOp(
      [userOpWithSig, userOpHash, BigInt(0)],
      {
        account: entryPoint.address as Address,
      }
    );

    expect(validationResult).to.equal(BigInt(1));
  });
});

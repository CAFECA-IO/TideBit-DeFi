import { expect } from 'chai';
import { network } from 'hardhat';
import { toHex, encodeAbiParameters, parseAbiParameters, keccak256, type Hex } from 'viem';
import crypto from 'crypto';
import { describe, it } from 'node:test'; // Info: (20260106 - Tzuhan) Hardhat 通常使用 Mocha，這裡保留 node:test，若環境是 Mocha 要改用 global describe/it

const { viem } = await network.connect();

// Info: (20260106 - Tzuahan) --- Type Definitions ---

interface IP256Account {
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

// Info: (20260106 - Tzuahan) --- Helper Functions ---

// Info: (20260107 - Tzuahan) 產生 P-256 密鑰對
function generateP256KeyPair(): IP256Account {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'P-256',
  });

  // Info: (20260107 - Tzuahan) 匯出 JWK 以獲取 x, y 座標
  const jwk = publicKey.export({ format: 'jwk' });
  const x = BigInt('0x' + Buffer.from(jwk.x!, 'base64url').toString('hex'));
  const y = BigInt('0x' + Buffer.from(jwk.y!, 'base64url').toString('hex'));

  return { privateKey, x, y };
}

function signUserOpHash(
  privateKey: crypto.KeyObject,
  userOpHash: Hex,
  pubKeyX: bigint,
  pubKeyY: bigint
): IWebAuthnSignatureStruct {
  /**
   * Info: (20260106 - Tzuahan) 1. 建構 clientDataJSON (包含 challenge = userOpHash)
   * 注意：合約中使用 Base64Url.encode 來還原 challenge，這裡我們模擬一個簡單的 JSON 結構
   * 為了讓合約驗證通過，我們需要確保 clientDataJSON 裡包含 base64url 編碼的 userOpHash
   */
  const challengeBase64 = Buffer.from(userOpHash.slice(2), 'hex').toString('base64url');

  const clientDataObj = {
    type: 'webauthn.get',
    challenge: challengeBase64,
    origin: 'http://localhost:3000',
    crossOrigin: false,
  };
  const clientDataJSONString = JSON.stringify(clientDataObj);
  const clientDataJSON = toHex(Buffer.from(clientDataJSONString));

  // Info: (20260106 - Tzuahan) 2. 建構 authenticatorData (模擬)
  const authenticatorData = toHex(Buffer.alloc(37)); // 32 bytes rpIdHash + flags + count

  // Info: (20260106 - Tzuahan) 3. 計算簽名訊息: sha256(authenticatorData || sha256(clientDataJSON))
  const clientDataHash = crypto
    .createHash('sha256')
    .update(Buffer.from(clientDataJSONString))
    .digest();
  const authDataBuffer = Buffer.from(authenticatorData.slice(2), 'hex');
  const signatureBase = Buffer.concat([authDataBuffer, clientDataHash]);

  // Info: (20260106 - Tzuahan) 4. 簽署
  const sign = crypto.createSign('SHA256');
  sign.update(signatureBase);
  sign.end();
  const signatureDer = sign.sign(privateKey); // DER 格式簽名

  // Info: (20260106 - Tzuahan) 5. 解析 DER 簽名取得 r, s
  // Info: (20260106 - Tzuahan) DER format: 0x30 || len || 0x02 || lenR || R || 0x02 || lenS || S
  const rLen = signatureDer[3];
  const rStart = 4;
  const rEnd = rStart + rLen;
  const sLen = signatureDer[rEnd + 1];
  const sStart = rEnd + 2;
  const r = BigInt('0x' + signatureDer.slice(rStart, rEnd).toString('hex'));
  const s = BigInt('0x' + signatureDer.slice(sStart, sStart + sLen).toString('hex'));

  // Info: (20260106 - Tzuahan) 6. 計算 Challenge 和 Type 在 clientDataJSON 中的位置
  // Info: (20260106 - Tzuahan) 這裡簡化處理，直接尋找字串索引 (真實應用需更嚴謹)
  const clientDataStr = Buffer.from(clientDataJSON.slice(2), 'hex').toString();
  const challengeLocation = clientDataStr.indexOf(challengeBase64);
  const responseTypeLocation = clientDataStr.indexOf('webauthn.get');

  return {
    authenticatorData,
    clientDataJSON,
    challengeLocation: BigInt(challengeLocation),
    responseTypeLocation: BigInt(responseTypeLocation),
    r,
    s,
    pubKeyX,
    pubKeyY,
  };
}

function getOwnerHash(x: bigint, y: bigint) {
  return keccak256(encodeAbiParameters(parseAbiParameters('uint256 x, uint256 y'), [x, y]));
}

// Info: (20260106 - Tzuahan) --- Tests ---

describe('CompanySCW (Multi-Sig)', function () {
  async function deployFixture() {
    const [deployer] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();

    /**
     * Info: (20260106 - Tzuahan) 1. 部署 Mock EntryPoint
     * 因為不需要完整 EntryPoint 功能，只需一個地址即可驗證 onlySelf 檢查
     * 但為了方便，我們這裡假設 deployer 的地址就是 EntryPoint，或者部署一個簡單合約
     * 為了測試 validateUserOp 的 require(msg.sender == entryPoint)，我們需要用該地址呼叫
     */
    const mockEntryPoint = deployer.account.address;

    // Info: (20260106 - Tzuahan) 2. 生成 3 組 P-256 密鑰
    const owner1 = generateP256KeyPair();
    const owner2 = generateP256KeyPair();
    const owner3 = generateP256KeyPair();
    const ownersData = [
      [owner1.x, owner1.y],
      [owner2.x, owner2.y],
      [owner3.x, owner3.y],
    ];

    // Info: (20260106 - Tzuahan)3. 部署 CompanySCW
    // Info: (20260106 - Tzuahan) 建構子參數需符合：address payable _entryPoint, uint256[][] memory _owners, uint256 _threshold
    const companySCW = await viem.deployContract('CompanySCW', [
      mockEntryPoint,
      ownersData,
      BigInt(2), // Info: (20260106 - Tzuahan) Threshold = 2
    ]);

    return {
      companySCW,
      mockEntryPoint,
      publicClient,
      owners: [owner1, owner2, owner3],
    };
  }
  it('Should PASS with 2 valid sorted signatures (2-of-3)', async function () {
    const { companySCW, mockEntryPoint, owners } = await deployFixture();

    /**
     * Info: (20260106 - Tzuahan)
     * --- 準備 UserOp ---
     * 這裡我們不需要完整的 UserOp 結構，只需要 validateUserOp 會用到的部分
     * 關鍵是 signature 欄位
     */
    const userOpHash = keccak256(toHex('test-user-op-hash'));

    // Info: (20260106 - Tzuahan) 選用 Owner 1 和 Owner 3 簽名
    const signers = [owners[0], owners[2]];

    // Info: (20260106 - Tzuahan) 產生簽名物件
    const rawSignatures = signers.map((owner) =>
      signUserOpHash(owner.privateKey, userOpHash, owner.x, owner.y)
    );

    /**
     * Info: (20260106 - Tzuahan) --- 關鍵步驟：排序 ---
     * 根據 keccak256(abi.encode(pubKeyX, pubKeyY)) 排序
     */
    rawSignatures.sort((a, b) => {
      const hashA = getOwnerHash(a.pubKeyX, a.pubKeyY);
      const hashB = getOwnerHash(b.pubKeyX, b.pubKeyY);
      return hashA < hashB ? -1 : hashA > hashB ? 1 : 0;
    });

    /**
     * Info: (20260106 - Tzuahan) --- 關鍵步驟：編碼 ---
     * 必須使用 abi.encode 對 Struct Array 進行編碼
     */
    const WebAuthnSignatureStruct = {
      components: [
        { name: 'authenticatorData', type: 'bytes' },
        { name: 'clientDataJSON', type: 'bytes' },
        { name: 'challengeLocation', type: 'uint256' },
        { name: 'responseTypeLocation', type: 'uint256' },
        { name: 'r', type: 'uint256' },
        { name: 's', type: 'uint256' },
        { name: 'pubKeyX', type: 'uint256' },
        { name: 'pubKeyY', type: 'uint256' },
      ],
      name: 'signatures',
      type: 'tuple[]',
    };

    const encodedSignature = encodeAbiParameters([WebAuthnSignatureStruct], [rawSignatures]);

    // Info: (20260106 - Tzuahan) 模擬 UserOperation
    const userOp = {
      sender: companySCW.address,
      nonce: BigInt(0),
      initCode: '0x' as Hex,
      callData: '0x' as Hex,
      callGasLimit: BigInt(100000),
      verificationGasLimit: BigInt(200000),
      preVerificationGas: BigInt(50000),
      maxFeePerGas: BigInt(100),
      maxPriorityFeePerGas: BigInt(10),
      paymasterAndData: '0x' as Hex,
      signature: encodedSignature, // Info: (20260106 - Tzuahan) 填入正確編碼的簽名
    };

    /**
     * Info: (20260106 - Tzuahan) --- 執行測試 ---
     * 使用 mockEntryPoint (deployer) 來呼叫，以通過 require(msg.sender == entryPoint)
     * 注意：validateUserOp 回傳 0 代表驗證成功 (SIG_VALIDATION_SUCCESS)
     */
    const validationResult = await companySCW.read.validateUserOp([userOp, userOpHash, BigInt(0)], {
      account: mockEntryPoint,
    });

    expect(validationResult).to.equal(BigInt(0));
  });

  it('Should FAIL with insufficient signatures (1-of-3)', async function () {
    const { companySCW, mockEntryPoint, owners } = await deployFixture();
    const userOpHash = keccak256(toHex('test-hash-2'));

    // Info: (20260106 - Tzuahan) 只用 1 個簽名
    const signers = [owners[0]];
    const rawSignatures = signers.map((owner) =>
      signUserOpHash(owner.privateKey, userOpHash, owner.x, owner.y)
    );

    // Info: (20260106 - Tzuahan) 編碼
    const WebAuthnSignatureStruct = {
      components: [
        { name: 'authenticatorData', type: 'bytes' },
        { name: 'clientDataJSON', type: 'bytes' },
        { name: 'challengeLocation', type: 'uint256' },
        { name: 'responseTypeLocation', type: 'uint256' },
        { name: 'r', type: 'uint256' },
        { name: 's', type: 'uint256' },
        { name: 'pubKeyX', type: 'uint256' },
        { name: 'pubKeyY', type: 'uint256' },
      ],
      name: 'signatures',
      type: 'tuple[]',
    };

    const encodedSignature = encodeAbiParameters([WebAuthnSignatureStruct], [rawSignatures]);

    const userOp = {
      sender: companySCW.address,
      nonce: BigInt(0),
      initCode: '0x' as Hex,
      callData: '0x' as Hex,
      callGasLimit: BigInt(100000),
      verificationGasLimit: BigInt(200000),
      preVerificationGas: BigInt(50000),
      maxFeePerGas: BigInt(100),
      maxPriorityFeePerGas: BigInt(10),
      paymasterAndData: '0x' as Hex,
      signature: encodedSignature,
    };

    const validationResult = await companySCW.read.validateUserOp([userOp, userOpHash, BigInt(0)], {
      account: mockEntryPoint,
    });

    // Info: (20260106 - Tzuahan) 預期失敗：回傳 1 (SIG_VALIDATION_FAILED)
    expect(validationResult).to.equal(BigInt(1));
  });

  it('Should FAIL with unsorted signatures', async function () {
    const { companySCW, mockEntryPoint, owners } = await deployFixture();
    const userOpHash = keccak256(toHex('test-hash-3'));

    // Info: (20260106 - Tzuahan) 故意製造未排序的簽名
    // Info: (20260106 - Tzuahan) 先找出 Hash 較大的和較小的
    const sig1 = signUserOpHash(owners[0].privateKey, userOpHash, owners[0].x, owners[0].y);
    const sig2 = signUserOpHash(owners[1].privateKey, userOpHash, owners[1].x, owners[1].y);

    const hash1 = getOwnerHash(sig1.pubKeyX, sig1.pubKeyY);
    const hash2 = getOwnerHash(sig2.pubKeyX, sig2.pubKeyY);

    // Info: (20260106 - Tzuahan) 讓大的排在前面 (錯誤順序)
    let rawSignatures;
    if (hash1 > hash2) {
      rawSignatures = [sig1, sig2];
    } else {
      rawSignatures = [sig2, sig1];
    }

    const WebAuthnSignatureStruct = {
      components: [
        { name: 'authenticatorData', type: 'bytes' },
        { name: 'clientDataJSON', type: 'bytes' },
        { name: 'challengeLocation', type: 'uint256' },
        { name: 'responseTypeLocation', type: 'uint256' },
        { name: 'r', type: 'uint256' },
        { name: 's', type: 'uint256' },
        { name: 'pubKeyX', type: 'uint256' },
        { name: 'pubKeyY', type: 'uint256' },
      ],
      name: 'signatures',
      type: 'tuple[]',
    };

    const encodedSignature = encodeAbiParameters([WebAuthnSignatureStruct], [rawSignatures]);

    const userOp = {
      sender: companySCW.address,
      nonce: BigInt(0),
      initCode: '0x' as Hex,
      callData: '0x' as Hex,
      callGasLimit: BigInt(100000),
      verificationGasLimit: BigInt(200000),
      preVerificationGas: BigInt(50000),
      maxFeePerGas: BigInt(100),
      maxPriorityFeePerGas: BigInt(10),
      paymasterAndData: '0x' as Hex,
      signature: encodedSignature,
    };

    const validationResult = await companySCW.read.validateUserOp([userOp, userOpHash, BigInt(0)], {
      account: mockEntryPoint,
    });

    // Info: (20260106 - Tzuahan) 預期失敗：回傳 1
    expect(validationResult).to.equal(BigInt(1));
  });
});

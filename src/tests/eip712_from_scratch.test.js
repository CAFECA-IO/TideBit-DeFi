const {ethers} = require('ethers');

const wallet = new ethers.Wallet(
  '9a0b942d6c06d8c0f751bb8a961fa1f41773988ee7888a74d12c9e0925bae3f8'
);
// 9a0b942d6c06d8c0f751bb8a961fa1f41773988ee7888a74d12c9e0925bae3f8

const domain = {
  name: 'TideBit DeFi',
  version: '0.8.15',
  chainId: 1,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  salt: '0x' + '0000000000000000000000000000000000000000000000000000000000000002',
};

// The named list of all type definitions
const types = {
  Person: [
    {name: 'name', type: 'string'},
    {name: 'wallet', type: 'address'},
  ],
  Mail: [
    {name: 'from', type: 'Person'},
    {name: 'to', type: 'Person'},
    {name: 'contents', type: 'string'},
  ],
};

// The data to sign
// '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
const value = {
  from: {
    name: 'User',
    wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
  },
  to: {
    name: 'TideBit DeFi',
    wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
  },
  contents: 'Agree to the terms and conditions',
};

test('sign and verify EIP 712 signature via ethers high level function', () => {
  // sign and verify EIP 712 signature via ethers high level function

  async function test4() {
    const eip712signature = await wallet._signTypedData(domain, types, value);
    // console.log('[verified] eip712 from ethers', eip712signature);
    const recoveredAddress = ethers.utils.verifyTypedData(domain, types, value, eip712signature);
    // console.log('recoveredAddress', recoveredAddress);
    expect(recoveredAddress).toEqual(wallet.address);
  }

  test4();
});

test('sign and verify EIP 712 signature via ethers low level function', () => {
  // sign and verify EIP 712 signature via ethers low level function

  async function test5() {
    const stringifiedData = JSON.stringify(domain, types, value);
    // const stringifiedTypes = JSON.stringify(types);
    // const stringifiedValue = JSON.stringify(value);
    // console.log('json to string', stringifiedData);

    const bytes = ethers.utils.toUtf8Bytes(stringifiedData);
    // console.log('string to bytes', bytes);

    const hash = ethers.utils.keccak256(bytes);
    // console.log('bytes to hash', hash);

    const eip712signature = await wallet.signMessage(hash);
    // console.log('eip712 signature', eip712signature);

    const digest = ethers.utils.arrayify(hash);
    // console.log('digest', digest);

    const recoveredAddress = ethers.utils.verifyTypedData(domain, types, value, eip712signature);
    // console.log('recoverAddress', recoveredAddress);
  }

  test5();
});

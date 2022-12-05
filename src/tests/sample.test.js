const {ethers} = require('ethers');

// const PRIVATE_KEY = process.env.TEST_WALLET_PRIVATE_KEY.toString();

// TODO: Test 1
// (async function () {
//   // yarn ganache-cli -p 8545 -d
//   const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
//   const signer = provider.getSigner();

//   // 0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1
//   const ethAddress = await signer.getAddress();
//   const hash = await ethers.utils.keccak256(ethAddress);
//   const sig = await signer.signMessage(ethers.utils.arrayify(hash));
//   const pk = ethers.utils.recoverPublicKey(hash, sig);

//   // 0x3dfB86Ee0e620A3E5B88195792e1B1f8B0A08cff
//   const recoveredAddress = ethers.utils.computeAddress(ethers.utils.arrayify(pk));
//   // Throwing here
//   if (recoveredAddress != ethAddress) {
//     throw Error(
//       `Address recovered do not match, original ${ethAddress} versus computed ${recoveredAddress}`
//     );
//   }
// })();

// // // TODO: Test 2
// async function test2() {
//   const provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
//   const wallet = provider.getSigner();
//   const actualPublicKey = await wallet.getPublicKey();
//   console.log('actualPublicKey', actualPublicKey);

//   const message = 'Test message';
//   const signature = await wallet.signMessage(message);
//   const eip712signature = await wallet._signTypedData(domain, types, value);
//   // Arrayify the message if you want the bytes to be used as the message
//   const digest = arrayify(hashMessage(message));
//   const recoveredAddress = recoverAddress(digest, signature);

//   expect(recoveredAddress).eq(wallet.address);
// }

// TODO: Notes!
// async function test3() {
//   // Issue a signature
//   const wallet = new ethers.Wallet(
//     '0x0123456789012345678901234567890123456789012345678901234567890123'
//   );
//   // const wallet = Wallet.fromMnemonic(MNEMONIC, PATH);
//   const message = 'Hello dapp';
//   const signature = await wallet.signMessage(message);
//   const expectedAddress = await wallet.getAddress();
//   const expectedPublicKey = wallet.publicKey;

//   console.log('ISSUING SIGNATURE');
//   console.log('ADDR:    ', expectedAddress);
//   console.log('PUB K:   ', expectedPublicKey);
//   console.log('SIG      ', signature);

//   // Approach 1
//   const actualAddress = ethers.utils.verifyMessage(message, signature);

//   console.log('APPROACH 1');
//   console.log('EXPECTED ADDR: ', expectedAddress);
//   console.log('ACTUAL ADDR:   ', actualAddress);

//   // Approach 2
//   const msgHash = ethers.utils.hashMessage(message);
//   const msgHashBytes = ethers.utils.arrayify(msgHash);

//   // Now you have the digest,
//   const recoveredPubKey = ethers.utils.recoverPublicKey(msgHashBytes, signature);
//   const recoveredAddress = ethers.utils.recoverAddress(msgHashBytes, signature);

//   const matches = expectedPublicKey === recoveredPubKey;

//   console.log('APPROACH 2');
//   console.log('EXPECTED ADDR:    ', expectedAddress);
//   console.log('RECOVERED ADDR:   ', recoveredAddress);

//   console.log('EXPECTED PUB K:   ', expectedPublicKey);
//   console.log('RECOVERED PUB K:  ', recoveredPubKey);

//   console.log('SIGNATURE VALID:  ', matches);
// }

// TODO: Working
// async function test4() {
//   const wallet = new ethers.Wallet(
//     '9a0b942d6c06d8c0f751bb8a961fa1f41773988ee7888a74d12c9e0925bae3f8'
//   );
//   const eip712signature = await wallet._signTypedData(domain, types, value);
//   const recoveredAddress = ethers.utils.verifyTypedData(domain, types, value, eip712signature);
//   console.log('recoveredAddress', recoveredAddress);
//   expect(recoveredAddress).toEqual(wallet.address);
// }

// test2();

// test3();
// test4();

test('Check EIP712 signature by Metamask', async () => {
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
  // const wallet = new ethers.Wallet(
  //   '9a0b942d6c06d8c0f751bb8a961fa1f41773988ee7888a74d12c9e0925bae3f8'
  // );
  // const eip712signature = await wallet._signTypedData(domain, types, value);
  const eip712signature =
    '0x0b38434b938c769857a43c6c46815693e00cef60a6a1198e9e0ea1cf3960de1776b13683ad25c285b3e86abffc0ace7e2136a5f1cbacb848fb266689bad4f6411b';

  const recoveredAddress = ethers.utils.verifyTypedData(domain, types, value, eip712signature);

  // console.log('recoveredAddress', recoveredAddress);
  expect(recoveredAddress).toEqual('0xb54898DB1250A6a629E5B566367E9C60a7Dd6C30');
});

test('Check the result of 5 + 2', () => {
  expect(5 + 2).toBe(7);
});

/* eslint-disable no-console */
const {ethers} = require('ethers');

const signer = new ethers.Wallet(
  '9a0b942d6c06d8c0f751bb8a961fa1f41773988ee7888a74d12c9e0925bae3f8'
);
// 9a0b942d6c06d8c0f751bb8a961fa1f41773988ee7888a74d12c9e0925bae3f8

const domain = {
  // Defining the chain aka Rinkeby testnet or Ethereum Main Net
  chainId: '0x1',
  // Give a user friendly name to the specific contract you are signing for.
  name: 'TideBit-DeFi Create CFD Order',
  // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
  verifyingContract: '0xCAFECA5CCD019431B17B132e45e6638Ee2397be8',
  // Just let's you know the latest version. Definitely make sure the field name is correct.
  version: 'v1.0.0',
};

// const _types = {
//   CreateCFDOrderData: {
//     "name": "CreateCFDOrderData",
//     "type": "struct",
//     "properties": [
//       { name: 'ticker', type: 'string' },
//       { name: 'quotation', type: 'Quotation' },
//       { name: 'typeOfPosition', type: 'string' },
//       { name: 'price', type: 'uint256' },
//       { name: 'amount', type: 'string' },
//       { name: 'targetAsset', type: 'string' },
//       { name: 'uniAsset', type: 'string' },
//       { name: 'margin', type: 'Margin' },
//       { name: 'leverage', type: 'uint256' },
//       { name: 'liquidationPrice', type: 'uint256' },
//       { name: 'liquidationTime', type: 'uint256' },
//       { name: 'fee', type: 'uint256' },
//       { name: 'createTimestamp', type: 'uint256' },
//       { name: 'takeProfit', type: 'uint256', optional: true },
//       { name: 'stopLoss', type: 'uint256', optional: true },
//       { name: 'guaranteedStop', type: 'bool', optional: true },
//       { name: 'guaranteedStopFee', type: 'uint256', optional: true },
//       { name: 'remark', type: 'string', optional: true },
//     ]
//   }, Margin: {
//     "name": "Margin",
//     "type": "struct",
//     "properties": [
//       { name: 'asset', type: 'string' },
//       { name: 'amount', type: 'uint256' },
//     ]
//   }, Quotation: {
//     "name": "Quotation",
//     "type": "struct",
//     "properties": [
//       { name: 'ticker', type: 'string' },
//       { name: 'targetAsset', type: 'string' },
//       { name: 'uniAsset', type: 'string' },
//       { name: 'price', type: 'uint256' },
//       { name: 'deadline', type: 'uint256' },
//       { name: 'signature', type: 'string' },
//     ]
//   }
// }

test('sign CFDOrderCreate high level function', () => {
  const types = {
    CreateCFDOrderData: [
      {name: 'ticker', type: 'string'},
      {name: 'quotation', type: 'Quotation'},
      {name: 'typeOfPosition', type: 'string'},
      {name: 'price', type: 'uint256'},
      {name: 'amount', type: 'string'},
      {name: 'targetAsset', type: 'string'},
      {name: 'uniAsset', type: 'string'},
      {name: 'margin', type: 'Margin'},
      {name: 'leverage', type: 'uint256'},
      {name: 'liquidationPrice', type: 'uint256'},
      {name: 'liquidationTime', type: 'uint256'},
      {name: 'fee', type: 'uint256'},
      {name: 'createTimestamp', type: 'uint256'},
    ],
    Margin: [
      {name: 'asset', type: 'string'},
      {name: 'amount', type: 'uint256'},
    ],
    Quotation: [
      {name: 'ticker', type: 'string'},
      {name: 'targetAsset', type: 'string'},
      {name: 'uniAsset', type: 'string'},
      {name: 'price', type: 'uint256'},
      {name: 'deadline', type: 'uint256'},
      {name: 'signature', type: 'string'},
    ],
  };

  const message = {
    ticker: 'ETH-USDT',
    typeOfPosition: 'BUY',
    price: 21023,
    amount: 2,
    targetAsset: 'ETH',
    uniAsset: 'USDT',
    leverage: 5,
    margin: {
      asset: 'BTC',
      amount: 112,
    },
    liquidationPrice: 19083,
    liquidationTime: Math.ceil(Date.now() / 1000) + 86400,
    createTimestamp: Math.ceil(Date.now()),
    fee: 0,
    quotation: {
      ticker: 'ETH-USDT',
      targetAsset: 'ETH',
      uniAsset: 'USDT',
      price: 21023,
      deadline: Math.ceil(Date.now() / 1000) + 15,
      signature: '0x',
    },
  };

  async function test() {
    const eip712signature = await signer._signTypedData(domain, types, message);
    // eip712signature = 0x75cc63d3fbd0fbf8e6dbfa88885b7126a96fc2e983edb7b14eafbe9cc13b89e456ed84696b5d350ae40b35e8b51c8a262d6459082eb67a461c660b2435da82da1b
    console.log('eip712signature', eip712signature);
    const recoveredAddress = ethers.utils.verifyTypedData(domain, types, message, eip712signature);
    // recoveredAddress = 0xb54898DB1250A6a629E5B566367E9C60a7Dd6C30
    console.log('recoveredAddress', recoveredAddress);
    expect(recoveredAddress).toEqual(signer.address);
  }

  test();
});

// test('sign optional property', () => {
//   const types = {
//     CreateCFDOrderData: [
//       { name: 'ticker', type: 'string' },
//       { name: 'quotation', type: 'Quotation' },
//       { name: 'typeOfPosition', type: 'string' },
//       { name: 'price', type: 'uint256' },
//       { name: 'amount', type: 'string' },
//       { name: 'targetAsset', type: 'string' },
//       { name: 'uniAsset', type: 'string' },
//       { name: 'margin', type: 'Margin' },
//       { name: 'leverage', type: 'uint256' },
//       { name: 'liquidationPrice', type: 'uint256' },
//       { name: 'liquidationTime', type: 'uint256' },
//       { name: 'fee', type: 'uint256' },
//       { name: 'createTimestamp', type: 'uint256' },
//       { name: 'takeProfit', type: 'uint256', optional: true },
//       { name: 'stopLoss', type: 'uint256', optional: true },
//       { name: 'guaranteedStop', type: 'bool', optional: true },
//       { name: 'guaranteedStopFee', type: 'uint256', optional: true },
//       { name: 'remark', type: 'string', optional: true },
//     ],
//     Margin: [
//       { name: 'asset', type: 'string' },
//       { name: 'amount', type: 'uint256' },
//     ],
//     Quotation: [
//       { name: 'ticker', type: 'string' },
//       { name: 'targetAsset', type: 'string' },
//       { name: 'uniAsset', type: 'string' },
//       { name: 'price', type: 'uint256' },
//       { name: 'deadline', type: 'uint256' },
//       { name: 'signature', type: 'string' },
//     ],
//   };

//   const message = {
//     ticker: 'ETH',
//     typeOfPosition: 'BUY',
//     price: 21023,
//     amount: 2,
//     targetAsset: 'ETH',
//     uniAsset: 'USDT',
//     leverage: 5,
//     margin: {
//       asset: 'BTC',
//       amount: 112,
//     },
//     liquidationPrice: 19083,
//     liquidationTime: Math.ceil(Date.now() / 1000) + 86400,
//     createTimestamp: Math.ceil(Date.now()),
//     fee: 0,
//     quotation: {
//       ticker: 'ETH',
//       targetAsset: 'ETH',
//       uniAsset: 'USDT',
//       price: 21023,
//       deadline: Math.ceil(Date.now() / 1000) + 15,
//       signature: '0x',
//     },
//     takeProfit: null,
//     stopLoss: null,
//     guaranteedStop: null,
//     guaranteedStopFee: null,
//     remark: null,
//   };

//   async function test() {
//     const data = {
//       jsonrpc: '2.0',
//       method: 'eth_signTypedData',
//       params: [
//         '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
//         {
//           types: {
//             EIP712Domain: [
//               { name: 'name', type: 'string' },
//               { name: 'version', type: 'string' },
//               { name: 'chainId', type: 'uint256' },
//               { name: 'verifyingContract', type: 'address' },
//             ],
//             Person: [
//               { name: 'name', type: 'string' },
//               { name: 'wallet', type: 'address' },
//             ],
//             Mail: [
//               { name: 'from', type: 'Person' },
//               { name: 'to', type: 'Person' },
//               { name: 'contents', type: 'string' },
//             ],
//           },
//           primaryType: 'Mail',
//           domain: {
//             name: 'Ether Mail',
//             version: '1',
//             chainId: 1,
//             verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
//           },
//           message: {
//             from: { name: 'Cow', wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826' },
//             to: { name: 'Bob', wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB' },
//             contents: 'Hello, Bob!',
//           },
//         },
//       ],
//       id: 1,
//     };
//     const provider = new ethers.providers.JsonRpcProvider(
//       'https://mainnet.infura.io/v3/<INFURA-PROJECT-ID>'
//     );

//     const address = await signer.getAddress();
//     const nonce = await provider.getTransactionCount(address, 'latest');

//     console.log('nonce', nonce);
//     expect(nonce).toEqual(1);
//   }

//   test();
// });

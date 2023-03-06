import IEIP712Data from '../../interfaces/ieip712data';

const CFDOrderCreate: IEIP712Data = {
  domain: {
    // Defining the chain aka Rinkeby testnet or Ethereum Main Net
    chainId: '0x1',
    // Give a user friendly name to the specific contract you are signing for.
    name: 'TideBit-DeFi Create CFD Order',
    // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
    verifyingContract: '0xCAFECA5CCD019431B17B132e45e6638Ee2397be8',
    // Just let's you know the latest version. Definitely make sure the field name is correct.
    version: 'v1.0.0',
  },
  // Refers to the keys of the *types* object below.
  primaryType: 'CreateCFDOrderData',
  types: {
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
      {name: 'takeProfit', type: 'uint256'},
      {name: 'stopLoss', type: 'uint256'},
      {name: 'guaranteedStop', type: 'bool'},
      {name: 'guaranteedStopFee', type: 'uint256'},
      {name: 'remark', type: 'string'},
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
  },
  // Defining the message signing data content.
  message: {
    /*
      - Anything you want. Just a JSON Blob that encodes the data you want to send
      - No required fields
      - This is DApp Specific
      - Be as explicit as possible when building out the message schema.
      */
    ticker: 'ETH',
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
    // takeProfit: 74521,
    // stopLoss: 25250,
    createTimestamp: Math.ceil(Date.now()),
    fee: 0,
    quotation: {
      ticker: 'ETH',
      targetAsset: 'ETH',
      uniAsset: 'USDT',
      price: 21023,
      deadline: Math.ceil(Date.now() / 1000) + 15,
      signature: '0x',
    },
    // takeProfit: null,
    // stopLoss: null,
    // guaranteedStop: null,
    // guaranteedStopFee: null,
    // remark: null,
  },
};

export default CFDOrderCreate;
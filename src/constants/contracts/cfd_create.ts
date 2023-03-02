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
    // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
    EIP712Domain: [
      {name: 'name', type: 'string'},
      {name: 'version', type: 'string'},
      {name: 'chainId', type: 'string'},
      {name: 'verifyingContract', type: 'address'},
    ],
    Quotation: [
      {name: 'ticker', type: 'string'},
      {name: 'targetAsset', type: 'string'},
      {name: 'uniAsset', type: 'string'},
      {name: 'price', type: 'number'},
      {name: 'deadline', type: 'number'},
      {name: 'signature', type: 'string'},
    ],
    Margin: [
      {name: 'asset', type: 'string'},
      {name: 'amount', type: 'number'},
    ],
    CreateCFDOrderData: [
      {name: 'ticker', type: 'string'},
      {name: 'quotation', type: 'Quotation'},
      {name: 'typeOfPosition', type: 'string'},
      {name: 'price', type: 'number'},
      {name: 'amount', type: 'number'},
      {name: 'targetAsset', type: 'string'},
      {name: 'uniAsset', type: 'string'},
      {name: 'margin', type: 'Margin'},
      {name: 'leverage', type: 'number'},
      {name: 'liquidationPrice', type: 'number'},
      {name: 'liquidationTime', type: 'number'},
      {name: 'takeProfit', type: 'number'},
      {name: 'stopLoss', type: 'number'},
      {name: 'fee', type: 'number'},
      {name: 'guaranteedStop', type: 'boolean'},
      {name: 'guaranteedStopFee', type: 'number'},
      {name: 'createTimestamp', type: 'number'},
      {name: 'remark', type: 'string'},
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
    amount: 1.8,
    typeOfPosition: 'BUY',
    leverage: 5,
    price: 21023,
    targetAsset: 'ETH',
    uniAsset: 'USDT',
    margin: {
      asset: 'BTC',
      amount: 112,
    },
    takeProfit: 74521,
    stopLoss: 25250,
    fee: 0,
    quotation: {
      ticker: 'ETH',
      targetAsset: 'ETH',
      uniAsset: 'USDT',
      price: 21023,
      deadline: Date.now() / 1000 + 15,
      signature: '0x',
    },
    liquidationPrice: 19083,
    liquidationTime: Date.now() / 1000 + 86400,
  },
};

export default CFDOrderCreate;

import IEIP712Data from '../../interfaces/ieip712data';

const CFDOrderUpdate: IEIP712Data = {
  domain: {
    // Defining the chain aka Rinkeby testnet or Ethereum Main Net
    chainId: '0x1',
    // Give a user friendly name to the specific contract you are signing for.
    name: 'TideBit-DeFi',
    // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
    verifyingContract: '0xCAFECA5CCD019431B17B132e45e6638Ee2397be8',
    // Just let's you know the latest version. Definitely make sure the field name is correct.
    version: 'v1.0.0',
  },
  // Refers to the keys of the *types* object below.
  primaryType: 'UpdateCFDOrderData',
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
    UpdateCFDOrderData: [
      {name: 'orderId', type: 'string'},
      {name: 'takeProfit', type: 'number'},
      {name: 'stopLoss', type: 'number'},
      {name: 'guaranteedStop', type: 'boolean'},
      {name: 'guaranteedStopFee', type: 'number'},
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
    orderId: `TB${new Date().getFullYear()}${
      new Date().getMonth() + 1
    }${new Date().getDate()}${new Date().getSeconds()}ETH`,
    takeProfit: 71232,
    stopLoss: 10992,
    guaranteedStop: true,
    guaranteedStopFee: 0.81,
  },
};

export default CFDOrderUpdate;

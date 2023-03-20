import IEIP712Data from '../../interfaces/ieip712data';

const CFDOrderClose: IEIP712Data = {
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
  primaryType: 'CloseCFDOrderData',
  types: {
    // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
    CloseCFDOrderData: [
      {name: 'orderId', type: 'string'},
      {name: 'quotation', type: 'Quotation'},
      {name: 'closePrice', type: 'uint256'},
      {name: 'closeTimestamp', type: 'uint256'},
    ],
    Quotation: [
      {name: 'ticker', type: 'string'},
      {name: 'targetAsset', type: 'string'},
      {name: 'unitAsset', type: 'string'},
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
    orderId: `TB202303020001ETH`,
    quotation: {
      ticker: 'ETH',
      targetAsset: 'ETH',
      unitAsset: 'USDT',
      price: 21023,
      deadline: Math.ceil(Date.now() / 1000) + 15,
      signature: '0x',
    },
    closePrice: 71232,
    closeTimestamp: Math.ceil(Date.now() / 1000) + 86400,
    guaranteedStopFee: Math.ceil(Date.now() / 1000) + 86400,
  },
};

export default CFDOrderClose;

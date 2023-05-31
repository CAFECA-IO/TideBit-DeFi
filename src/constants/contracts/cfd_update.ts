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
    // Refer to PrimaryType
    UpdateCFDOrderData: [
      {name: 'referenceId', type: 'string'},
      {name: 'takeProfit', type: 'uint256'},
      {name: 'stopLoss', type: 'uint256'},
      {name: 'guaranteedStop', type: 'bool'},
      {name: 'guaranteedStopFee', type: 'uint256'},
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
    referenceId: `TB202303020001ETH`,
    takeProfit: 71232,
    stopLoss: 10992,
    guaranteedStop: true,
    guaranteedStopFee: 81,
  },
};

export default CFDOrderUpdate;

import IEIP712Data from '../../interfaces/ieip712data';
import {getTimestamp} from '../../lib/common';

const Withdraw: IEIP712Data = {
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
  primaryType: 'Withdraw',
  types: {
    Withdraw: [
      {name: 'createTimestamp', type: 'uint256'},
      {name: 'targetAsset', type: 'string'},
      {name: 'targetAmount', type: 'uint256'},
      {name: 'from', type: 'string'},
      {name: 'remark', type: 'string'},
      {name: 'fee', type: 'uint256'},
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
    createTimestamp: getTimestamp(),
    targetAsset: 'USDT',
    targetAmount: 1,
    to: '0x',
    remark: '',
    fee: 0,
  },
};

export default Withdraw;

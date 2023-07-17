import {IDomain, ITypes} from '../../interfaces/ieip712data';

export const EIP712_DOMAIN: IDomain = {
  chainId: '0x1',
  name: 'TideBit-DeFi',
  verifyingContract: '0xCAFECA5CCD019431B17B132e45e6638Ee2397be8',
  version: 'v1.0.0',
};

export const EIP712_TYPES: ITypes = {
  CreateCFDOrderData: [
    {name: 'ticker', type: 'string'},
    {name: 'quotation', type: 'Quotation'},
    {name: 'typeOfPosition', type: 'string'},
    {name: 'price', type: 'uint256'},
    {name: 'amount', type: 'string'},
    {name: 'targetAsset', type: 'string'},
    {name: 'unitAsset', type: 'string'},
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
  CloseCFDOrderData: [
    {name: 'referenceId', type: 'string'},
    {name: 'quotation', type: 'Quotation'},
    {name: 'closePrice', type: 'uint256'},
    {name: 'closeTimestamp', type: 'uint256'},
  ],
  Margin: [
    {name: 'asset', type: 'string'},
    {name: 'amount', type: 'uint256'},
  ],
  Quotation: [
    {name: 'ticker', type: 'string'},
    {name: 'targetAsset', type: 'string'},
    {name: 'unitAsset', type: 'string'},
    {name: 'price', type: 'uint256'},
    {name: 'deadline', type: 'uint256'},
    {name: 'signature', type: 'string'},
  ],
  UpdateCFDOrderData: [
    {name: 'referenceId', type: 'string'},
    {name: 'takeProfit', type: 'uint256'},
    {name: 'stopLoss', type: 'uint256'},
    {name: 'guaranteedStop', type: 'bool'},
    {name: 'guaranteedStopFee', type: 'uint256'},
  ],
  Withdraw: [
    {name: 'createTimestamp', type: 'uint256'},
    {name: 'targetAsset', type: 'string'},
    {name: 'targetAmount', type: 'uint256'},
    {name: 'from', type: 'string'},
    {name: 'remark', type: 'string'},
    {name: 'fee', type: 'uint256'},
  ],
};

export const EIP712_PRIMARY_TYPE_CREATE = 'CreateCFDOrderData';
export const EIP712_PRIMARY_TYPE_CLOSE = 'CloseCFDOrderData';
export const EIP712_PRIMARY_TYPE_UPDATE = 'UpdateCFDOrderData';
export const EIP712_PRIMARY_TYPE_WITHDRAW = 'Withdraw';

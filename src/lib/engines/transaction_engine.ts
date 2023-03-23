import keccak from '@cafeca/keccak';
import SafeMath from '../safe_math';
import CFDOrderClose from '../../constants/contracts/cfd_close';
import CFDOrderCreate from '../../constants/contracts/cfd_create';
import CFDOrderUpdate from '../../constants/contracts/cfd_update';
import Withdraw from '../../constants/contracts/withdraw';
import {CFDOrderType} from '../../constants/cfd_order_type';
import {IApplyCFDOrder} from '../../interfaces/tidebit_defi_background/apply_cfd_order';
import {IApplyCloseCFDOrderData} from '../../interfaces/tidebit_defi_background/apply_close_cfd_order_data';
import {IApplyUpdateCFDOrderData} from '../../interfaces/tidebit_defi_background/apply_update_cfd_order_data';
import {IApplyCreateCFDOrderData} from '../../interfaces/tidebit_defi_background/apply_create_cfd_order_data';
import {IApplyDepositOrder} from '../../interfaces/tidebit_defi_background/apply_deposit_order';
import {IApplyWithdrawOrder} from '../../interfaces/tidebit_defi_background/apply_withdraw_order';
import {IResult} from '../../interfaces/tidebit_defi_background/result';
import {Code} from '../../constants/code';
import {getTimestamp, toIJSON} from '../common';

class TransactionEngine {
  isApplyCreateCFDOrderData(obj: object): obj is IApplyCreateCFDOrderData {
    return (
      obj instanceof Object &&
      'ticker' in obj &&
      'quotation' in obj &&
      'typeOfPosition' in obj &&
      'price' in obj &&
      'amount' in obj &&
      'targetAsset' in obj &&
      'unitAsset' in obj &&
      'margin' in obj &&
      'leverage' in obj &&
      'liquidationPrice' in obj &&
      'liquidationTime' in obj
    );
  }
  isApplyUpdateCFDOrderData(obj: object): obj is IApplyUpdateCFDOrderData {
    return obj instanceof Object && 'orderId' in obj;
  }
  isApplyCloseCFDOrderData(obj: object): obj is IApplyCloseCFDOrderData {
    return obj instanceof Object && 'orderId' in obj && 'closePrice' in obj && 'quotation' in obj;
  }

  convertCreateCFDOrderData(data: IApplyCreateCFDOrderData) {
    const convertedCreateCFDOrderData = {
      ...data,
      price: SafeMath.toSmallestUnit(data.price, 10),
      amount: SafeMath.toSmallestUnit(data.amount, 10),
      leverage: SafeMath.toSmallestUnit(data.leverage, 10),
      liquidationPrice: SafeMath.toSmallestUnit(data.liquidationPrice, 10),
      margin: {
        ...data.margin,
        amount: SafeMath.toSmallestUnit(data.margin.amount, 10),
      },
      quotation: {
        ...data.quotation,
        price: SafeMath.toSmallestUnit(data.quotation.price, 10),
      },
      createTimestamp: getTimestamp(),
      takeProfit: data.takeProfit ? SafeMath.toSmallestUnit(data.takeProfit, 10) : 0,
      stopLoss: data.stopLoss ? SafeMath.toSmallestUnit(data.stopLoss, 10) : 0,
      guaranteedStop: data.guaranteedStop ? data.guaranteedStop : false,
      guaranteedStopFee: data.guaranteedStopFee
        ? SafeMath.toSmallestUnit(data.guaranteedStopFee, 10)
        : 0,
      remark: data.remark ? data.remark : ``,
    };
    return convertedCreateCFDOrderData;
  }

  convertUpdateCFDOrderData(data: IApplyUpdateCFDOrderData) {
    const convertedUpdateCFDOrderData = {
      ...data,
      guaranteedStop: data.guaranteedStop ? data.guaranteedStop : false,
      guaranteedStopFee: data.guaranteedStopFee
        ? SafeMath.toSmallestUnit(data.guaranteedStopFee, 10)
        : 0,
      takeProfit: data.takeProfit ? SafeMath.toSmallestUnit(data.takeProfit, 10) : 0,
      stopLoss: data.stopLoss ? SafeMath.toSmallestUnit(data.stopLoss, 10) : 0,
    };
    return convertedUpdateCFDOrderData;
  }

  convertCloseCFDOrderData(data: IApplyCloseCFDOrderData) {
    const convertedCloseCFDOrderData = {
      ...data,
      closePrice: SafeMath.toSmallestUnit(data.closePrice, 10),
      quotation: {
        ...data.quotation,
        price: SafeMath.toSmallestUnit(data.quotation.price, 10),
      },
      closeTimestamp: data.closeTimestamp ? data.closeTimestamp : getTimestamp(),
    };
    return convertedCloseCFDOrderData;
  }

  convertWithdrawOrderData(data: IApplyWithdrawOrder) {
    const convertedCloseCFDOrderData = {
      ...data,
      targetAmount: SafeMath.toSmallestUnit(data.targetAmount, 10),
      fee: SafeMath.toSmallestUnit(data.fee, 10),
      createTimestamp: data.createTimestamp ? data.createTimestamp : getTimestamp(),
      remark: data.remark ? data.remark : ``,
    };
    return convertedCloseCFDOrderData;
  }

  transferCFDOrderToTransaction(order: IApplyCFDOrder) {
    let result: IResult = {
      success: false,
      code: Code.INVAILD_INPUTS,
      reason: 'data and type is not match',
    };
    switch (order.type) {
      case CFDOrderType.CREATE:
        if (this.isApplyCreateCFDOrderData(order.data)) {
          // ++ TODO createCFDOrderContract
          const typeData = CFDOrderCreate;
          typeData.message = this.convertCreateCFDOrderData(order.data);
          result = {
            success: true,
            code: Code.SUCCESS,
            data: toIJSON(typeData),
          };
        }
        break;
      case CFDOrderType.UPDATE:
        if (this.isApplyUpdateCFDOrderData(order.data)) {
          // ++ TODO updateCFDOrderContract
          const typeData = CFDOrderUpdate;
          typeData.message = this.convertUpdateCFDOrderData(order.data);
          result = {
            success: true,
            code: Code.SUCCESS,
            data: toIJSON(typeData),
          };
        }
        break;
      case CFDOrderType.CLOSE:
        if (this.isApplyCloseCFDOrderData(order.data)) {
          // ++ TODO closeCFDOrderContract
          const typeData = CFDOrderClose;
          typeData.message = this.convertCloseCFDOrderData(order.data);
          result = {
            success: true,
            code: Code.SUCCESS,
            data: toIJSON(typeData),
          };
        }
        break;
      default:
        break;
    }
    return result;
  }

  transferDepositOrderToTransaction(depositOrder: IApplyDepositOrder) {
    const funcName = 'transfer(address,uint256)';
    const funcNameHex = `0x${keccak.keccak256(funcName).slice(0, 8)}`;
    // ++ ToDo: fill Cross-Chain-Channel contract address into addressData
    const addressData = ''.padStart(64, '0');
    const amountData = SafeMath.toSmallestUnitHex(depositOrder.targetAmount, depositOrder.decimals)
      .split('.')[0]
      .padStart(64, '0');
    const data = funcNameHex + addressData + amountData;

    const value = 0;

    const transaction = {
      to: depositOrder.to,
      amount: value,
      data,
    };
    return transaction;
  }

  transferWithdrawOrderToTransaction(withdrawOrder: IApplyWithdrawOrder) {
    const typeData = Withdraw;
    typeData.message = this.convertWithdrawOrderData(withdrawOrder);
    const result: IResult = {
      success: true,
      code: Code.SUCCESS,
      data: toIJSON(typeData),
    };
    return result;
  }
}

const TransactionEngineInstance = new TransactionEngine();
export default TransactionEngineInstance;

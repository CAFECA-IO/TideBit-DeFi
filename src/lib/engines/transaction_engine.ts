import keccak from '@cafeca/keccak';
import SafeMath from '../safe_math';
import {CFDOperation} from '../../constants/cfd_order_type';
import {IApplyCFDOrder} from '../../interfaces/tidebit_defi_background/apply_cfd_order';
import {IApplyCloseCFDOrder} from '../../interfaces/tidebit_defi_background/apply_close_cfd_order';
import {IApplyUpdateCFDOrder} from '../../interfaces/tidebit_defi_background/apply_update_cfd_order';
import {IApplyCreateCFDOrder} from '../../interfaces/tidebit_defi_background/apply_create_cfd_order';
import {IApplyDepositOrder} from '../../interfaces/tidebit_defi_background/apply_deposit_order';
import {IApplyWithdrawOrder} from '../../interfaces/tidebit_defi_background/apply_withdraw_order';
import {getTimestamp} from '../common';
import IEIP712Data from '../../interfaces/ieip712data';
import {
  EIP712_DOMAIN,
  EIP712_PRIMARY_TYPE_CLOSE,
  EIP712_PRIMARY_TYPE_CREATE,
  EIP712_PRIMARY_TYPE_UPDATE,
  EIP712_PRIMARY_TYPE_WITHDRAW,
  EIP712_TYPES,
} from '../../constants/contracts/icontract';

class TransactionEngine {
  isApplyCreateCFDOrder(obj: object): obj is IApplyCreateCFDOrder {
    return (
      obj instanceof Object &&
      'instId' in obj &&
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
  isApplyUpdateCFDOrder(obj: object): obj is IApplyUpdateCFDOrder {
    return obj instanceof Object && 'referenceId' in obj;
  }
  isApplyCloseCFDOrderData(obj: object): obj is IApplyCloseCFDOrder {
    return (
      obj instanceof Object && 'referenceId' in obj && 'closePrice' in obj && 'quotation' in obj
    );
  }

  convertCreateCFDOrderData(data: IApplyCreateCFDOrder) {
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

  convertUpdateCFDOrderData(data: IApplyUpdateCFDOrder) {
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

  convertCloseCFDOrderData(data: IApplyCloseCFDOrder) {
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
    let typeData: IEIP712Data | undefined = undefined;
    // Deprecated: [debug] (20230717 - Tzuhan)
    // eslint-disable-next-line no-console
    console.log(`transferCFDOrderToTransaction order.operation`, order.operation);
    switch (order.operation) {
      case CFDOperation.CREATE:
        if (this.isApplyCreateCFDOrder(order)) {
          const message = this.convertCreateCFDOrderData(order);
          typeData = {
            domain: {...EIP712_DOMAIN},
            types: EIP712_TYPES,
            primaryType: EIP712_PRIMARY_TYPE_CREATE,
            message,
          };
        }
        // Deprecated: [debug] (20230717 - Tzuhan)
        // eslint-disable-next-line no-console
        console.log(`transferCFDOrderToTransaction EIP712_DOMAIN`, EIP712_DOMAIN);
        // Deprecated: [debug] (20230717 - Tzuhan)
        // eslint-disable-next-line no-console
        console.log(`transferCFDOrderToTransaction typeData`, typeData);
        break;
      case CFDOperation.UPDATE:
        if (this.isApplyUpdateCFDOrder(order)) {
          const message = this.convertUpdateCFDOrderData(order);
          typeData = {
            domain: {...EIP712_DOMAIN},
            types: EIP712_TYPES,
            primaryType: EIP712_PRIMARY_TYPE_UPDATE,
            message,
          };
        }
        // Deprecated: [debug] (20230717 - Tzuhan)
        // eslint-disable-next-line no-console
        console.log(`transferCFDOrderToTransaction EIP712_DOMAIN`, EIP712_DOMAIN);
        // Deprecated: [debug] (20230717 - Tzuhan)
        // eslint-disable-next-line no-console
        console.log(`transferCFDOrderToTransaction typeData`, typeData);
        break;
      case CFDOperation.CLOSE:
        if (this.isApplyCloseCFDOrderData(order)) {
          const message = this.convertCloseCFDOrderData(order);
          typeData = {
            domain: {...EIP712_DOMAIN},
            types: EIP712_TYPES,
            primaryType: EIP712_PRIMARY_TYPE_CLOSE,
            message,
          };
        }
        // Deprecated: [debug] (20230717 - Tzuhan)
        // eslint-disable-next-line no-console
        console.log(`transferCFDOrderToTransaction EIP712_DOMAIN`, EIP712_DOMAIN);
        // Deprecated: [debug] (20230717 - Tzuhan)
        // eslint-disable-next-line no-console
        console.log(`transferCFDOrderToTransaction typeData`, typeData);
        break;
      default:
        break;
    }
    return typeData
      ? {
          domain: {...typeData.domain},
          types: typeData.types,
          primaryType: typeData.primaryType,
          message: typeData.message,
        }
      : typeData;
  }

  transferDepositOrderToTransaction(depositOrder: IApplyDepositOrder) {
    const funcName = 'transfer(address,uint256)';
    const funcNameHex = `0x${keccak.keccak256(funcName).slice(0, 8)}`;
    // ++ ToDo: fill Cross-Chain-Channel contract address into addressData
    const addressData = ''.padStart(64, '0');
    const amountData = SafeMath.toSmallestUnitHex(depositOrder.targetAmount, 6) // TODO: get decimals from currency (20230503 - tzuhan)
      .split('.')[0]
      .padStart(64, '0');
    const data = funcNameHex + addressData + amountData;

    const value = 0;

    const transaction = {
      to: ''.padStart(64, '0'), //depositOrder.to,  // TODO: get decimals from currency (20230503 - tzuhan)
      amount: value,
      data,
    };
    return transaction;
  }

  transferWithdrawOrderToTransaction(withdrawOrder: IApplyWithdrawOrder) {
    const message = this.convertWithdrawOrderData(withdrawOrder);
    const typeData = {
      domain: EIP712_DOMAIN,
      types: EIP712_TYPES,
      primaryType: EIP712_PRIMARY_TYPE_WITHDRAW,
      message,
    };
    return typeData;
  }
}

const TransactionEngineInstance = new TransactionEngine();
export default TransactionEngineInstance;

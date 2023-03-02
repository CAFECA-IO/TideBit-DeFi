import {CFDOrderType} from '../constants/cfd_order_type';
import CFDOrderClose from '../constants/contracts/cfd_close';
import CFDOrderCreate from '../constants/contracts/cfd_create';
import CFDOrderUpdate from '../constants/contracts/cfd_update';
import {IApplyCFDOrder} from '../interfaces/tidebit_defi_background/apply_cfd_order';
import {IApplyCloseCFDOrderData} from '../interfaces/tidebit_defi_background/apply_close_cfd_order_data';
import {IApplyCreateCFDOrderData} from '../interfaces/tidebit_defi_background/apply_create_cfd_order_data';
import {IApplyUpdateCFDOrderData} from '../interfaces/tidebit_defi_background/apply_update_cfd_order_data';
import {IResult} from '../interfaces/tidebit_defi_background/result';
import SafeMath from '../lib/safe_math';

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
      'uniAsset' in obj &&
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
      guaranteedStopFee: data.guaranteedStopFee
        ? SafeMath.toSmallestUnit(data.guaranteedStopFee, 10)
        : undefined,
      takeProfit: data.takeProfit ? SafeMath.toSmallestUnit(data.takeProfit, 10) : undefined,
      stopLoss: data.stopLoss ? SafeMath.toSmallestUnit(data.stopLoss, 10) : undefined,
      margin: {
        ...data.margin,
        amount: SafeMath.toSmallestUnit(data.margin.amount, 10),
      },
      quotation: {
        ...data.quotation,
        price: SafeMath.toSmallestUnit(data.quotation.price, 10),
      },
      createTimestamp: Math.ceil(Date.now() / 1000),
    };
    return convertedCreateCFDOrderData;
  }

  convertUpdateCFDOrderData(data: IApplyUpdateCFDOrderData) {
    const convertedUpdateCFDOrderData = {
      ...data,
      guaranteedStopFee: data.guaranteedStopFee
        ? SafeMath.toSmallestUnit(data.guaranteedStopFee, 10)
        : undefined,
      takeProfit: data.takeProfit ? SafeMath.toSmallestUnit(data.takeProfit, 10) : undefined,
      stopLoss: data.stopLoss ? SafeMath.toSmallestUnit(data.stopLoss, 10) : undefined,
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
    };
    return convertedCloseCFDOrderData;
  }

  tranferCFDOrderToTransacion(order: IApplyCFDOrder) {
    let result: IResult = {
      success: false,
      reason: 'data and type is not match',
    };
    // eslint-disable-next-line no-console
    console.log(`tranferCFDOrderToTransacion order`, order);
    switch (order.type) {
      case CFDOrderType.CREATE:
        if (this.isApplyCreateCFDOrderData(order.data)) {
          // ++ TODO createCFDOrderContract
          const typeData = CFDOrderCreate;
          typeData.message = this.convertCreateCFDOrderData(order.data);
          // eslint-disable-next-line no-console
          console.log(`tranferCFDOrderToTransacion convertCreateCFDOrderData`, typeData.message);
          result = {
            success: true,
            data: typeData,
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
            data: typeData,
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
            data: typeData,
          };
        }
        break;
      default:
        break;
    }
    return result;
  }
}

const TransactionEngineInstance = new TransactionEngine();
export default TransactionEngineInstance;

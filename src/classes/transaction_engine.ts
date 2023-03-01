import {CFDOrderType} from '../constants/cfd_order_type';
import {IApplyCFDOrder} from '../interfaces/tidebit_defi_background/apply_cfd_order';
import {IApplyCloseCFDOrderData} from '../interfaces/tidebit_defi_background/apply_close_cfd_order_data';
import {IApplyCreateCFDOrderData} from '../interfaces/tidebit_defi_background/apply_create_cfd_order_data';
import {IApplyUpdateCFDOrderData} from '../interfaces/tidebit_defi_background/apply_update_cfd_order_data';
import {IResult} from '../interfaces/tidebit_defi_background/result';

class TransactionEngine {
  isApplyCreateCFDOrderData(obj: object): obj is IApplyCreateCFDOrderData {
    return (
      obj instanceof Object &&
      'ticker' in obj &&
      'typeOfPosition' in obj &&
      'price' in obj &&
      'quotation' in obj &&
      'amount' in obj &&
      'targetAsset' in obj &&
      'uniAsset' in obj &&
      'leverage' in obj &&
      'margin' in obj &&
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

  tranferCFDOrderToTransacion(order: IApplyCFDOrder) {
    let result: IResult = {
      success: false,
      reason: 'data and type is not match',
    };
    switch (order.type) {
      case CFDOrderType.CREATE:
        if (this.isApplyCreateCFDOrderData(order.data)) {
          // ++ TODO createCFDOrderContract
          result = {
            success: true,
            data: '',
          };
        }
        break;
      case CFDOrderType.UPDATE:
        if (this.isApplyUpdateCFDOrderData(order.data)) {
          // ++ TODO updateCFDOrderContract
          result = {
            success: true,
            data: '',
          };
        }
        break;
      case CFDOrderType.CLOSE:
        if (this.isApplyCloseCFDOrderData(order.data)) {
          // ++ TODO closeCFDOrderContract
          result = {
            success: true,
            data: '',
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

import {CFDOrderType} from '../constants/cfd_order_type';
import CFDOrderClose from '../constants/contracts/cfd_close';
import CFDOrderCreate from '../constants/contracts/cfd_create';
import CFDOrderUpdate from '../constants/contracts/cfd_update';
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

  tranferCFDOrderToTransacion(order: IApplyCFDOrder) {
    let result: IResult = {
      success: false,
      reason: 'data and type is not match',
    };
    switch (order.type) {
      case CFDOrderType.CREATE:
        if (this.isApplyCreateCFDOrderData(order.data)) {
          // ++ TODO createCFDOrderContract
          const contract = CFDOrderCreate;
          contract.message = order.data;
          result = {
            success: true,
            data: contract,
          };
        }
        break;
      case CFDOrderType.UPDATE:
        if (this.isApplyUpdateCFDOrderData(order.data)) {
          // ++ TODO updateCFDOrderContract
          const contract = CFDOrderUpdate;
          contract.message = order.data;
          result = {
            success: true,
            data: contract,
          };
        }
        break;
      case CFDOrderType.CLOSE:
        if (this.isApplyCloseCFDOrderData(order.data)) {
          // ++ TODO closeCFDOrderContract
          const contract = CFDOrderClose;
          contract.message = order.data;
          result = {
            success: true,
            data: contract,
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

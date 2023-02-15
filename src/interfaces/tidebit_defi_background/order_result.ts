import {IPublicOrder} from './public_order';
import {IResult} from './result';

export interface IOrderResult extends IResult {
  data?: IPublicOrder;
}

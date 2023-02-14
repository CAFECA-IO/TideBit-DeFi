import {IPnLType} from '../../constants/pnl_type';

// 無法再檢查 'LOSS' 則回傳 '-' 的情境，只能檢查一次，否則會造成 'PROFIT' 然後 symbol 為 '-' 也給過的情況。
type symbolOfPnL<T> = T extends 'PROFIT' ? '+' : undefined;

// type symbolOfPnLUP<T> = T extends ('PROFIT') ? '+' : undefined
// type symbolOfPnLDOWN<T> = T extends ('LOSS') ? '-' : undefined
// type symbolOfPnL<T> = symbolOfPnLUP<T> | symbolOfPnLDOWN<T>

// type symbolOfPnL<T> = T extends ('PROFIT') ?
//                       '+' :
//                       T extends ('LOSS') ?
//                       '-'  :
//                       undefined

// : T extends ('DOWN') ? '-'

export interface IPnL {
  type: IPnLType;
  symbol: symbolOfPnL<IPnL['type']>;
  value: number;
}

const pnl: IPnL = {
  type: 'PROFIT',
  symbol: '+',
  value: 100,
};

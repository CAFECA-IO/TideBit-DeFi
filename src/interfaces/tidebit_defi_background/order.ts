/** extended by
 * @interface IWithdrawalOrder
 * @interface IDepositOrder
 * @interface IOpenCFDOrder
 * @interface IClosedCFDOrder [TODO: closed_cfd_order.ts]
 */
export interface IOrder {
  // address: string;
  timestamp: number;
  type: 'OPEN_CFD' | 'CLOSE_CFD' | 'DEPOSIT' | 'WITHDRAW';
  targetAsset: string;
  targetAmount: number;
  fee: number; // 手續費
  remarks?: string; // 備註

  available?: number; // 可用餘額
  detail?: {
    txId?: string; // 交易ID
    state: 'PROCESSING' | 'FAILED' | 'DONE'; // 訂單狀態
  };
}

/** extended by
 * @interface IWithdrawalOrder
 * @interface IDepositOrder
 */
export interface IOrder {
  // address: string;
  timestamp: number;
  type: 'OPEN_CFD' | 'CLOSE_CFD' | 'DEPOSIT' | 'WITHDRAW';
  asset: string;
  amount: number;
  remarks?: string; // 備註
}

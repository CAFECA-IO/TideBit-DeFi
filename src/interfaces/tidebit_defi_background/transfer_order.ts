/** Extended by
 * @interface IWithdrawalOrder
 * @interface IDepositOrder
 */
export interface ITransferOrder {
  asset: string;
  amount: number;
}

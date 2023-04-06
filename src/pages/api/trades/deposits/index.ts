import {NextApiRequest, NextApiResponse} from 'next';
import {IAcceptedDepositOrder} from '../../../../interfaces/tidebit_defi_background/accepted_deposit_order';
import {convertApplyDepositOrderToAcceptedDepositOrder} from '../../../../interfaces/tidebit_defi_background/apply_deposit_order';

let acceptedDepositOrders: IAcceptedDepositOrder[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(acceptedDepositOrders);
  } else if (req.method === 'POST') {
    try {
      const nodeSignature = '0x';
      // TODO: verify req.body.txHash (20230324 - tzuhan)
      const acceptedDepositOrder = convertApplyDepositOrderToAcceptedDepositOrder(
        req.body.applyData,
        req.body.balance,
        req.body.txid,
        nodeSignature
      );
      acceptedDepositOrders = [...acceptedDepositOrders, acceptedDepositOrder];
      res.status(200).json(acceptedDepositOrder);
    } catch (error) {
      // Deprecated: after finish error handle (20230423 - tzuhan)
      // eslint-disable-next-line no-console
      console.error(`deposits error`, error);
      res.status(500).json({error: 'Internal Server Error'});
    }
  }
}

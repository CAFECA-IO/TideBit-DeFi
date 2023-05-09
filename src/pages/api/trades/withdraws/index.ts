import {NextApiRequest, NextApiResponse} from 'next';
import {IAcceptedWithdrawOrder} from '../../../../interfaces/tidebit_defi_background/accepted_withdraw_order';
import {convertApplyWithdrawOrderToAcceptedWithdrawOrder} from '../../../../interfaces/tidebit_defi_background/apply_withdraw_order';
import {randomHex} from '../../../../lib/common';

let acceptedWithdrawOrders: IAcceptedWithdrawOrder[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(acceptedWithdrawOrders);
  } else if (req.method === 'POST') {
    try {
      // TODO: verify req.body.signature (20230324 - tzuhan)
      const acceptedWithdrawOrder = convertApplyWithdrawOrderToAcceptedWithdrawOrder(
        req.body.applyData,
        req.body.balance,
        req.body.userSignature,
        randomHex(32),
        randomHex(32)
      );
      acceptedWithdrawOrders = [...acceptedWithdrawOrders, acceptedWithdrawOrder];
      res.status(200).json(acceptedWithdrawOrder);
    } catch (error) {
      // Deprecated: after finish error handle (20230423 - tzuhan)
      // eslint-disable-next-line no-console
      console.error(`withdraws error`, error);
      res.status(500).json({error: 'Internal Server Error'});
    }
  }
}

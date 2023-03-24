/* eslint-disable no-console */
import {NextApiRequest, NextApiResponse} from 'next';
import {getDummyAcceptedWithdrawOrder} from '../../../../interfaces/tidebit_defi_background/accepted_withdraw_order';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res
      .status(200)
      .json(req.query.ticker ? getDummyAcceptedWithdrawOrder(req.query.ticker as string) : null);
  } else if (req.method === 'POST') {
    // 新增CFD
    console.log(`withdraw req.body`, req.body);
    res.status(200).json({success: Math.random() > 0.3 ? true : false});
  }
}

/* eslint-disable no-console */
import {NextApiRequest, NextApiResponse} from 'next';
import {getDummyAcceptedDepositOrder} from '../../../../interfaces/tidebit_defi_background/accepted_deposit_order';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res
      .status(200)
      .json(req.query.ticker ? getDummyAcceptedDepositOrder(req.query.ticker as string) : null);
  } else if (req.method === 'POST') {
    // 新增CFD
    console.log(`deposit req.body`, req.body);
    res.status(200).json({success: Math.random() > 0.3 ? true : false});
  }
}

import {NextApiRequest, NextApiResponse} from 'next';
import {getDummyBalances} from '../../../../interfaces/tidebit_defi_background/balance';

const balances = getDummyBalances();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(balances);
  } else res.status(500).json({error: 'Internal Server Error'});
}

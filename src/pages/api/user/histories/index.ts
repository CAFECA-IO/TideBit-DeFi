import {NextApiRequest, NextApiResponse} from 'next';
import {
  dummyAcceptedOrders,
  IAcceptedOrder,
} from '../../../../interfaces/tidebit_defi_background/accepted_order';

const histories: IAcceptedOrder[] = [...dummyAcceptedOrders];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(histories);
  } else res.status(500).json({error: 'Internal Server Error'});
}

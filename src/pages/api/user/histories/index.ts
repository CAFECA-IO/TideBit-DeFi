import {NextApiRequest, NextApiResponse} from 'next';
import {IAcceptedOrder} from '../../../../interfaces/tidebit_defi_background/accepted_order';

// const histories: IAcceptedOrder[] = [...dummyAcceptedOrders];
const histories: IAcceptedOrder[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(histories);
  } else res.status(500).json({error: 'Internal Server Error'});
}

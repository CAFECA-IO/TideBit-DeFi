import {NextApiRequest, NextApiResponse} from 'next';
import {
  dummyDepositOrder,
  dummyClosedCFDOrder,
  dummyOpenCFDOrder,
  dummyWithdrawalOrder,
  IOrder,
} from '../../../../interfaces/tidebit_defi_background/order';

const histories: IOrder[] = [
  dummyDepositOrder,
  dummyClosedCFDOrder,
  dummyOpenCFDOrder,
  dummyWithdrawalOrder,
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(histories);
  } else res.status(500).json({error: 'Internal Server Error'});
}

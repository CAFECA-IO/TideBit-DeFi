import {NextApiRequest, NextApiResponse} from 'next';
import {dummyTickers} from '../../interfaces/tidebit_defi_background/ticker_data';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json([dummyTickers]);
}

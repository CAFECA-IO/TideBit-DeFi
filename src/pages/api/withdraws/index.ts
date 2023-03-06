import {NextApiRequest, NextApiResponse} from 'next';
import {dummyCryptocurrencies} from '../../../interfaces/tidebit_defi_background/cryptocurrency';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json([...dummyCryptocurrencies]);
}

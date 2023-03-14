import {NextApiRequest, NextApiResponse} from 'next';
import {API_VERSION, TBE_URL} from '../../../constants/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const response = await fetch(
        `${TBE_URL}${API_VERSION}/market/trades?market=${req.query.ticker}usdt&limit=50`
      );
      const data = await response.json();
      res.status(200).json(data);
    } else res.status(500).json({error: 'Internal Server Error'});
  } catch (error) {
    res.status(500).json({error: 'Internal Server Error'});
  }
}

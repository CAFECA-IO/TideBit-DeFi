/* eslint-disable no-console */
import {NextApiRequest, NextApiResponse} from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(['ETH', 'BTC']);
  } else if (req.method === 'POST') {
    console.log(`ticker req.body`, req.body);
    res.status(200).json({success: Math.random() > 0.3 ? true : false});
  }
}

/* eslint-disable no-console */
import {NextApiRequest, NextApiResponse} from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ticker: req.query.ticker, id: req.query.id});
  } else if (req.method === 'PUT') {
    // 更新CFD
    console.log(`cfds req.body`, req.body);
    res.status(200).json({success: Math.random() > 0.3 ? true : false});
  }
}

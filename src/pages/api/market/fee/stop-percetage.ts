import {NextApiRequest, NextApiResponse} from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(0.0015);
  } else res.status(500).json({error: 'Internal Server Error'});
}

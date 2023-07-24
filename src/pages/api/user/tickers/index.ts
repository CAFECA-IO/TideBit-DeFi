import {NextApiRequest, NextApiResponse} from 'next';
import {instIds} from '../../../../constants/config';
// let favoriteTickers = ['ETH-USDT', 'BTC-USDT'];
let favoriteTickers = instIds.map(i => i.toUpperCase());
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(favoriteTickers);
  } else if (req.method === 'PUT') {
    if (req.body.starred === true) {
      favoriteTickers = favoriteTickers.filter(t => t === req.body.ticker).concat(req.body.ticker);
      res.status(200).json(favoriteTickers);
    } else if (req.body.starred === false) {
      favoriteTickers = favoriteTickers.filter(t => t === req.body.ticker);
      res.status(200).json(favoriteTickers);
    } else res.status(500).json({error: 'Internal Server Error'});
    res.status(200).json({success: Math.random() > 0.3 ? true : false});
  }
}

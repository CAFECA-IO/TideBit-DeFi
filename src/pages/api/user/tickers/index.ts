import {NextApiRequest, NextApiResponse} from 'next';
import {Ticker} from '../../../../constants/ticker';

let favoriteTickers = Object.values(Ticker);
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(favoriteTickers);
  } else if (req.method === 'PUT') {
    const success = Math.random() > 0.3 ? true : false;
    if (req.body.starred === true) {
      favoriteTickers = favoriteTickers.concat(req.body.instId);
      res.status(200).json({favoriteTickers, success});
    } else if (req.body.starred === false) {
      favoriteTickers = favoriteTickers.filter(t => !req.body.instId?.includes(t));
      res.status(200).json({favoriteTickers, success});
    } else res.status(500).json({error: 'Internal Server Error'});
    // Deprecated: Causing error `Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client` (20230727 - Shirley)
    // res.status(200).json({success: Math.random() > 0.3 ? true : false});
  }
}

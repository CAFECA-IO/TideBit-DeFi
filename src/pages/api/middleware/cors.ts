import {NextApiResponse, NextApiRequest, NextApiHandler} from 'next';

const allowCors =
  (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // TODO: update '*' to 'https://api.tidebit-defi.com/' (20230510 - tzuhan)
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    return handler(req, res);
  };

export default allowCors;

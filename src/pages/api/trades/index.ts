import {NextApiRequest, NextApiResponse} from 'next';
import {TBEURL} from '../../../constants/api_request';
import {API_VERSION, BASE_URL, unitAsset} from '../../../constants/config';
import {toQuery} from '../../../lib/common';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const query = req.query as {[key: string]: string} | undefined;
    try {
      const _query = query
        ? {
            ...query,
            symbol: query.symbol ? `${query.symbol.toLowerCase()}${unitAsset.toLowerCase()}` : ``,
          }
        : undefined;
      const response = await fetch(
        `${BASE_URL}${API_VERSION}${TBEURL.LIST_TRADES}${toQuery(_query)}`
      );
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({error: 'Internal Server Error'});
    }
  } else res.status(500).json({error: 'Internal Server Error'});
}

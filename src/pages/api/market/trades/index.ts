import {NextApiRequest, NextApiResponse} from 'next';
import {TBEURL} from '../../../../constants/api_request';
import {Code, Reason} from '../../../../constants/code';
import {API_VERSION, BASE_URL, unitAsset} from '../../../../constants/config';
import {toQuery} from '../../../../lib/common';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const params = req.query as {[key: string]: string} | undefined;
    try {
      const query = toQuery(
        params
          ? {
              ...params,
              symbol: params.symbol
                ? `${params.symbol.toLowerCase()}${unitAsset.toLowerCase()}`
                : ``,
            }
          : undefined
      );
      const url = `${BASE_URL}${API_VERSION}${TBEURL.LIST_TRADES}${query}`;
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) res.status(200).json(result.payload);
      else res.status(500).json({error: Reason[Code.INTERNAL_SERVER_ERROR]});
    } catch (error) {
      res.status(500).json({error: Reason[Code.INTERNAL_SERVER_ERROR]});
    }
  } else res.status(500).json({error: Reason[Code.INTERNAL_SERVER_ERROR]});
}

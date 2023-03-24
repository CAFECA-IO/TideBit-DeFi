import {NextApiRequest, NextApiResponse} from 'next';
import {TRADING_CRYPTO_DATA} from '../../../../constants/config';
import {ITypeOfPosition} from '../../../../constants/type_of_position';
import {getDummyQuotation} from '../../../../interfaces/tidebit_defi_background/quotation';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const query = req.query as {[key: string]: string};
    if (
      Object.keys(query).includes('ticker') &&
      TRADING_CRYPTO_DATA.some(d => d.currency === query.ticker) &&
      Object.keys(query).includes('typeOfPosition')
    ) {
      const dummyQuotation = getDummyQuotation(
        query.ticker,
        query.typeofposition as ITypeOfPosition
      );
      res.status(200).json(dummyQuotation);
    } else res.status(500).json({error: 'Internal Server Error'});
  } else res.status(500).json({error: 'Internal Server Error'});
}

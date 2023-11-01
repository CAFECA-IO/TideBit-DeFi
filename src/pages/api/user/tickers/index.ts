import {NextApiRequest, NextApiResponse} from 'next';
import {Ticker} from '../../../../constants/ticker';
import cookie from 'cookie';
import {COOKIE_PERIOD_FAVORITES} from '../../../../constants/config';

const defaultFavoriteTickers = Object.values(Ticker) as string[];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = cookie.parse(req.headers.cookie || '');

  let favoriteTickers = cookies.favoriteTickers
    ? JSON.parse(cookies.favoriteTickers)
    : defaultFavoriteTickers;

  if (req.method === 'GET') {
    res.status(200).json(favoriteTickers);
  } else if (req.method === 'PUT') {
    const success = Math.random() > 0.3 ? true : false;
    if (req.body.starred === true) {
      favoriteTickers = favoriteTickers.concat(req.body.instId);
    } else if (req.body.starred === false) {
      favoriteTickers = favoriteTickers.filter((t: string) => !req.body.instId?.includes(t));
    } else res.status(500).json({error: 'Internal Server Error'});

    const expiration = new Date();
    expiration.setDate(expiration.getDate() + COOKIE_PERIOD_FAVORITES);

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('favoriteTickers', JSON.stringify(favoriteTickers), {
        httpOnly: true,
        path: '/',
        expires: expiration,
        sameSite: 'strict',
      })
    );

    res.status(200).json({favoriteTickers, success});
  }
}

import type {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {url} = req.query;

  try {
    if (typeof url !== 'string') {
      return res.status(400).json({error: 'Invalid URL parameter'});
    }

    const response = await fetch(url);
    const contentType = response.headers.get('content-type');

    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({error: 'Unable to fetch data'});
  }
}

import {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let response;
  const deWT = req.headers.cookie
    ?.split('; ')
    ?.find(row => row.startsWith(`DeWT=`))
    ?.split('=')[1];
  // eslint-disable-next-line no-console
  console.log(`deWT`, deWT);
  if (req.method === 'GET') {
    // eslint-disable-next-line no-console
    console.log(`GET req.query`, req.query);
    response = await fetch(
      `http://localhost:3001/pusher/auth?socket_id=${req.query.socket_id}&channel_name=${req.query.channel_name}&deWT=${deWT}`,
      {
        method: req.method,
      }
    );
  } else if (req.method === 'POST') {
    const body = {...req.body, deWT: req.body.deWT || deWT};
    // eslint-disable-next-line no-console
    console.log(`POST body`, body);
    response = await fetch('http://localhost:3001/pusher/auth', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: req.method,
      body: body,
    });
  }
  // eslint-disable-next-line no-console
  console.log(`GET response`, response);
  // const result = await response?.json();
  // eslint-disable-next-line no-console
  // console.log(`GET result`, result);
  if (response?.ok) {
    res.status(200).json(response);
  } else res.status(response?.status || 201).json(response);
}

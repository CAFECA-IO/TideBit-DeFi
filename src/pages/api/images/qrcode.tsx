// Info: use ImageResponse to get image from api
import QRCode from 'qrcode';
import {NextApiRequest, NextApiResponse} from 'next';
import {ImageResponse} from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const generateQRCode = async (text: string) => {
    let qrcode = '';
    try {
      qrcode = await QRCode.toDataURL(text, {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        margin: 3,
        rendererOpts: {
          quality: 1,
        },
      });
    } catch (err) {
      // TODO: handle error (20230503 - Shirley)
      // eslint-disable-next-line no-console
      console.error(`Generate qr code, ${err}`);
    }
    return qrcode;
  };

  const qrcode = await generateQRCode('https://tidebit-defi.com/');
  // console.log('qrcode', qrcode);

  return new ImageResponse(
    (
      <canvas id="qrcode" width="100" height="100">
        <img
          src={qrcode ? qrcode : 'https://tidebit-defi.com/'}
          width={100}
          height={100}
          alt="qr code"
        />
      </canvas>
    ),
    {
      width: 100,
      height: 100,
    }
  );
}

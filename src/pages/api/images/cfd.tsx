import {NextApiRequest, NextApiResponse} from 'next';
import {ImageResponse} from 'next/server';
import {randomIntFromInterval} from '../../../lib/common';
import {TypeOfPnLColorHex} from '../../../constants/display';
import QRCode from 'qrcode';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const bgUrl = req.query.bgUrl as string;
  const bgUrl = 'https://gcdnb.pbrd.co/images/WkqDgGonPnnp.png?o=1';
  // TODO: get icon url from api (20230503 - Shirley)
  const iconUrl = 'https://svgshare.com/i/spv.svg';
  const randomPnL = randomIntFromInterval(1, 100);
  const generateQRCode = async (text: string) => {
    try {
      const qrcode = await QRCode.toDataURL(text, {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        margin: 3,
        rendererOpts: {
          quality: 1,
        },
      });
      return qrcode;
    } catch (err) {
      // TODO: handle error (20230503 - Shirley)
      // eslint-disable-next-line no-console
      console.error(`Generate qr code, ${err}`);
    }
  };

  const qrcode = generateQRCode('https://tidebit-defi.com/');

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            zIndex: -1,
            // TODO: image should upload to server and fix that image URL (20230505 - Shirley)
            backgroundImage: `url('https://gcdnb.pbrd.co/images/WkqDgGonPnnp.png?o=1')`,
            backgroundSize: '600px 600px',
            backgroundPosition: 'relative',
            backgroundRepeat: 'no-repeat',
            background: 'transparent',

            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            height: '600px',
            width: '600px',
          }}
        >
          <div style={{marginLeft: 64, marginTop: 10, display: 'flex', alignItems: 'center'}}>
            <div
              style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem'}}
            >
              <img src={`${iconUrl}`} width={45} height={45} alt="asset icon" />
              <h1 style={{fontSize: 36, fontWeight: 'normal', color: '#fff'}}>Ethereum</h1>
            </div>
            <div style={{marginTop: 10, display: 'flex'}}>
              <p
                style={{
                  marginTop: '0.5rem',
                  borderRadius: '0.375rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  paddingLeft: '0.25rem',
                  paddingRight: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: 'black',
                }}
              >
                Up (Buy)
              </p>
            </div>
          </div>{' '}
          <div
            style={{
              display: 'flex',
            }}
          ></div>
          <div style={{display: 'flex', marginLeft: '4rem', marginTop: '3rem'}}>
            <div
              style={{display: 'flex', marginLeft: '3.5rem', marginTop: '1.25rem', width: '100%'}}
            >
              <div
                style={{
                  display: 'flex',
                  marginLeft: '0',
                  width: '22.5rem',
                  borderWidth: '1px',
                  borderColor: TypeOfPnLColorHex.PROFIT,
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                  fontSize: '0.75rem',
                  lineHeight: '1.5',
                  color: 'rgba(229, 231, 235, 1)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      margin: 'auto',
                      display: 'flex', // inline-flex // FIXME: inline-flex is not working
                      height: '7rem',
                      width: '7rem',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      borderRadius: '50%',
                      backgroundColor: TypeOfPnLColorHex.TIDEBIT_THEME,
                      color: 'rgba(229, 231, 235, 1)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 48,
                        fontWeight: 'bold',
                        color: 'rgba(229, 231, 235, 1)',
                      }}
                    >
                      Z
                    </span>
                  </div>{' '}
                  <p
                    style={{
                      fontSize: '3.125rem',
                      fontWeight: '900',
                      color: TypeOfPnLColorHex.PROFIT,
                      marginTop: '1.25rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    + {randomPnL} %
                  </p>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    {/* Rest of the code */}
                  </div>
                </div>
              </div>
            </div>

            {/* <div style={{display: 'flex', paddingLeft: '23.125rem', paddingTop: '1.25rem'}}>
             
              <img src={`${qrcode}`} width={100} height={100} alt="QR Code" />
            </div> */}
          </div>
        </div>
      </div>
    ),
    {
      width: 600,
      height: 600,
    }
  );
}

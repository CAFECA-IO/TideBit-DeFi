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
  const randomPnL = 16;
  const user = 'Z';
  const targetAssetName = 'Ethereum';
  const typeOfPosition = 'Up (Buy)';
  const openPrice = 1313.8;
  const closePrice = 1383.6;
  const leverage = 5;

  // const generateQRCode = async (text: string) => {
  //   try {
  //     const qrcode = await QRCode.toDataURL(text, {
  //       errorCorrectionLevel: 'H',
  //       type: 'image/jpeg',
  //       margin: 3,
  //       rendererOpts: {
  //         quality: 1,
  //       },
  //     });
  //     return qrcode;
  //   } catch (err) {
  //     // TODO: handle error (20230503 - Shirley)
  //     // eslint-disable-next-line no-console
  //     console.error(`Generate qr code, ${err}`);
  //   }
  // };

  // const qrcode = generateQRCode('https://tidebit-defi.com/');

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'barlow',
        }}
      >
        <div
          style={{
            // zIndex: -1,
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
            fontFamily: 'barlow',
          }}
        >
          <div
            style={{
              marginLeft: 64,
              marginTop: 10,
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'barlow',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                fontFamily: 'barlow',
              }}
            >
              <img src={`${iconUrl}`} width={45} height={45} alt="asset icon" />
              <h1 style={{fontSize: 36, fontWeight: 'normal', color: '#fff', fontFamily: 'barlow'}}>
                {targetAssetName}
              </h1>
            </div>
            <div style={{marginTop: 10, display: 'flex', fontFamily: 'barlow'}}>
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
                  fontFamily: 'barlow',
                }}
              >
                {typeOfPosition}
              </p>
            </div>
          </div>{' '}
          <div
            style={{
              display: 'flex',
              fontFamily: 'barlow',
            }}
          ></div>
          <div
            style={{display: 'flex', marginLeft: '4rem', marginTop: '3rem', fontFamily: 'barlow'}}
          >
            <div
              style={{
                display: 'flex',
                marginLeft: '3.5rem',
                // marginTop: '1.25rem',
                width: '100%',
                fontFamily: 'barlow',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  marginLeft: '0',
                  width: '350px',
                  height: '320px',
                  borderWidth: '1px',
                  borderColor: TypeOfPnLColorHex.PROFIT,
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  color: 'rgba(229, 231, 235, 1)',
                  fontFamily: 'barlow',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'center',
                    fontFamily: 'barlow',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      // margin: 'auto',
                      marginLeft: '115px',
                      display: 'flex', // inline-flex // FIXME: inline-flex is not working
                      height: '7rem',
                      width: '7rem',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      borderRadius: '50%',
                      backgroundColor: TypeOfPnLColorHex.TIDEBIT_THEME,
                      color: 'rgba(229, 231, 235, 1)',
                      fontFamily: 'barlow',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 48,
                        fontWeight: 'extrabold',
                        color: 'rgba(229, 231, 235, 1)',
                        fontFamily: 'barlow',
                      }}
                    >
                      {user}
                    </span>
                  </div>{' '}
                  <div style={{display: 'flex', marginLeft: '100px'}}>
                    <span style={{marginTop: '18px'}}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28.125"
                        height="36"
                        viewBox="0 0 28.125 36"
                      >
                        <path
                          fill="#17bf88"
                          d="M18 0L3.937 21.094h7.576V36h12.973V21.094h7.576z"
                          transform="translate(-3.937)"
                        ></path>
                      </svg>
                    </span>{' '}
                    <p
                      style={{
                        fontSize: '48px',
                        fontWeight: 'bold',
                        color: TypeOfPnLColorHex.PROFIT,
                        marginTop: '30px',
                        marginBottom: '10px',
                        fontFamily: 'barlow',
                      }}
                    >
                      {randomPnL} %
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0px',
                      fontFamily: 'barlow',
                    }}
                  >
                    {/* Rest of the code */}
                    <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'flex-end'}}>
                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#8B8E91',
                          fontFamily: 'barlow',
                        }}
                      >
                        Open Price
                      </p>
                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#fff',
                          fontFamily: 'barlow',
                        }}
                      >
                        {openPrice}
                        <span
                          style={{
                            marginTop: '2px',
                            fontSize: '12px',
                            fontWeight: 'lighter',
                            color: '#8B8E91',
                            fontFamily: 'barlow',
                          }}
                        >
                          USDT
                        </span>
                      </p>
                    </div>

                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#8B8E91',
                          fontFamily: 'barlow',
                        }}
                      >
                        Close Price
                      </p>
                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#fff',
                          fontFamily: 'barlow',
                        }}
                      >
                        {closePrice}
                      </p>
                    </div>

                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#8B8E91',
                          fontFamily: 'barlow',
                        }}
                      >
                        Leverage
                      </p>
                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#fff',
                          fontFamily: 'barlow',
                        }}
                      >
                        {leverage}x
                      </p>
                    </div>
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

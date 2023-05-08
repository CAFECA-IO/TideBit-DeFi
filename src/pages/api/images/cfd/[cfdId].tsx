import {NextApiRequest, NextApiResponse} from 'next';
import {ImageResponse} from 'next/server';
import {randomIntFromInterval, roundToDecimalPlaces} from '../../../../lib/common';
import {
  TypeOfPnLColorHex,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
  WIDTH_HEIGHT_OF_SHARING_RECORD,
} from '../../../../constants/display';
import QRCode from 'qrcode';
import {API_ROUTE_DOMAIN, FRACTION_DIGITS} from '../../../../constants/config';
import {ProfitState} from '../../../../constants/profit_state';
import {TypeOfPosition} from '../../../../constants/type_of_position';
import {Currency} from '../../../../constants/currency';
import {
  ISharingOrder,
  getDummySharingOrder,
  isDummySharingOrder,
} from '../../../../interfaces/tidebit_defi_background/sharing_order';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: use `cfdId` to call API to get the data (20230508 - Shirley)
  const cfdId = req?.url?.split('=')[1];

  // TODO: Data from API (20230508 - Shirley)
  // TODO: Generate QR Code (20230508 - Shirley)
  const {tickerId, user, targetAssetName, typeOfPosition, openPrice, closePrice, leverage} =
    getDummySharingOrder() as ISharingOrder;

  const displayedUser = user.slice(-1).toUpperCase();

  const iconUrl = API_ROUTE_DOMAIN + `/asset_icon/${tickerId.toLowerCase()}.svg`;
  // TODO: Image resolution (20230508 - Shirley)
  const backgroundImageUrl = API_ROUTE_DOMAIN + '/elements/group_15214@2x.png';

  const pnlPercent =
    typeOfPosition === TypeOfPosition.BUY
      ? roundToDecimalPlaces(((closePrice - openPrice) / openPrice) * 100, 2)
      : roundToDecimalPlaces(((openPrice - closePrice) / openPrice) * 100, 2);

  const displayedPnlPercent = Math.abs(pnlPercent).toLocaleString(
    UNIVERSAL_NUMBER_FORMAT_LOCALE,
    FRACTION_DIGITS
  );

  const profitState = pnlPercent > 0 ? ProfitState.PROFIT : ProfitState.LOSS;

  const displayedTypeOfPosition =
    typeOfPosition === TypeOfPosition.BUY ? 'Up (Buy)' : 'Down (Sell)';
  const displayedTextColor =
    profitState === ProfitState.PROFIT ? TypeOfPnLColorHex.PROFIT : TypeOfPnLColorHex.LOSS;
  const displayedBorderColor =
    profitState === ProfitState.PROFIT ? TypeOfPnLColorHex.PROFIT : TypeOfPnLColorHex.LOSS;

  const upArrow = (
    <svg xmlns="http://www.w3.org/2000/svg" width="28.125" height="36" viewBox="0 0 28.125 36">
      <path
        fill="#17bf88"
        d="M18 0L3.937 21.094h7.576V36h12.973V21.094h7.576z"
        transform="translate(-3.937)"
      ></path>
    </svg>
  );

  const downArrow = (
    <svg xmlns="http://www.w3.org/2000/svg" width="28.125" height="36" viewBox="0 0 256 256">
      <path
        fill="#E86D6D"
        strokeMiterlimit="10"
        strokeWidth="0"
        d="M46.969 89.104a2.611 2.611 0 01-3.937 0L13.299 54.989c-.932-1.072-.171-2.743 1.25-2.743h14.249V1.91A1.91 1.91 0 0130.708 0h28.584a1.91 1.91 0 011.91 1.91v50.336h14.249c1.421 0 2.182 1.671 1.25 2.743L46.969 89.104z"
        transform="matrix(2.81 0 0 2.81 1.407 1.407)"
      ></path>
    </svg>
  );

  const displayedArrow = profitState === ProfitState.PROFIT ? upArrow : downArrow;
  // TODO: QR code (20230508 - Shirley)
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
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: `${WIDTH_HEIGHT_OF_SHARING_RECORD}px ${WIDTH_HEIGHT_OF_SHARING_RECORD}px`,
            backgroundPosition: 'relative',
            backgroundRepeat: 'no-repeat',
            background: 'transparent',

            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            height: `${WIDTH_HEIGHT_OF_SHARING_RECORD}px`,
            width: `${WIDTH_HEIGHT_OF_SHARING_RECORD}px`,
            fontFamily: 'barlow',
          }}
        >
          <div
            style={{
              marginLeft: 64,
              marginTop: '30px',
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
            <div
              style={{
                marginTop: '15px',
                marginLeft: '15px',
                display: 'flex',
                fontFamily: 'barlow',
              }}
            >
              <p
                style={{
                  marginTop: '0.5rem',
                  borderRadius: '3px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  paddingLeft: '0.25rem',
                  paddingRight: '0.25rem',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: 'black',
                  fontFamily: 'barlow',
                }}
              >
                {displayedTypeOfPosition}
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
            style={{display: 'flex', marginLeft: '4rem', marginTop: '25px', fontFamily: 'barlow'}}
          >
            <div
              style={{
                display: 'flex',
                marginLeft: '3.5rem',
                marginTop: '-20px',
                width: '100%',
                fontFamily: 'barlow',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  marginLeft: '5px',
                  width: '350px',
                  height: '320px',
                  borderWidth: '1px',
                  borderColor: `${displayedBorderColor}`,
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
                      marginLeft: '115px',
                      display: 'flex',
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
                      {displayedUser}
                    </span>
                  </div>{' '}
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <span style={{marginTop: '15px', marginRight: '5px'}}>{displayedArrow}</span>{' '}
                    <p
                      style={{
                        fontSize: '45px',
                        fontWeight: 'bold',
                        color: `${displayedTextColor}`,
                        marginTop: '30px',
                        fontFamily: 'barlow',
                      }}
                    >
                      {displayedPnlPercent} %
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0px',
                      fontFamily: 'barlow',
                      width: '330px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#8B8E91',
                          fontFamily: 'barlow',
                          width: '260px',
                          marginLeft: '20px',
                        }}
                      >
                        Open Price
                      </p>
                      <div style={{width: '50px'}}></div>

                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#fff',
                          fontFamily: 'barlow',
                          marginRight: '35px',
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
                            marginLeft: '2px',
                          }}
                        >
                          USDT
                        </span>
                      </p>
                    </div>

                    <div style={{display: 'flex'}}>
                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#8B8E91',
                          fontFamily: 'barlow',
                          width: '260px',
                          marginLeft: '20px',
                        }}
                      >
                        Close Price
                      </p>
                      <div style={{width: '50px'}}></div>

                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#fff',
                          fontFamily: 'barlow',
                          marginRight: '35px',
                        }}
                      >
                        {closePrice}
                        <span
                          style={{
                            marginTop: '2px',
                            fontSize: '12px',
                            fontWeight: 'lighter',
                            color: '#8B8E91',
                            fontFamily: 'barlow',
                            marginLeft: '2px',
                          }}
                        >
                          USDT
                        </span>
                      </p>
                    </div>

                    <div style={{display: 'flex'}}>
                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#8B8E91',
                          fontFamily: 'barlow',
                          width: '260px',
                          marginLeft: '20px',
                        }}
                      >
                        Leverage
                      </p>
                      <div style={{width: '50px'}}></div>
                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#fff',
                          fontFamily: 'barlow',
                          marginRight: '20px',
                        }}
                      >
                        {leverage}x
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH_HEIGHT_OF_SHARING_RECORD,
      height: WIDTH_HEIGHT_OF_SHARING_RECORD,
    }
  );
}

/*eslint-disable @next/next/no-img-element*/
import {NextApiRequest} from 'next';
import {ImageResponse} from 'next/og';
import {
  BG_HEIGHT_OF_SHARING_RECORD,
  BG_WIDTH_OF_SHARING_RECORD,
  HEIGHT_OF_SHARING_RECORD,
  TypeOfPnLColorHex,
  WIDTH_OF_SHARING_RECORD,
} from '../../../../constants/display';
import {
  API_URL,
  API_VERSION,
  DOMAIN,
  SHARING_BG_IMG_THRESHOLD_PNL_PERCENT,
  unitAsset,
} from '../../../../constants/config';
import {TypeOfPosition} from '../../../../constants/type_of_position';
import {
  ISharingOrder,
  getInvalidSharingOrder,
  isSharingOrder,
} from '../../../../interfaces/tidebit_defi_background/sharing_order';
import {BARLOW_BASE64} from '../../../../constants/fonts';
import SafeMath from '../../../../lib/safe_math';
import React from 'react';
import {
  adjustTimestamp,
  numberFormatted,
  roundToDecimalPlaces,
  timestampToString,
} from '../../../../lib/common';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextApiRequest) {
  const url = new URL(req?.url ?? '');
  const params = url.pathname.split('/');
  const cfdId = params.pop();
  const apiUrl = `${API_URL}/api/${API_VERSION}/public/shared/cfd/${cfdId}`;
  const tz = Number(url.searchParams.get('tz'));

  let sharingOrder: ISharingOrder = getInvalidSharingOrder();

  const fetchOrder = async () => {
    try {
      const orderResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
      });
      const order = await orderResponse.json();

      if (order?.success) {
        if (order?.data.openPrice) order.data.openPrice = order.data.openPrice.toString();
        if (order?.data.closePrice) order.data.closePrice = order.data.closePrice.toString();
        if (isSharingOrder(order?.data)) {
          sharingOrder = order?.data;
        }
      }
    } catch (e) {
      // TODO: error handling (20230523 - Shirley)
    }

    return sharingOrder;
  };

  try {
    await fetchOrder();

    const offset = new Date().getTimezoneOffset() / 60;
    const adCreateTimestamp = adjustTimestamp(offset, sharingOrder?.createTimestamp ?? 0, tz);
    const adCloseTimestamp = adjustTimestamp(offset, sharingOrder?.closeTimestamp ?? 0, tz);

    sharingOrder = {
      ...sharingOrder,
      createTimestamp: adCreateTimestamp,
      closeTimestamp: adCloseTimestamp,
    };
  } catch (e) {
    // Info: show the invalid dummy order img (20230523 - Shirley)
  }
  // TODO: Show the `instId` when data has the property (20230724 - Shirley)
  const {
    userName,
    targetAsset,
    targetAssetName,
    typeOfPosition,
    openPrice,
    closePrice,
    createTimestamp,
    closeTimestamp,
  } = sharingOrder;

  const {date: openDate, time: openTimeString} = timestampToString(createTimestamp);
  const {date: closeDate, time: closeTimeString} = timestampToString(closeTimestamp);

  const displayedUser = userName.slice(-1).toUpperCase();

  const logoUrl = DOMAIN + `/elements/group_15944.svg`;
  const iconUrl = DOMAIN + `/asset_icon/${targetAsset.toLowerCase()}.svg`;
  const qrcodeUrl = DOMAIN + `/elements/tidebit_qrcode.svg`;
  const marketIconUrl = DOMAIN + '/elements/market_icon@2x.png';
  const leaderboardIconUrl = DOMAIN + '/elements/leaderboard_icon@2x.png';

  const pnlPercent =
    !!!openPrice || !!!closePrice
      ? 0
      : typeOfPosition === TypeOfPosition.BUY
      ? roundToDecimalPlaces(
          +SafeMath.mult(SafeMath.div(SafeMath.minus(closePrice, openPrice), openPrice), 100),
          2
        )
      : roundToDecimalPlaces(
          +SafeMath.mult(SafeMath.div(SafeMath.minus(openPrice, closePrice), openPrice), 100),
          2
        );

  const bg =
    pnlPercent > 0
      ? pnlPercent > SHARING_BG_IMG_THRESHOLD_PNL_PERCENT
        ? 'big-profit@2x'
        : 'small-profit@2x'
      : pnlPercent < 0
      ? pnlPercent < -SHARING_BG_IMG_THRESHOLD_PNL_PERCENT
        ? 'big-loss@2x'
        : 'small-loss@2x'
      : 'small-loss@2x';

  const backgroundImageUrl = DOMAIN + '/elements/' + bg + '.png';

  const displayedPnlPercent = numberFormatted(Math.abs(pnlPercent));

  const displayedTypeOfPosition =
    typeOfPosition === TypeOfPosition.BUY ? 'Up (Buy)' : 'Down (Sell)';

  const displayedTextColor = pnlPercent > 0 ? TypeOfPnLColorHex.PROFIT : TypeOfPnLColorHex.LOSS;

  const displayedTz = tz >= 0 ? `UTC+${tz}` : `UTC${tz}`;

  const BarlowBuffer = new Uint8Array(
    atob(BARLOW_BASE64)
      .split('')
      .map(char => char.charCodeAt(0))
  ).buffer;

  const upArrow = (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 28.125 36">
      <path
        fill="#17bf88"
        d="M18 0L3.937 21.094h7.576V36h12.973V21.094h7.576z"
        transform="translate(-3.937)"
      ></path>
    </svg>
  );

  const downArrow = (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 28.125 36">
      <path
        fill="#e86d6d"
        d="M18 36L3.937 14.906h7.576V0h12.973v14.906h7.576z"
        transform="translate(-3.937)"
      ></path>
    </svg>
  );

  const displayedArrow = pnlPercent > 0 ? upArrow : downArrow;

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          fontFamily: "'Barlow', sans-serif",
        }}
      >
        <div
          style={{
            display: 'flex',
            height: `${BG_HEIGHT_OF_SHARING_RECORD}px`,
            width: `${BG_WIDTH_OF_SHARING_RECORD}px`,
            backgroundColor: '#000',
          }}
        >
          <div
            style={{
              transform: 'translateY(20px) translateX(150px)',
              backgroundImage: `url(${backgroundImageUrl})`,
              objectFit: 'contain',
              backgroundSize: `${WIDTH_OF_SHARING_RECORD}px ${HEIGHT_OF_SHARING_RECORD}px`,
              backgroundPosition: 'relative',
              backgroundRepeat: 'no-repeat',

              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              height: `${HEIGHT_OF_SHARING_RECORD}px`,
              width: `${WIDTH_OF_SHARING_RECORD}px`,
            }}
          >
            <div
              style={{
                marginLeft: 64,
                marginTop: '30px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img src={`${logoUrl}`} width={224} height={66} alt="logo" />
            </div>
            <div
              style={{
                marginLeft: 64,
                marginTop: '30px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                }}
              >
                {' '}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                  }}
                >
                  {' '}
                  <img src={`${iconUrl}`} width={30} height={30} alt="crypto icon" />
                  <h1 style={{fontSize: 24, fontWeight: 'normal', color: '#fff'}}>
                    {targetAssetName}
                  </h1>
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: '370px',
                  left: '650px',

                  display: 'flex',
                  justifySelf: 'end',
                  marginTop: 'auto',
                  marginLeft: 'auto',
                }}
              >
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <img src={`${marketIconUrl}`} width={70} height={70} alt="market_icon" />
                  <p style={{fontSize: '12px', color: '#F2F2F2', marginTop: '0px'}}>Market</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginLeft: '30px',
                  }}
                >
                  <img src={`${leaderboardIconUrl}`} width={70} height={70} alt="market_icon" />
                  <p style={{fontSize: '12px', color: '#F2F2F2', marginTop: '0px'}}>Leaderboard</p>
                </div>
              </div>

              <div
                style={{
                  marginTop: '15px',
                  marginLeft: '15px',
                  display: 'flex',
                }}
              >
                <p
                  style={{
                    marginTop: '0.5rem',
                    borderRadius: '3px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    paddingLeft: '0.25rem',
                    paddingRight: '0.25rem',
                    paddingTop: '0.2rem',
                    paddingBottom: '0.2rem',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: 'black',
                  }}
                >
                  {displayedTypeOfPosition}
                </p>
              </div>
            </div>{' '}
            <div style={{display: 'flex', marginLeft: '0', marginTop: '0'}}>
              <div
                style={{
                  display: 'flex',
                  marginLeft: '40px',
                  marginTop: '0',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    marginLeft: '5px',
                    width: '350px',
                    height: '270px',
                    borderWidth: '1px',
                    borderColor: `transparent`,
                    fontSize: '16px',
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
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                        marginTop: '-20px',
                      }}
                    >
                      <span style={{marginTop: '45px', marginRight: '8px'}}>{displayedArrow}</span>{' '}
                      <p
                        style={{
                          fontSize: '60px',
                          fontWeight: 'bold',
                          color: `${displayedTextColor}`,
                        }}
                      >
                        {displayedPnlPercent}%
                      </p>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0px',
                        width: '330px',

                        position: 'relative',
                        top: '30px',
                        // height: '100px',
                        // marginTop: '100px',
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
                            width: '260px',
                            marginLeft: '20px',
                          }}
                        >
                          Open Price
                        </p>
                        <div style={{width: '90px'}}></div>

                        <p
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#fff',

                            marginRight: '35px',
                          }}
                        >
                          {numberFormatted(openPrice)}
                          <span
                            style={{
                              marginTop: '2px',
                              fontSize: '14px',
                              fontWeight: 'lighter',
                              color: '#8B8E91',

                              marginLeft: '5px',
                            }}
                          >
                            {unitAsset}
                          </span>
                        </p>
                      </div>

                      <div style={{display: 'flex', marginTop: '-20px'}}>
                        <p
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#8B8E91',

                            width: '260px',
                            marginLeft: '20px',
                          }}
                        >
                          Close Price
                        </p>
                        <div style={{width: '90px'}}></div>

                        <p
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#fff',

                            marginRight: '35px',
                          }}
                        >
                          {numberFormatted(closePrice)}
                          <span
                            style={{
                              marginTop: '2px',
                              fontSize: '14px',
                              fontWeight: 'lighter',
                              color: '#8B8E91',

                              marginLeft: '5px',
                            }}
                          >
                            {unitAsset}
                          </span>
                        </p>
                      </div>

                      <div style={{display: 'flex', marginTop: '-20px'}}>
                        <p
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#8B8E91',

                            width: '260px',
                            marginLeft: '20px',
                          }}
                        >
                          Open Time
                        </p>
                        <div style={{width: '50px'}}></div>

                        <p
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#fff',

                            marginRight: '120px',
                          }}
                        >
                          {openDate} {openTimeString} ({displayedTz})
                        </p>
                      </div>

                      <div style={{display: 'flex', marginTop: '-65px'}}>
                        <p
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#8B8E91',

                            width: '260px',
                            marginLeft: '20px',
                          }}
                        >
                          Close Time
                        </p>
                        <div style={{width: '50px'}}></div>

                        <p
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#fff',

                            marginRight: '120px',
                          }}
                        >
                          {closeDate} {closeTimeString} ({displayedTz})
                        </p>
                      </div>

                      <div style={{display: 'flex'}}>
                        <div style={{width: '50px'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Info: User (20230516 - Shirley) */}
            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  top: '0',
                  left: '60px',
                  display: 'flex',
                  height: '60px',
                  width: '60px',
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
                    fontSize: 40,
                    fontWeight: 'extrabold',
                    color: 'rgba(229, 231, 235, 1)',
                  }}
                >
                  {displayedUser}
                </span>
              </div>{' '}
              <p
                style={{
                  marginLeft: '80px',
                  fontSize: 18,
                  fontWeight: 'bolder',
                  color: 'rgba(229, 231, 235, 1)',
                }}
              >
                {userName}
              </p>
              {/* Info: QR Code (20230509 - Shirley) */}
              <img
                style={{display: 'flex', justifySelf: 'end', marginTop: 'auto', marginLeft: '1rem'}}
                src={`${qrcodeUrl}`}
                width={80}
                height={80}
                alt="qrcode"
              />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: BG_WIDTH_OF_SHARING_RECORD,
      height: BG_HEIGHT_OF_SHARING_RECORD,
      fonts: [
        {
          name: 'Barlow',
          data: BarlowBuffer,
          weight: 400,
          style: 'normal',
        },
      ],
    }
  );
  return imageResponse;
}

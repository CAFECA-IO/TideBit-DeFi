import {NextApiRequest, NextApiResponse} from 'next';
import {ImageResponse} from 'next/server';
import {randomIntFromInterval, roundToDecimalPlaces} from '../../../../lib/common';
import {
  TypeOfPnLColorHex,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
  WIDTH_HEIGHT_OF_SHARING_RECORD,
} from '../../../../constants/display';
import {API_DOMAIN, DOMAIN, FRACTION_DIGITS, unitAsset} from '../../../../constants/config';
import {ProfitState} from '../../../../constants/profit_state';
import {TypeOfPosition} from '../../../../constants/type_of_position';
import {Currency} from '../../../../constants/currency';
import {
  ISharingOrder,
  getDummySharingOrder,
  isDummySharingOrder,
} from '../../../../interfaces/tidebit_defi_background/sharing_order';
import {useRouter} from 'next/router';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {pathname} = new URL(req?.url ?? '');
  const params = pathname.split('/');
  const cfdId = params.pop(); // TODO: send to api (20230508 - Shirley)

  // TODO: Data from API (20230508 - Shirley)
  const {tickerId, user, targetAssetName, typeOfPosition, openPrice, closePrice, leverage} =
    getDummySharingOrder() as ISharingOrder;

  const displayedUser = user.slice(-1).toUpperCase();

  const iconUrl = DOMAIN + `/asset_icon/${tickerId.toLowerCase()}.svg`;
  const qrcodeUrl = DOMAIN + `/elements/tidebit_qrcode.svg`;

  const backgroundImageUrl = DOMAIN + '/elements/group_15214@2x.png';

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
    <svg xmlns="http://www.w3.org/2000/svg" width="28.125" height="36" viewBox="0 0 28.125 36">
      <path
        fill="#e86d6d"
        d="M18 36L3.937 14.906h7.576V0h12.973v14.906h7.576z"
        transform="translate(-3.937)"
      ></path>
    </svg>
  );

  const displayedArrow = profitState === ProfitState.PROFIT ? upArrow : downArrow;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          position: 'relative',
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
            {/* Info: QR Code (20230509 - Shirley) */}
            <svg
              style={{
                position: 'absolute',
                top: '420px',
                left: '390px',
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              x="0"
              y="0"
              version="1.1"
              viewBox="0 0 1160 1160"
              xmlSpace="preserve"
            >
              <path fill="#FFF" d="M0 0H1160V1160H0z"></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) translate(320) scale(.08)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) translate(360) scale(.08)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) translate(440) scale(.08)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) translate(520) scale(.08)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) translate(560) scale(.08)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 320 40)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 360 40)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 400 40)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 520 40)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 320 80)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 440 80)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 520 80)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 560 80)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 600 80)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 360 120)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 440 120)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 480 120)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 520 120)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 640 120)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 320 160)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 400 160)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 440 160)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 560 160)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 640 160)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 400 200)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 440 200)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 520 200)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 560 200)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 320 240)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 400 240)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 480 240)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 560 240)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 640 240)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 440 280)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 520 280)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 560 280)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 640 280)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 0 320)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 120 320)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 160 320)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 200 320)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 240 320)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 280 320)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 320 320)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 360 320)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 400 320)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 560 320)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 640 320)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 680 320)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 800 320)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 880 320)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 920 320)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 960 320)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 0 360)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 80 360)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 160 360)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 320 360)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 400 360)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 520 360)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 560 360)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 600 360)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 640 360)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 760 360)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 800 360)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 840 360)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 880 360)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 920 360)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 40 400)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 80 400)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 160 400)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 240 400)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 280 400)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 320 400)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 400 400)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 440 400)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 560 400)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 600 400)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 680 400)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 800 400)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 840 400)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 960 400)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 0 440)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 40 440)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 80 440)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 160 440)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 200 440)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 320 440)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 400 440)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 560 440)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 720 440)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 760 440)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 840 440)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 880 440)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 920 440)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 960 440)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 80 480)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 240 480)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 320 480)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 360 480)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 440 480)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 480 480)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 560 480)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 600 480)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 720 480)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 960 480)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 0 520)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 80 520)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 120 520)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 160 520)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 320 520)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 360 520)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 560 520)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 600 520)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 640 520)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 800 520)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 920 520)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 0 560)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 40 560)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 120 560)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 240 560)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 400 560)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 440 560)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 480 560)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 560 560)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 600 560)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 680 560)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 720 560)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 800 560)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 840 560)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 880 560)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 920 560)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 960 560)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 0 600)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 200 600)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 360 600)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 400 600)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 440 600)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 560 600)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 640 600)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 720 600)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 760 600)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 840 600)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 880 600)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 960 600)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 0 640)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 240 640)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 280 640)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 320 640)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 360 640)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 480 640)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 520 640)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 640 640)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 680 640)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 720 640)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 760 640)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 800 640)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 880 640)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 920 640)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 320 680)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 360 680)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 440 680)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 480 680)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 640 680)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 800 680)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 880 680)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 920 680)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 320 720)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 360 720)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 400 720)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 440 720)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 560 720)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 640 720)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 720 720)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 800 720)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 960 720)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 320 760)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 440 760)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 520 760)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 600 760)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 640 760)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 800 760)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 920 760)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 960 760)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 320 800)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 360 800)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 440 800)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 480 800)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 560 800)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 600 800)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 640 800)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 680 800)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 720 800)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 760 800)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 800 800)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 320 840)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 440 840)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 480 840)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 520 840)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 560 840)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 680 840)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 720 840)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 920 840)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 960 840)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 360 880)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 400 880)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 440 880)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 520 880)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 600 880)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 680 880)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 800 880)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 840 880)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 880 880)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 920 880)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 960 880)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 440 920)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 560 920)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 720 920)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 760 920)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 800 920)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 880 920)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 920 920)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 960 920)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 320 960)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 400 960)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 480 960)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 640 960)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 720 960)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 840 960)"
              ></path>
              <path
                d="M250 0c138.077 0 250 111.93 250 250 0 138.077-111.923 250-250 250C111.93 500 0 388.077 0 250 0 111.93 111.93 0 250 0z"
                transform="translate(80 80) matrix(.08 0 0 .08 960 960)"
              ></path>
              <path
                fill="none"
                d="M65.859 15.008H34.141a19.313 19.313 0 00-10.979 3.398 19.025 19.025 0 00-5.848 6.421A18.328 18.328 0 0015 33.758v32.471c0 10.344 8.586 18.76 19.145 18.76L50 84.992l15.855-.004C76.414 84.988 85 76.572 85 66.229V33.758c0-10.339-8.586-18.75-19.141-18.75z"
                transform="translate(80 80) scale(2.8)"
              ></path>
              <path
                d="M65.859.008H34.141C18.683.008 5.587 10.221 1.4 24.18a33.128 33.128 0 00-1.006 4.445A33.552 33.552 0 000 33.758v32.471c0 18.619 15.32 33.76 34.141 33.76L50 99.992l15.859-.004c18.82 0 34.141-15.141 34.141-33.76v-32.47C100 15.148 84.68.008 65.859.008zM85 66.229c0 10.344-8.586 18.76-19.145 18.76L50 84.992l-15.855-.004C23.586 84.988 15 76.572 15 66.229V33.758c0-3.231.838-6.273 2.313-8.931a19.025 19.025 0 015.848-6.421 19.305 19.305 0 0110.979-3.398h31.719C76.414 15.008 85 23.419 85 33.758v32.471z"
                transform="translate(80 80) scale(2.8)"
              ></path>
              <path
                fill="none"
                d="M65.859 15.008H34.141a19.313 19.313 0 00-10.979 3.398 19.025 19.025 0 00-5.848 6.421A18.328 18.328 0 0015 33.758v32.471c0 10.344 8.586 18.76 19.145 18.76L50 84.992l15.855-.004C76.414 84.988 85 76.572 85 66.229V33.758c0-10.339-8.586-18.75-19.141-18.75z"
                transform="translate(80 80) translate(720) scale(2.8)"
              ></path>
              <path
                d="M65.859.008H34.141C18.683.008 5.587 10.221 1.4 24.18a33.128 33.128 0 00-1.006 4.445A33.552 33.552 0 000 33.758v32.471c0 18.619 15.32 33.76 34.141 33.76L50 99.992l15.859-.004c18.82 0 34.141-15.141 34.141-33.76v-32.47C100 15.148 84.68.008 65.859.008zM85 66.229c0 10.344-8.586 18.76-19.145 18.76L50 84.992l-15.855-.004C23.586 84.988 15 76.572 15 66.229V33.758c0-3.231.838-6.273 2.313-8.931a19.025 19.025 0 015.848-6.421 19.305 19.305 0 0110.979-3.398h31.719C76.414 15.008 85 23.419 85 33.758v32.471z"
                transform="translate(80 80) translate(720) scale(2.8)"
              ></path>
              <path
                fill="none"
                d="M65.859 15.008H34.141a19.313 19.313 0 00-10.979 3.398 19.025 19.025 0 00-5.848 6.421A18.328 18.328 0 0015 33.758v32.471c0 10.344 8.586 18.76 19.145 18.76L50 84.992l15.855-.004C76.414 84.988 85 76.572 85 66.229V33.758c0-10.339-8.586-18.75-19.141-18.75z"
                transform="translate(80 80) matrix(2.8 0 0 2.8 0 720)"
              ></path>
              <path
                d="M65.859.008H34.141C18.683.008 5.587 10.221 1.4 24.18a33.128 33.128 0 00-1.006 4.445A33.552 33.552 0 000 33.758v32.471c0 18.619 15.32 33.76 34.141 33.76L50 99.992l15.859-.004c18.82 0 34.141-15.141 34.141-33.76v-32.47C100 15.148 84.68.008 65.859.008zM85 66.229c0 10.344-8.586 18.76-19.145 18.76L50 84.992l-15.855-.004C23.586 84.988 15 76.572 15 66.229V33.758c0-3.231.838-6.273 2.313-8.931a19.025 19.025 0 015.848-6.421 19.305 19.305 0 0110.979-3.398h31.719C76.414 15.008 85 23.419 85 33.758v32.471z"
                transform="translate(80 80) matrix(2.8 0 0 2.8 0 720)"
              ></path>
              <g>
                <g transform="translate(80 80) matrix(1.2 0 0 1.2 80 80)">
                  <path d="M27.351 100C12.261 100-.014 87.968-.014 73.192V26.794c0-4.616 1.2-8.96 3.301-12.761a27.062 27.062 0 018.36-9.174A27.606 27.606 0 0127.336 0h45.327c15.076 0 27.351 12.018 27.351 26.793v46.398c0 14.775-12.274 26.808-27.351 26.808H27.351z"></path>
                </g>
              </g>
              <g>
                <g transform="translate(80 80) matrix(1.2 0 0 1.2 800 80)">
                  <path d="M27.351 100C12.261 100-.014 87.968-.014 73.192V26.794c0-4.616 1.2-8.96 3.301-12.761a27.062 27.062 0 018.36-9.174A27.606 27.606 0 0127.336 0h45.327c15.076 0 27.351 12.018 27.351 26.793v46.398c0 14.775-12.274 26.808-27.351 26.808H27.351z"></path>
                </g>
              </g>
              <g>
                <g transform="translate(80 80) matrix(1.2 0 0 1.2 80 800)">
                  <path d="M27.351 100C12.261 100-.014 87.968-.014 73.192V26.794c0-4.616 1.2-8.96 3.301-12.761a27.062 27.062 0 018.36-9.174A27.606 27.606 0 0127.336 0h45.327c15.076 0 27.351 12.018 27.351 26.793v46.398c0 14.775-12.274 26.808-27.351 26.808H27.351z"></path>
                </g>
              </g>
            </svg>

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
                        {openPrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)}
                        <span
                          style={{
                            marginTop: '2px',
                            fontSize: '12px',
                            fontWeight: 'lighter',
                            color: '#8B8E91',
                            fontFamily: 'barlow',
                            marginLeft: '5px',
                          }}
                        >
                          {unitAsset}
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
                        {closePrice?.toLocaleString(
                          UNIVERSAL_NUMBER_FORMAT_LOCALE,
                          FRACTION_DIGITS
                        )}
                        <span
                          style={{
                            marginTop: '2px',
                            fontSize: '12px',
                            fontWeight: 'lighter',
                            color: '#8B8E91',
                            fontFamily: 'barlow',
                            marginLeft: '5px',
                          }}
                        >
                          {unitAsset}
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
                          marginRight: '1px',
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

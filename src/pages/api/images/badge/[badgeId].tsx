import {NextApiRequest, NextApiResponse} from 'next';
import {ImageResponse} from 'next/server';
import {timestampToString, adjustTimestamp} from '../../../../lib/common';
import {IBadge} from '../../../../interfaces/tidebit_defi_background/badge';
import {
  BADGE_LIST,
  SIZE_OF_SHARING_BADGE,
  BG_WIDTH_OF_SHARING_RECORD,
  BG_HEIGHT_OF_SHARING_RECORD,
} from '../../../../constants/display';
import {DOMAIN, API_URL} from '../../../../constants/config';
import {BARLOW_BASE64} from '../../../../constants/fonts';
import {Buffer} from 'buffer';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ToDo:(20230525 - Julian) send to API
  const url = new URL(req?.url ?? '');
  const params = url.pathname.split('/');
  const badgeId = params.pop();
  const apiUrl = `${API_URL}/public/shared/badge/${badgeId}`;
  const tz = Number(url.searchParams.get('tz'));

  const dummySharingBadge = {
    badgeId: 'BADGE0001',
    badgeName: 'Monthly_Top_20',
    userId: '0x553687656C04b',
    receiveTime: 1636789600,
  };

  let sharingBadge: IBadge = dummySharingBadge;

  // ToDo:(20230525 - Julian) get Data from API
  // const fetchBagde = async () => {
  //   try {
  //     const badgeResponse = await fetch(apiUrl, {
  //       method: 'GET',
  //       headers: {'Content-Type': 'application/json'},
  //     });
  //     const badge = await badgeResponse.json();

  //     if (badge?.success) {
  //       if (isSharingOrder(order?.data)) {
  //         sharingOrder = order?.data;
  //       }
  //     }
  //   } catch (e) {
  //     // TODO: error handling
  //   }

  //   return sharingOrder;
  // };

  try {
    // ToDo:(20230526 - Julian) API data
    //await fetchBagde();

    const offset = new Date().getTimezoneOffset() / 60;
    const adReceiveTimestamp = adjustTimestamp(offset, sharingBadge.receiveTime ?? 0, tz);

    sharingBadge = {
      ...sharingBadge,
      receiveTime: adReceiveTimestamp,
    };
  } catch (e) {
    // ToDo:(20230526 - Julian) show the invalid dummy order img
  }

  const {badgeName, userId, receiveTime} = sharingBadge as IBadge;

  // Info:(20230526 - Julian) adjustTimestamp
  const {date: receiveDate} = timestampToString(receiveTime);

  // ToDo: (20230525 - Julian) QRCode
  const qrcodeUrl = DOMAIN + `/elements/tidebit_qrcode.svg`;

  const displayedUser = userId.slice(-1).toUpperCase();
  const displayedUserName = userId;
  const displayedBadgeName = badgeName.replaceAll('_', ' ');

  const badgeImage = BADGE_LIST.find(badge => badge.name === badgeName)?.icon ?? '';
  const badgeImageUrl = DOMAIN + badgeImage;
  const bgImageUrl = DOMAIN + '/elements/share_badge_bg@2x.png';

  const BarlowBuffer = Buffer.from(BARLOW_BASE64, 'base64');

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
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
              transform: 'translateX(300px)',
              backgroundImage: `url(${bgImageUrl})`,
              objectFit: 'contain',
              backgroundSize: `${SIZE_OF_SHARING_BADGE}px ${SIZE_OF_SHARING_BADGE}px`,
              backgroundPosition: 'relative',
              backgroundRepeat: 'no-repeat',

              padding: '50px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              height: `${SIZE_OF_SHARING_BADGE}px`,
              width: `${SIZE_OF_SHARING_BADGE}px`,
            }}
          >
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    left: '10px',
                    display: 'flex',
                    height: '60px',
                    width: '60px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    borderRadius: '50%',
                    backgroundColor: '#29C1E1',
                    color: '#F2F2F2',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      fontSize: 40,
                      fontWeight: 'extrabold',
                      color: '#F2F2F2',
                    }}
                  >
                    {displayedUser}
                  </span>
                </div>
                <p
                  style={{
                    position: 'relative',
                    marginLeft: '20px',
                    fontSize: 18,
                    fontWeight: 'bolder',
                    color: '#F2F2F2',
                  }}
                >
                  {displayedUserName}
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#F2F2F2',
                }}
              >
                <span
                  style={{
                    color: '#8B8E91',
                  }}
                >
                  Date :
                </span>
                {receiveDate}
              </div>
            </div>
            <div
              style={{
                width: '100%',
                marginTop: '30px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img src={`${badgeImageUrl}`} width={250} height={250} alt="bagde" />
              <p
                style={{
                  marginTop: '10px',
                  fontSize: '36px',
                  color: `#F2F2F2`,
                }}
              >
                {displayedBadgeName}
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                justifySelf: 'end',
                marginLeft: 'auto',
              }}
            >
              <img src={`${qrcodeUrl}`} width={100} height={100} alt="qr_code" />
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

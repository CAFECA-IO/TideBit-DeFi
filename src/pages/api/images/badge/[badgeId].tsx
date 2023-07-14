import {NextApiRequest, NextApiResponse} from 'next';
import {ImageResponse} from 'next/server';
import {timestampToString, adjustTimestamp, accountTruncate} from '../../../../lib/common';
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
  const url = new URL(req?.url ?? '');
  const params = url.pathname.split('/');
  const badgeId = params.pop();
  const apiUrl = `${API_URL}/badges/${badgeId}`;
  const tz = Number(url.searchParams.get('tz'));

  const dummySharingBadge: IBadge = {
    badgeId: 'BADGE_ID',
    badgeName: '',
    userId: 'X',
    receiveTime: 0,
  };

  let sharingBadge: IBadge = dummySharingBadge;

  // ToDo:(20230525 - Julian) get Data from context
  const fetchBagde = async () => {
    try {
      const badgeResponse = await fetch(apiUrl, {
        method: 'GET',
      });
      const badge = await badgeResponse.json();

      if (badge?.success) {
        sharingBadge = badge?.data;
      }
    } catch (e) {
      // TODO: error handling (20230713 - Julian)
    }

    return sharingBadge;
  };

  try {
    await fetchBagde();

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

  // Info: (20230525 - Julian) QRCode
  const qrcodeUrl = DOMAIN + `/elements/tidebit_qrcode.svg`;

  const displayedUser = userId.slice(-1).toUpperCase();
  const displayedUserName = accountTruncate(userId, 16);
  const displayedBadgeName = badgeName.replaceAll('_', ' ');

  const badgeImage = BADGE_LIST.find(badge => badge.name === badgeName)?.icon ?? '';
  const badgeImageUrl = DOMAIN + badgeImage;
  const bgImageUrl = DOMAIN + '/elements/share_badge_bg@2x.png';

  // Info:(20230714 - Julian) Page Link icon
  const marketIconUrl = DOMAIN + '/elements/market_icon@2x.png';
  const leaderboardIconUrl = DOMAIN + '/elements/leaderboard_icon@2x.png';

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
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
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
                      fontSize: 30,
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
              <div style={{display: 'flex'}}>
                <img src={`${qrcodeUrl}`} width={70} height={70} alt="qr_code" />
              </div>
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img src={`${badgeImageUrl}`} width={250} height={250} alt="bagde_image" />

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: '-20px',
                }}
              >
                <p
                  style={{
                    fontSize: '40px',
                    fontWeight: 'bold',
                    color: `#F2F2F2`,
                  }}
                >
                  {displayedBadgeName}
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '18px',
                    marginTop: '-20px',
                  }}
                >
                  <span style={{color: '#8B8E91'}}>Date : </span>
                  <p style={{color: '#F2F2F2'}}>{receiveDate}</p>
                </div>
              </div>
            </div>
            <div
              style={{
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

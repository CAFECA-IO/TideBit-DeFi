import {NextApiRequest, NextApiResponse} from 'next';
import {ImageResponse} from 'next/server';
import {timestampToString, accountTruncate} from '../../../../lib/common';
import {BADGE_LIST} from '../../../../constants/display';
import {DOMAIN} from '../../../../constants/config';
import {BARLOW_BASE64} from '../../../../constants/fonts';
import {Buffer} from 'buffer';

export const config = {
  runtime: 'edge',
};

export interface ISharingBadge {
  badgeId: string;
  badgeName: string;
  user: string;
  receiveTime: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ToDo:(20230525 - Julian) send to API
  //const {pathname} = new URL(req?.url ?? '');
  //const params = pathname.split('/');
  //const cfdId = params.pop();

  // ToDo:(20230525 - Julian) get Data from API
  const dummySharingBadge = {
    badgeId: 'BADGE0001',
    badgeName: 'Monthly_Top_20',
    user: '0x553687656C04b',
    receiveTime: 1636789600,
  };

  const {badgeName, user, receiveTime} = dummySharingBadge as ISharingBadge;

  const {date: receiveDate} = timestampToString(receiveTime);

  const displayedUser = user.slice(-1).toUpperCase();
  const displayedUserName = accountTruncate(user);
  const displayedBadgeName = badgeName.replaceAll('_', ' ');

  const badgeImage = BADGE_LIST.find(badge => badge.name === badgeName)?.icon ?? '';
  const badgeImageUrl = DOMAIN + badgeImage;
  // ToDo: (20230525 - Julian) can't see background image
  const bgImageUrl = DOMAIN + '/elements/share_badge_bg.svg';

  const BarlowBuffer = Buffer.from(BARLOW_BASE64, 'base64');

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
            height: `630px`,
            width: `630px`,
            backgroundColor: '#000',
          }}
        >
          <div
            style={{
              backgroundImage: `url(${bgImageUrl})`,
              objectFit: 'contain',
              backgroundSize: `630px 630px`,
              backgroundPosition: 'relative',
              backgroundRepeat: 'no-repeat',

              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              height: `100%`,
              width: `100%`,
            }}
          >
            <div
              style={{
                width: '100%',
                padding: '20px',
                display: 'flex',
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
                    top: '0',
                    left: '40px',
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
                      fontSize: 40,
                      fontWeight: 'extrabold',
                      color: '#F2F2F2',
                    }}
                  >
                    {displayedUser}
                  </span>
                </div>{' '}
                <p
                  style={{
                    marginLeft: '50px',
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
            </div>{' '}
            <div style={{display: 'flex'}}>
              <div
                style={{
                  marginTop: '40px',
                  display: 'flex',
                  width: '100%',
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
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 630,
      height: 630,
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

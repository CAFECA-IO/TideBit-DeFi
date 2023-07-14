import Head from 'next/head';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useContext, useEffect} from 'react';
import {AppContext} from '../../../contexts/app_context';
import {GetServerSideProps} from 'next';
import {useRouter} from 'next/router';
import {BG_WIDTH_OF_SHARING_RECORD, BG_HEIGHT_OF_SHARING_RECORD} from '../../../constants/display';
import Error from 'next/error';
import {DOMAIN} from '../../../constants/config';
import useStateRef from 'react-usestateref';
import Link from 'next/link';
import {TBDURL} from '../../../constants/api_request';

interface IPageProps {
  badgeId: string;
}

const BadgeSharing = (props: IPageProps) => {
  const appCtx = useContext(AppContext);
  const router = useRouter();

  const [userTz, setUserTz, userTzRef] = useStateRef<number>(0);

  // TODO: for meta content (20230525 - Julian)
  const img = `https://tidebit-defi-1gnq146up-cafeca.vercel.app/api/images/badge/${props.badgeId}?tz=${userTzRef.current}`; //`${DOMAIN}/api/images/badge/${props.badgeId}?tz=${userTzRef.current}`;
  const displayImg = `https://tidebit-defi-1gnq146up-cafeca.vercel.app/api/images/badge/${props.badgeId}?tz=${userTzRef.current}`; //`/api/images/badge/${props.badgeId}?tz=${userTzRef.current}`;
  const share = `https://tidebit-defi-1gnq146up-cafeca.vercel.app/share/badge/${props.badgeId}`; //`${DOMAIN}/share/badge/${props.badgeId}`;

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  useEffect(() => {
    try {
      const timezoneOffset = new Date().getTimezoneOffset();
      const timeDiff = -timezoneOffset / 60;

      setUserTz(timeDiff);
    } catch (error) {
      // TODO: error handling (20230526 - Julian)
    }
  }, [appCtx.isInit]);

  if (!router.isFallback && !props.badgeId) {
    return <Error statusCode={404} />;
  }

  const displayedImage = appCtx.isInit ? (
    <div className="flex w-full justify-center">
      <Link href="/">
        <img
          src={displayImg}
          width={BG_WIDTH_OF_SHARING_RECORD}
          height={BG_HEIGHT_OF_SHARING_RECORD}
          alt="Badge record"
          className="relative hover:cursor-pointer hover:opacity-90"
        />
      </Link>

      <div className="absolute top-0 z-10 h-630px w-630px">
        <div className="absolute bottom-16 right-0 mx-8 flex items-center space-x-8">
          {/* Info:(20230714 - Julian) Market Link */}
          <Link href={TBDURL.TRADE}>
            <div className="flex h-100px w-70px"></div>
          </Link>
          {/* Info:(20230714 - Julian) Leaderboard Link */}
          <Link href={TBDURL.LEADERBOARD}>
            <div className="flex h-100px w-70px"></div>
          </Link>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <Head>
        <title>TideBit DeFi - Badge Sharing</title>
        <meta name="description" content="Badge Sharing" />
        <meta name="keywords" content="Badge Sharing" />
        <meta name="author" content="TideBit" />
        <meta name="application-name" content="TideBit DeFi" />
        <meta name="apple-mobile-web-app-title" content="TideBit DeFi" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" />

        <meta property="og:title" content="TideBit DeFi Badge" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={share} />
        <meta property="og:image" content={img} />
        <meta property="og:image:alt" content="TideBit DeFi Badge" />
        <meta property="og:image:width" content={BG_WIDTH_OF_SHARING_RECORD.toString()} />
        <meta property="og:image:height" content={BG_HEIGHT_OF_SHARING_RECORD.toString()} />
        <meta property="og:description" content="TideBit DeFi Badge Sharing" />
        <meta property="og:site_name" content="TideBit DeFi" />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@tidebit" />
        <meta name="twitter:creator" content="@tidebit" />
        <meta name="twitter:url" content={DOMAIN} />
        <meta name="twitter:title" content="TideBit DeFi Badge" />
        <meta name="twitter:description" content="TideBit DeFi Badge" />
        <meta name="twitter:image" content={img} />
        <meta name="twitter:image:alt" content="TideBit DeFi Badge" />
      </Head>
      {displayedImage}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<IPageProps> = async ({params, locale}) => {
  if (!params || !params.badgeId || typeof params.badgeId !== 'string') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      badgeId: params.badgeId,
      ...(await serverSideTranslations(locale as string, ['common', 'footer'])),
    },
  };
};

export default BadgeSharing;

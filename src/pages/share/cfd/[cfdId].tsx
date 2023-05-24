import Head from 'next/head';
import NavBar from '../../../components/nav_bar/nav_bar';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useContext, useEffect} from 'react';
import {AppContext} from '../../../contexts/app_context';
import TradePageBody from '../../../components/trade_page_body/trade_page_body';
import {MarketContext} from '../../../contexts/market_context';
import {useGlobal} from '../../../contexts/global_context';
import NavBarMobile from '../../../components/nav_bar_mobile/nav_bar_mobile';
import {GetServerSideProps, GetStaticPaths, GetStaticProps} from 'next';
import {useRouter} from 'next/router';
import Error from 'next/error';
import {findCurrencyByCode, getTimestamp, hasValue, timestampToString} from '../../../lib/common';
// import {tickerIds} from '../../../constants/config';
import {Currency} from '../../../constants/currency';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import Image from 'next/image';
import {DOMAIN} from '../../../constants/config';
import {
  BG_HEIGHT_OF_SHARING_RECORD,
  BG_WIDTH_OF_SHARING_RECORD,
  HEIGHT_OF_SHARING_RECORD,
  WIDTH_OF_SHARING_RECORD,
} from '../../../constants/display';
import {CustomError} from '../../../lib/custom_error';
import {Code} from '../../../constants/code';
import useStateRef from 'react-usestateref';
import Link from 'next/link';

interface IPageProps {
  cfdId: string;
}

const CfdSharing = (props: IPageProps) => {
  const appCtx = useContext(AppContext);
  const router = useRouter();

  const [userTz, setUserTz, userTzRef] = useStateRef<number>(0);

  // Deprecated: called by component by `fetch` won't have any query or props unless type something on the url of the browser (20230523 - Shirley)
  const {query} = router;
  // eslint-disable-next-line no-console
  console.log('query in share/cfd', query);

  // TODO: for meta content (20230505 - Shirley)
  const img = `${DOMAIN}/api/images/cfd/${props.cfdId}?tz=${userTzRef.current}`;
  const displayImg = `/api/images/cfd/${props.cfdId}?tz=${userTzRef.current}`;
  const share = `${DOMAIN}/share/cfd/${props.cfdId}`;

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
      // TODO: error handling (20230524 - Shirley)
    }
  }, [appCtx.isInit]);

  if (!router.isFallback && !props.cfdId) {
    return <Error statusCode={404} />;
  }

  const displayedImage = appCtx.isInit ? (
    <Link href="/">
      <div className="flex w-full justify-center">
        <img
          src={displayImg}
          width={BG_WIDTH_OF_SHARING_RECORD}
          height={BG_HEIGHT_OF_SHARING_RECORD}
          alt="CFD record"
          className="hover:opacity-90"
        />
      </div>
    </Link>
  ) : null;

  return (
    <>
      <Head>
        <title>TideBit DeFi - CFD Sharing</title>
        <meta name="description" content="CFD Sharing" />
        <meta name="keywords" content="CFD Sharing" />
        <meta name="author" content="TideBit" />
        <meta name="application-name" content="TideBit DeFi" />
        <meta name="apple-mobile-web-app-title" content="TideBit DeFi" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" />

        <meta property="og:title" content="TideBit DeFi CFD" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={share} />
        <meta property="og:image" content={img} />
        <meta property="og:image:width" content={BG_WIDTH_OF_SHARING_RECORD.toString()} />
        <meta property="og:image:height" content={BG_HEIGHT_OF_SHARING_RECORD.toString()} />
        <meta property="og:description" content="TideBit DeFi CFD Sharing" />
        <meta property="og:site_name" content="TideBit DeFi" />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@tidebit" />
        <meta name="twitter:creator" content="@tidebit" />
        <meta name="twitter:url" content={DOMAIN} />
        <meta name="twitter:title" content="TideBit DeFi CFD" />
        <meta name="twitter:description" content="TideBit DeFi CFD" />
        <meta name="twitter:image" content={img} />
        <meta name="twitter:image:alt" content="TideBit DeFi CFD" />
      </Head>
      {displayedImage}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<IPageProps> = async ({params, locale}) => {
  if (!params || !params.cfdId || typeof params.cfdId !== 'string') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      cfdId: params.cfdId,
      ...(await serverSideTranslations(locale as string, ['common', 'footer'])),
    },
  };
};

export default CfdSharing;

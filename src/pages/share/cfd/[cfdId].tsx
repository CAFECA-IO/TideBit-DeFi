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
import {findCurrencyByCode, hasValue} from '../../../lib/common';
// import {tickerIds} from '../../../constants/config';
import {Currency} from '../../../constants/currency';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import Image from 'next/image';
import {API_DOMAIN, DOMAIN} from '../../../constants/config';
import {WIDTH_HEIGHT_OF_SHARING_RECORD} from '../../../constants/display';
import {CustomError} from '../../../lib/custom_error';
import {Code} from '../../../constants/code';
import useStateRef from 'react-usestateref';

interface IPageProps {
  cfdId: string;
}

const CfdSharing = (props: IPageProps) => {
  const appCtx = useContext(AppContext);
  const router = useRouter();

  const [imgUrl, setImgUrl, imgUrlRef] = useStateRef<string>('');
  const [isVisible, setIsVisible, isVisibleRef] = useStateRef<boolean>(false);

  const {cfdId} = router.query;

  // TODO: for meta content (20230505 - Shirley)
  const img = `${DOMAIN}/api/images/cfd/${props.cfdId}`;
  const displayImg = `/api/images/cfd/${props.cfdId}`;

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setImgUrl(`${DOMAIN}/api/images/cfd/${props.cfdId}`);
        setTimeout(() => {
          setIsVisible(true);
        }, 500);
      } catch (e) {
        // TODO: Error handling (20230508 - Shirley)
        // eslint-disable-next-line no-console
        console.log(`Failed to get image: ${e}`);
        throw new CustomError(Code.CANNOT_CONVERT_TO_IMAGE);
      }
    })();
  }, [props.cfdId]);

  if (!router.isFallback && !props.cfdId) {
    return <Error statusCode={404} />;
  }

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
        <meta property="og:url" content="https://tidebit-defi.com/" />
        <meta property="og:image" content={img} />
        <meta property="og:image:width" content={WIDTH_HEIGHT_OF_SHARING_RECORD.toString()} />
        <meta property="og:image:height" content={WIDTH_HEIGHT_OF_SHARING_RECORD.toString()} />
        <meta property="og:description" content="CFD Sharing" />
        <meta property="og:site_name" content="TideBit" />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@tidebit" />
        <meta name="twitter:creator" content="@tidebit" />
        <meta name="twitter:url" content="https://tidebit-defi.com/" />
        <meta name="twitter:title" content="TideBit DeFi CFD" />
        <meta name="twitter:description" content="TideBit DeFi CFD" />
        <meta name="twitter:image" content={img} />
        <meta name="twitter:image:alt" content="TideBit DeFi CFD" />
      </Head>
      {appCtx.isInit && isVisibleRef.current ? (
        <img
          src={displayImg}
          width={WIDTH_HEIGHT_OF_SHARING_RECORD}
          height={WIDTH_HEIGHT_OF_SHARING_RECORD}
          alt="CFD record"
        />
      ) : null}
    </>
  );
};

export const getStaticProps: GetStaticProps<IPageProps> = async ({params, locale}) => {
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

/**
 * Info: (20230504 - Shirley) getStaticPaths
 * In development (npm run dev or yarn dev), `getStaticPaths` runs on every request.
 * In production, `getStaticPaths` runs at build time.
 */
export const getStaticPaths: GetStaticPaths = async ({locales}) => {
  // TODO: cfdIds should be fetched from API (20230504 - Shirley)
  const cfdIds = ['test'];
  const paths = cfdIds
    .flatMap(id => {
      return locales?.map(locale => ({
        params: {cfdId: id},
        locale: locale,
      }));
    })
    .filter((path): path is {params: {cfdId: string}; locale: string} => !!path);

  return {
    paths: paths,
    fallback: true,
  };
};

export default CfdSharing;

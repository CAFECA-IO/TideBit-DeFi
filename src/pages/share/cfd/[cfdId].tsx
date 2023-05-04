import Head from 'next/head';
import NavBar from '../../../components/nav_bar/nav_bar';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useContext, useEffect} from 'react';
import {AppContext} from '../../../contexts/app_context';
import TradePageBody from '../../../components/trade_page_body/trade_page_body';
import {MarketContext} from '../../../contexts/market_context';
import {useGlobal} from '../../../contexts/global_context';
import NavBarMobile from '../../../components/nav_bar_mobile/nav_bar_mobile';
import {GetStaticPaths, GetStaticProps} from 'next';
import {useRouter} from 'next/router';
import Error from 'next/error';
import {findCurrencyByCode, hasValue} from '../../../lib/common';
// import {tickerIds} from '../../../constants/config';
import {Currency} from '../../../constants/currency';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import Image from 'next/image';

interface IPageProps {
  cfdId: string;
}

const CfdSharing = (props: IPageProps) => {
  const marketCtx = useContext(MarketContext);
  const {layoutAssertion} = useGlobal();
  const appCtx = useContext(AppContext);

  const displayedNavBar = layoutAssertion === 'mobile' ? <NavBarMobile /> : <NavBar />;

  const router = useRouter();
  const {cfdId} = router.query;

  const currencyCode = cfdId ? cfdId.toString().replace('usdt', '').toUpperCase() : Currency.ETH;

  const currency = findCurrencyByCode(currencyCode);

  const redirectToTicker = async () => {
    if (hasValue(marketCtx.availableTickers) && currency) {
      marketCtx.selectTickerHandler(currency);
    }
  };

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  useEffect(() => {
    if ((marketCtx?.selectedTickerRef?.current?.currency?.toString() ?? '') === currency) return;
    redirectToTicker();
  }, [marketCtx.availableTickers]);

  if (!router.isFallback && !props.cfdId) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <Image src="/elements/sharing_example.png" width={500} height={500} alt="record" />
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

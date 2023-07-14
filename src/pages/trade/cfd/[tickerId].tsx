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
import {hasValue, truncateText} from '../../../lib/common';
import {BTC_NEWS_FOLDER, ETH_NEWS_FOLDER, tickerIds} from '../../../constants/config';
import {CodeToTicker} from '../../../constants/ticker';
import {NEWS_INTRODUCTION_IN_TRADE_MAX_LENGTH, TIDEBIT_FAVICON} from '../../../constants/display';
import {getPosts} from '../../../lib/posts';
import {IRecommendedNews} from '../../../interfaces/tidebit_defi_background/news';

interface IPageProps {
  tickerId: string;
  briefs: IRecommendedNews[];
}

const Trading = (props: IPageProps) => {
  const marketCtx = useContext(MarketContext);
  const {layoutAssertion} = useGlobal();
  const appCtx = useContext(AppContext);

  const displayedNavBar = layoutAssertion === 'mobile' ? <NavBarMobile /> : <NavBar />;

  const router = useRouter();
  const {tickerId} = router.query;

  const ticker = CodeToTicker[(tickerId as string).toUpperCase()];

  const redirectToTicker = async () => {
    if (hasValue(marketCtx.availableTickers) && ticker) {
      marketCtx.selectTickerHandler(ticker);
    }
  };

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
      return;
    }
    redirectToTicker();
  }, [appCtx.isInit]);

  if (!router.isFallback && !props.tickerId) {
    return <Error statusCode={404} />;
  }

  return appCtx.isInit ? (
    <>
      <Head>
        <title>CFD - TideBit DeFi</title>
        <link rel="icon" href={TIDEBIT_FAVICON} />
      </Head>

      {displayedNavBar}

      <main>
        <TradePageBody briefs={props.briefs} />
      </main>
    </>
  ) : (
    <div>Loading...</div>
  );
};

export const getStaticProps: GetStaticProps<IPageProps> = async ({params, locale}) => {
  if (!params || !params.tickerId || typeof params.tickerId !== 'string') {
    return {
      notFound: true,
    };
  }

  const dir = params.tickerId === 'ethusdt' ? ETH_NEWS_FOLDER : BTC_NEWS_FOLDER;

  const newsData = await getPosts(dir);
  const briefs: IRecommendedNews[] = newsData.map(news => {
    const description = truncateText(news.description, NEWS_INTRODUCTION_IN_TRADE_MAX_LENGTH);
    return {
      newsId: news.slug ?? '',
      img: `/news/${news.slug}@2x.png`,
      timestamp: news.date,
      title: news.title,
      description: description,
    };
  });

  return {
    props: {
      tickerId: params.tickerId,
      briefs,
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
  const paths = tickerIds
    .flatMap(id => {
      return locales?.map(locale => ({
        params: {tickerId: id},
        locale: locale,
      }));
    })
    .filter((path): path is {params: {tickerId: string}; locale: string} => !!path);

  return {
    paths: paths,
    fallback: false,
  };
};

export default Trading;

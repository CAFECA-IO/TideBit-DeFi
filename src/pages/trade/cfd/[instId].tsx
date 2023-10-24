import Head from 'next/head';
import NavBar from '../../../components/nav_bar/nav_bar';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useContext, useEffect} from 'react';
import {AppContext} from '../../../contexts/app_context';
import TradePageBody from '../../../components/trade_page_body/trade_page_body';
import {MarketContext} from '../../../contexts/market_context';
import {useGlobal} from '../../../contexts/global_context';
import {GetStaticPaths, GetStaticProps} from 'next';
import {useRouter} from 'next/router';
import Error from 'next/error';
import {hasValue, truncateText} from '../../../lib/common';
import {BTC_NEWS_FOLDER, ETH_NEWS_FOLDER, NEWS_FOLDER, instIds} from '../../../constants/config';
import {Ticker} from '../../../constants/ticker';
import {
  NEWS_AMOUNT_ON_TRADE_PAGE,
  NEWS_INTRODUCTION_IN_TRADE_MAX_LENGTH,
  TIDEBIT_FAVICON,
} from '../../../constants/display';
import {getPost, getPosts, getSlugs} from '../../../lib/posts';
import {IRecommendedNews} from '../../../interfaces/tidebit_defi_background/news';

interface IPageProps {
  instId: string;
  briefs: IRecommendedNews[];
}

const HIDDEN = 'hidden';

const Trading = (props: IPageProps) => {
  const marketCtx = useContext(MarketContext);
  const appCtx = useContext(AppContext);

  const displayedNavBar = <NavBar />;

  const router = useRouter();
  const instId = router.query?.instId as string;
  const ticker = instId?.toUpperCase();

  const hideTradingView = router.query?.trading_view === HIDDEN;
  const hideOpenLineGraph = router.query?.open_line_graph === HIDDEN;

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

  if (!router.isFallback && !props.instId) {
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
        <TradePageBody
          briefs={props.briefs}
          hideTradingView={hideTradingView}
          hideOpenLineGraph={hideOpenLineGraph}
        />
      </main>
    </>
  ) : (
    <div>Loading...</div>
  );
};

export const getStaticProps: GetStaticProps<IPageProps> = async ({params, locale}) => {
  if (!params || !params.instId || typeof params.instId !== 'string') {
    return {
      notFound: true,
    };
  }

  const currency = params.instId.toLowerCase().split('-')[0];
  const slugs = await getSlugs(NEWS_FOLDER);
  const certainSlugs = slugs ? slugs.filter(slug => slug.includes(currency)) : [];

  const newsData = [];

  for (let i = 0; i < certainSlugs.length; i++) {
    const slug = certainSlugs[i];
    const news = await getPost(NEWS_FOLDER, slug);
    if (news) {
      newsData.push({...news});
    }
  }

  const briefs: IRecommendedNews[] = newsData
    .map(news => {
      const description = truncateText(news.description, NEWS_INTRODUCTION_IN_TRADE_MAX_LENGTH);
      return {
        newsId: news.slug ?? '',
        img: `/news/${news.slug}.png`,
        timestamp: news.date,
        title: news.title,
        description: description,
      };
    })
    .slice(-NEWS_AMOUNT_ON_TRADE_PAGE);

  return {
    props: {
      instId: params.instId,
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
  const paths = instIds
    .flatMap(id => {
      return locales?.map(locale => ({
        params: {instId: id},
        locale: locale,
      }));
    })
    .filter((path): path is {params: {instId: string}; locale: string} => !!path);

  return {
    paths: paths,
    fallback: false,
  };
};

export default Trading;

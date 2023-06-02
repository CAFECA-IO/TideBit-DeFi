import {useRouter} from 'next/router';
// import News from '../../components/News';
import {GetServerSideProps} from 'next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import NewsPageBody from '../../components/news_page_body/news_page_body';
import NewsArticle from '../../components/news_article/news_article';
import {useGlobal} from '../../contexts/global_context';
import NavBarMobile from '../../components/nav_bar_mobile/nav_bar_mobile';
import NavBar from '../../components/nav_bar/nav_bar';
import Head from 'next/head';
import {useContext, useEffect} from 'react';
import {AppContext} from '../../contexts/app_context';
import Footer from '../../components/footer/footer';
import {
  getDummyNews,
  getDummyRecommendationNews,
} from '../../interfaces/tidebit_defi_background/news';
import {Currency} from '../../constants/currency';
import {MarketContext} from '../../contexts/market_context';

interface IPageProps {
  newsId: string;
}

// This data should be replaced with actual fetched data
const data = [
  /* Dummy data of news here */
  {params: {newsId: 'n001'}},
  {params: {newsId: 'n002'}},
  {params: {newsId: 'n003'}},
  {params: {newsId: 'n004'}},
  {params: {newsId: 'n005'}},
  {params: {newsId: 'n006'}},
  {params: {newsId: 'n007'}},
];

const NewsPage = (props: IPageProps) => {
  const {layoutAssertion} = useGlobal();
  const displayedNavBar = layoutAssertion === 'mobile' ? <NavBarMobile /> : <NavBar />;
  const appCtx = useContext(AppContext);
  const marketCtx = useContext(MarketContext);

  const news = marketCtx.getNews(Currency.ETH, props?.newsId ?? '');
  const recommendationNews = marketCtx.getRecommendedNews(Currency.ETH);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  const initUI = (
    <>
      {appCtx.isInit ? (
        <>
          <Head>
            {/* TODO: Title of this piece of news (20230601 - Shirley) */}
            {/* TODO: OG */}
            <title>News - TideBit DeFi</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <nav className="">{displayedNavBar}</nav>

          <main className="">
            <div>
              <NewsArticle
                shareId={props.newsId}
                news={news}
                recommendations={recommendationNews}
              />
            </div>
            <Footer />
          </main>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );

  return <>{initUI}</>;
};

export default NewsPage;

export const getServerSideProps: GetServerSideProps<IPageProps> = async ({params, locale}) => {
  if (!params || !params.newsId || typeof params.newsId !== 'string') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      newsId: params.newsId,
      ...(await serverSideTranslations(locale as string, ['common', 'footer'])),
    },
  };
};

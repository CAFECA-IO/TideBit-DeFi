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
  tempNews,
} from '../../interfaces/tidebit_defi_background/news';
import {Currency} from '../../constants/currency';
import {MarketContext} from '../../contexts/market_context';
import {DOMAIN} from '../../constants/config';

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
  const finishedNews = tempNews;
  const newsTitle = finishedNews.title;
  const newsDescription = finishedNews.content;
  const newsImg = finishedNews.img;

  const imgWidth = 600;
  const imgHeight = 100;
  const share = `${DOMAIN}/news/${props.newsId}`;
  const img = `${DOMAIN}/news/${newsImg}`;

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
            {/* TODO: Title of this piece of news (20230602 - Shirley) */}
            {/* TODO: OG (20230602 - Shirley) */}
            <title>{newsTitle}</title>
            <link rel="icon" href="/favicon.ico" />

            <meta name="description" content="CFD Sharing" />
            <meta name="keywords" content="CFD Sharing" />
            <meta name="author" content="TideBit" />
            <meta name="application-name" content="TideBit DeFi" />
            <meta name="apple-mobile-web-app-title" content="TideBit DeFi" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" />

            <meta property="og:title" content={newsTitle} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={share} />
            <meta property="og:image" content={img} />
            <meta property="og:image:width" content={imgWidth.toString()} />
            <meta property="og:image:height" content={imgHeight.toString()} />
            <meta property="og:description" content={newsDescription} />
            <meta property="og:site_name" content="TideBit DeFi" />
            <meta property="og:locale" content="en_US" />

            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@tidebit" />
            <meta name="twitter:creator" content="@tidebit" />
            <meta name="twitter:url" content={DOMAIN} />
            <meta name="twitter:title" content={newsTitle} />
            <meta name="twitter:description" content={newsDescription} />
            <meta name="twitter:image" content={img} />
            <meta name="twitter:image:alt" content={newsTitle} />
          </Head>

          <nav className="">{displayedNavBar}</nav>

          <main className="">
            <div>
              <NewsArticle
                shareId={props.newsId}
                news={finishedNews}
                // recommendations={recommendationNews}
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

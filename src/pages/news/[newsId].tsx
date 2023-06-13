import {GetServerSideProps, GetStaticPaths, GetStaticProps} from 'next';
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
import {NEWS_IMG_HEIGHT, NEWS_IMG_WIDTH} from '../../constants/display';
import {IPost, getPost, getPosts, getSlugs} from '../../lib/posts';

interface IPageProps {
  newsId: string;
  newsData: IPost; // Add this to represent the fetched news data
}

// TODO: Check dynamic routing (20230605 - Shirley)

const NewsPage = (props: IPageProps) => {
  const {layoutAssertion} = useGlobal();
  const displayedNavBar = layoutAssertion === 'mobile' ? <NavBarMobile /> : <NavBar />;
  const appCtx = useContext(AppContext);
  const marketCtx = useContext(MarketContext);

  const news = marketCtx.getNews(Currency.ETH, props?.newsId ?? '');
  const recommendationNews = marketCtx.getRecommendedNews(Currency.ETH);

  const post = props.newsData;
  // const finishedNews = tempNews;
  const newsTitle = post.title;
  const newsDescription = post.body.substring(0, 100);

  // TODO: img src (20230609 - Shirley)
  const newsImg = `/news/${props.newsId}@2x.png`;

  const share = `${DOMAIN}/news/${props.newsId}`;
  const img = `${DOMAIN}${newsImg}`;

  // eslint-disable-next-line no-console
  console.log('newsData in page by static server function', props.newsData);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  const initUI = (
    <>
      <Head>
        <title>{newsTitle}</title>
        <link rel="icon" href="/favicon.ico" />

        <meta name="description" content="CFD Sharing" />
        <meta name="keywords" content="CFD Sharing" />
        <meta name="author" content="TideBit" />
        <meta name="application-name" content="TideBit DeFi" />
        <meta name="apple-mobile-web-app-title" content="TideBit DeFi" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" />

        <meta name="og:title" content={newsTitle} />
        <meta name="og:type" content="website" />
        <meta name="og:url" content={share} />
        <meta name="og:image" content={img} />
        <meta name="og:image:width" content={NEWS_IMG_WIDTH.toString()} />
        <meta name="og:image:height" content={NEWS_IMG_HEIGHT.toString()} />
        <meta name="og:description" content={newsDescription} />
        <meta name="og:site_name" content="TideBit DeFi" />
        <meta name="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@tidebit" />
        <meta name="twitter:creator" content="@tidebit" />
        <meta name="twitter:url" content={DOMAIN} />
        <meta name="twitter:title" content={newsTitle} />
        <meta name="twitter:description" content={newsDescription} />
        <meta name="twitter:image" content={img} />
        <meta name="twitter:image:alt" content={newsTitle} />
      </Head>

      {appCtx.isInit ? (
        <>
          <nav className="">{displayedNavBar}</nav>
          <main className="">
            <div>
              <NewsArticle
                post={props.newsData}
                shareId={props.newsId}
                // news={finishedNews}
                img={newsImg}
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

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getSlugs();
  const paths = slugs.map(slug => ({params: {newsId: slug}}));
  return {paths, fallback: false};
};

export const getStaticProps: GetStaticProps<IPageProps> = async ({params, locale}) => {
  if (!params || !params.newsId || typeof params.newsId !== 'string') {
    return {
      notFound: true,
    };
  }

  const newsData = await getPost(params.newsId);

  if (!newsData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      newsId: params.newsId,
      newsData,
      ...(await serverSideTranslations(locale as string, ['common', 'footer'])),
    },
  };
};

// export const getServerSideProps: GetServerSideProps<IPageProps> = async ({params, locale}) => {
//   if (!params || !params.newsId || typeof params.newsId !== 'string') {
//     return {
//       notFound: true,
//     };
//   }

//   const newsData = await getPost(params.newsId);
//   // eslint-disable-next-line no-console
//   console.log('newsData in getServerSideProps', newsData);

//   if (!newsData) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: {
//       newsId: params.newsId,
//       newsData,
//       ...(await serverSideTranslations(locale as string, ['common', 'footer'])),
//     },
//   };
// };

// export const getServerSideProps: GetServerSideProps<IPageProps> = async ({ params, locale }) => {
//   if (!params || !params.newsId || typeof params.newsId !== 'string') {
//     return {
//       notFound: true,
//     };
//   }

//   // Fetch the news data using the getPost function
//   const newsData = await getPost(params.newsId);

//   return {
//     props: {
//       newsId: params.newsId,
//       newsData, // Return the fetched data as a prop
//       ...(await serverSideTranslations(locale as string, ['common', 'footer'])),
//     },
//   };
// };

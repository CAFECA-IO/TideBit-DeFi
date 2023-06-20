import {GetStaticPaths, GetStaticProps} from 'next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import NewsArticle from '../../components/news_article/news_article';
import {useGlobal} from '../../contexts/global_context';
import NavBarMobile from '../../components/nav_bar_mobile/nav_bar_mobile';
import NavBar from '../../components/nav_bar/nav_bar';
import Head from 'next/head';
import {useContext, useEffect} from 'react';
import {AppContext} from '../../contexts/app_context';
import Footer from '../../components/footer/footer';
import {IRecommendedNews} from '../../interfaces/tidebit_defi_background/news';
import {MarketContext} from '../../contexts/market_context';
import {BTC_NEWS_FOLDER, DOMAIN, ETH_NEWS_FOLDER} from '../../constants/config';
import {NEWS_IMG_HEIGHT, NEWS_IMG_WIDTH} from '../../constants/display';
import {IPost, getFilteredPosts, getPost, getSlugs} from '../../lib/posts';

interface IPageProps {
  newsId: string;
  newsData: IPost;
  brief?: IRecommendedNews[];
}

const NewsPage = (props: IPageProps) => {
  const {layoutAssertion} = useGlobal();
  const displayedNavBar = layoutAssertion === 'mobile' ? <NavBarMobile /> : <NavBar />;
  const appCtx = useContext(AppContext);
  const marketCtx = useContext(MarketContext);

  // TODO: get news from context (20230613 - Shirley)
  // const news = marketCtx.getNews(Currency.ETH, props?.newsId ?? '');
  // const recommendationNews = marketCtx.getRecommendedNews(Currency.ETH);

  const post = props.newsData;
  const newsTitle = post.title;
  const newsDescription = post.body.substring(0, 100);
  const newsImg = `/news/${props.newsId}@2x.png`;
  const share = `${DOMAIN}/news/${props.newsId}`;
  const img = `${DOMAIN}${newsImg}`;

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

        <meta name="description" content={newsDescription} />
        <meta name="keywords" content={newsTitle} />
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
        <meta name="og:image:alt" content={newsTitle} />
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
                img={newsImg}
                recommendations={props.brief}
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
  const ethSlugs = await getSlugs(ETH_NEWS_FOLDER);
  const btcSlugs = await getSlugs(BTC_NEWS_FOLDER);

  const slugs =
    ethSlugs && btcSlugs
      ? [...ethSlugs, ...btcSlugs]
      : ethSlugs && !btcSlugs
      ? ethSlugs
      : btcSlugs
      ? btcSlugs
      : [];

  const paths = slugs.map(slug => ({params: {newsId: slug}}));
  return {paths, fallback: false};
};

export const getStaticProps: GetStaticProps<IPageProps> = async ({params, locale}) => {
  if (!params || !params.newsId || typeof params.newsId !== 'string') {
    return {
      notFound: true,
    };
  }

  const dir = params.newsId.includes('eth') ? ETH_NEWS_FOLDER : BTC_NEWS_FOLDER;

  const newsData = await getPost(dir, params.newsId);
  const allPost = await getFilteredPosts(dir, [params.newsId]);

  const recommendations = allPost.map(news => {
    return {
      newsId: news.slug ?? '',
      img: `/news/${news.slug}@2x.png`,
      timestamp: news.date,
      title: news.title,
      description: news.description,
    };
  });

  if (!newsData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      newsId: params.newsId,
      newsData,
      brief: recommendations,
      ...(await serverSideTranslations(locale as string, ['common', 'footer'])),
    },
  };
};

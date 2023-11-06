import {GetStaticPaths, GetStaticProps} from 'next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import NewsArticle from '../../components/news_article/news_article';
import NavBar from '../../components/nav_bar/nav_bar';
import Head from 'next/head';
import {useContext, useEffect} from 'react';
import {AppContext} from '../../contexts/app_context';
import Footer from '../../components/footer/footer';
import {IRecommendedNews} from '../../interfaces/tidebit_defi_background/news';
import {DOMAIN, NEWS_FOLDER} from '../../constants/config';
import {NEWS_IMG_HEIGHT, NEWS_IMG_WIDTH} from '../../constants/display';
import {IPost, getFilteredPosts, getPost, getSlugs} from '../../lib/posts';

interface IPageProps {
  newsId: string;
  newsData: IPost;
  brief?: IRecommendedNews[];
}

const NewsPage = (props: IPageProps) => {
  const displayedNavBar = <NavBar />;

  const appCtx = useContext(AppContext);

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
          <main className="w-full">
            <div className="w-full">
              <NewsArticle
                post={props.newsData}
                shareId={props.newsId}
                img={newsImg}
                recommendations={props.brief}
              />
            </div>
          </main>

          <div className="w-full mx-0">
            {' '}
            <Footer />
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );

  return <>{initUI}</>;
};

export default NewsPage;

export const getStaticPaths: GetStaticPaths = async ({locales}) => {
  const slugs = (await getSlugs(NEWS_FOLDER)) ?? [];

  const paths = slugs
    .flatMap(slug => {
      return locales?.map(locale => ({params: {newsId: slug}, locale}));
    })
    .filter((path): path is {params: {newsId: string}; locale: string} => !!path);

  return {paths, fallback: false};
};

export const getStaticProps: GetStaticProps<IPageProps> = async ({params, locale}) => {
  if (!params || !params.newsId || typeof params.newsId !== 'string') {
    return {
      notFound: true,
    };
  }

  const article = await getPost(NEWS_FOLDER, params.newsId);

  const newsId = params.newsId.toLowerCase();
  const currency = newsId.toLowerCase().split('-')[1];
  const slugs = await getSlugs(NEWS_FOLDER);

  // Info: 排除此篇文章以及其他幣種的文章 (20231023 - Shirley)
  const exclusiveSlugs = slugs
    ? slugs.filter(slug => slug.includes(newsId) || !slug.includes(currency))
    : [];

  const recommendationPosts = (await getFilteredPosts(NEWS_FOLDER, exclusiveSlugs)).sort(
    (a, b) => b.date - a.date
  );

  const recommendations = recommendationPosts.map(news => {
    return {
      newsId: news.slug ?? '',
      img: `/news/${news.slug}@2x.png`,
      timestamp: news.date,
      title: news.title,
      description: news.description,
    };
  });

  if (!article) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      newsId: params.newsId,
      newsData: article,
      brief: recommendations,
      ...(await serverSideTranslations(locale as string, ['common', 'footer'])),
    },
  };
};

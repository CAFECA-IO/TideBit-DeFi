import React, {useContext, useEffect} from 'react';
import NewsPageBody from '../components/news_page_body/news_page_body';
import Head from 'next/head';
import {useGlobal} from '../contexts/global_context';
import {AppContext} from '../contexts/app_context';
import NavBarMobile from '../components/nav_bar_mobile/nav_bar_mobile';
import NavBar from '../components/nav_bar/nav_bar';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale} from '../interfaces/tidebit_defi_background/locale';
import Footer from '../components/footer/footer';
import {IPost, getPost, getPosts, getSlugs} from '../lib/posts';
import {ETH_NEWS_FOLDER} from '../constants/config';
import {GetStaticProps} from 'next';
import {IRecommendedNews} from '../interfaces/tidebit_defi_background/news';

interface IPageProps {
  briefs: IRecommendedNews[];
}

const News = (props: IPageProps) => {
  const {layoutAssertion} = useGlobal();
  const displayedNavBar = layoutAssertion === 'mobile' ? <NavBarMobile /> : <NavBar />;

  const appCtx = useContext(AppContext);

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
            <title>News - TideBit DeFi</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <nav className="">{displayedNavBar}</nav>

          <main className="">
            <div>
              <NewsPageBody briefs={props.briefs} />
            </div>
          </main>

          <Footer />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );

  return <>{initUI}</>;
};

// const getStaticPropsFunction = async ({locale}: ILocale) => ({
//   props: {
//     ...(await serverSideTranslations(locale, ['common', 'footer'])),
//   },
// });

// export const getStaticProps = getStaticPropsFunction;

export default News;

export const getStaticProps: GetStaticProps<IPageProps> = async ({params, locale}) => {
  const newsData = await getPosts(ETH_NEWS_FOLDER);

  const briefs: IRecommendedNews[] = newsData.map(news => {
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
      briefs,
      ...(await serverSideTranslations(locale as string, ['common', 'footer'])),
    },
  };
};

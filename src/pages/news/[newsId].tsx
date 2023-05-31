import {useRouter} from 'next/router';
// import News from '../../components/News';
import {GetServerSideProps} from 'next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import NewsPageBody from '../../components/news_page_body/news_page_body';
import NewsArticle from '../../components/news_article/news_article';

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

const NewsPage = () => {
  const router = useRouter();
  const {page} = router.query;

  const pageNumber = page ? parseInt(page as string, 10) : 1;
  const pageData = data.slice((pageNumber - 1) * 10, pageNumber * 10);

  return (
    <>
      {/* <News data={pageData} /> */}
      <NewsArticle />
    </>
  );
};

export default NewsPage;

// export const getServerSideProps: GetServerSideProps<IPageProps> = async ({params, locale}) => {
//   if (!params || !params.newsId || typeof params.newsId !== 'string') {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: {
//       newsId: params.newsId,
//       ...(await serverSideTranslations(locale as string, ['common', 'footer'])),
//     },
//   };
// };

export const getStaticPaths = async () => {
  /* ToDo:React Hook useEffect has a missing dependency: 'newsId'. Either include it or remove the dependency array. 
  const res = await fetch(new URL("/api/news", baseUrl));
  const news: INewsDetail[] = await res.json();

  const paths = news.map((v) => ({
    params: { newsId: v.id },
  })); */

  return {
    paths: [
      {params: {newsId: 'n001'}},
      {params: {newsId: 'n002'}},
      {params: {newsId: 'n003'}},
      {params: {newsId: 'n004'}},
      {params: {newsId: 'n005'}},
      {params: {newsId: 'n006'}},
      {params: {newsId: 'n007'}},
    ],
    fallback: 'blocking',
  };
};

export async function getStaticProps({locale}: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

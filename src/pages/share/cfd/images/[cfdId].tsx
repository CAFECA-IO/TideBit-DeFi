import {GetStaticPaths, GetStaticProps} from 'next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import React, {useContext, useEffect} from 'react';
import {AppContext} from '../../../../contexts/app_context';
import {useRouter} from 'next/router';

interface IPageProps {
  cfdId: string;
}

const CfdImage = (props: IPageProps) => {
  const appCtx = useContext(AppContext);
  const router = useRouter();

  const {cfdId} = router.query;

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  return <div></div>;
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
    fallback: false,
  };
};

export default CfdImage;

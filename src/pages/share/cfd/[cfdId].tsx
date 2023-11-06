import Head from 'next/head';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useContext, useEffect} from 'react';
import {AppContext} from '../../../contexts/app_context';
import {GetServerSideProps} from 'next';
import {useRouter} from 'next/router';
import Error from 'next/error';
import {DOMAIN} from '../../../constants/config';
import {BG_HEIGHT_OF_SHARING_RECORD, BG_WIDTH_OF_SHARING_RECORD} from '../../../constants/display';

import useStateRef from 'react-usestateref';
import Link from 'next/link';

interface IPageProps {
  cfdId: string;
}

const CfdSharing = (props: IPageProps) => {
  const appCtx = useContext(AppContext);
  const router = useRouter();
  // Info: for the use of useStateRef (20231106 - Shirley)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userTz, setUserTz, userTzRef] = useStateRef<number>(0);

  // TODO: for meta content (20230505 - Shirley)
  const img = `${DOMAIN}/api/images/cfd/${props.cfdId}?tz=${userTzRef.current}`;
  const displayImg = `/api/images/cfd/${props.cfdId}?tz=${userTzRef.current}`;
  const share = `${DOMAIN}/share/cfd/${props.cfdId}`;

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  useEffect(() => {
    try {
      const timezoneOffset = new Date().getTimezoneOffset();
      const timeDiff = -timezoneOffset / 60;

      setUserTz(timeDiff);
    } catch (error) {
      // TODO: error handling (20230524 - Shirley)
    }
  }, [appCtx.isInit]);

  if (!router.isFallback && !props.cfdId) {
    return <Error statusCode={404} />;
  }

  const displayedImage = appCtx.isInit ? (
    <Link href="/">
      <div className="flex w-full justify-center">
        <img
          src={displayImg}
          width={BG_WIDTH_OF_SHARING_RECORD}
          height={BG_HEIGHT_OF_SHARING_RECORD}
          alt="CFD record"
          className="hover:opacity-90"
        />
      </div>
    </Link>
  ) : null;

  return (
    <>
      <Head>
        <title>TideBit DeFi - CFD Sharing</title>
        <meta name="description" content="CFD Sharing" />
        <meta name="keywords" content="CFD Sharing" />
        <meta name="author" content="TideBit" />
        <meta name="application-name" content="TideBit DeFi" />
        <meta name="apple-mobile-web-app-title" content="TideBit DeFi" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" />

        <meta name="og:title" content="TideBit DeFi CFD" />
        <meta name="og:type" content="website" />
        <meta name="og:url" content={share} />
        <meta name="og:image:secure" content={img} />
        <meta name="og:image:alt" content="TideBit DeFi CFD" />
        <meta name="og:image:width" content={BG_WIDTH_OF_SHARING_RECORD.toString()} />
        <meta name="og:image:height" content={BG_HEIGHT_OF_SHARING_RECORD.toString()} />
        <meta name="og:description" content="TideBit DeFi CFD Sharing" />
        <meta name="og:site_name" content="TideBit DeFi" />
        <meta name="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@tidebit" />
        <meta name="twitter:creator" content="@tidebit" />
        <meta name="twitter:url" content={DOMAIN} />
        <meta name="twitter:title" content="TideBit DeFi CFD" />
        <meta name="twitter:description" content="TideBit DeFi CFD" />
        <meta name="twitter:image" content={img} />
        <meta name="twitter:image:alt" content="TideBit DeFi CFD" />
      </Head>
      {displayedImage}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<IPageProps> = async ({params, locale}) => {
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

export default CfdSharing;

import Image from 'next/image';
import React from 'react';
import {useTranslation} from 'next-i18next';
import Link from 'next/link';

type TranslateFunction = (s: string) => string;

const AppDowloadContainer = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  return (
    <section className={`bg-black flex flex-col items-center w-full px-5 lg:px-20`}>
      <h1 className="lg:mb-20 mb-10 text-xl font-bold md:text-4xl xl:text-5xl">
        {t('HOME_PAGE.APP_DOWLOAD_CONTAINER_TITLE')}&nbsp;
        <span className="text-cyan-400">
          {t('HOME_PAGE.APP_DOWLOAD_CONTAINER_TITLE_HIGHLIGHT')}
        </span>
        &nbsp;
        {t('HOME_PAGE.APP_DOWLOAD_CONTAINER_TITLE_2')}
      </h1>

      <div className="flex flex-col-reverse items-center justify-center gap-5 md:flex-row">
        {/* Info: (20231208 - Julian) QR Code  & App Download Buttons */}
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="mb-5 md:mb-10 md:w-200px w-150px">
            <Image alt="QR Code" src="/elements/tidebit_qrcode.svg" width={200} height={200} />
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Link
              id="AppStoreLink"
              target="_blank"
              href="/coming-soon"
              className="hover:opacity-80"
            >
              <Image
                src="/elements/app_store_badge@2x.png"
                width={120}
                height={40}
                alt="app-store"
              />
            </Link>

            <Link
              id="GooglePlayLink"
              target="_blank"
              href="/coming-soon"
              className="hover:opacity-80"
            >
              <Image
                src={'/elements/google_play_badge@2x.png'}
                width={155}
                height={40}
                alt="google play"
              />
            </Link>
          </div>
        </div>
        {/* Info: (20231208 - Julian) Exchange Image */}
        <div className="w-300px md:w-2/3">
          <Image
            alt="exchange image"
            src="/elements/group_15202@2x.png"
            width={1364}
            height={792}
          />
        </div>
      </div>
    </section>
  );
};

export default AppDowloadContainer;

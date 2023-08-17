import React from 'react';
import AppDowloadContainer from '../app_download_container/app_download_container';
import Banner from '../banner/banner';
import CryptoCategory from '../crypto_category/crypto_category';
import Cta from '../cta/cta';
import Footer from '../footer/footer';
import Hero from '../hero/hero';
import Hero1 from '../hero1/hero1';
import HeroReverse from '../hero_reverse/hero_reverse';
import HeroReverse1 from '../hero_reverse1/hero_reverse1';
import StatisticBlock from '../statistic/statistic';
import ReserveRatio from '../reserve_ratio/reserve_ratio';
import {useTranslation} from 'react-i18next';
import {MarketContext} from '../../contexts/market_context';
import AuditReport from '../audit_report/audit_report';

type TranslateFunction = (s: string) => string;

export default function HeroDescription() {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const [isInit, setIsInit] = React.useState(false);
  const marketCtx = React.useContext(MarketContext);

  const getMarketInfo = async () => {
    try {
      await marketCtx.getTideBitPromotion();
      await marketCtx.getWebsiteReserve();
      setIsInit(true);
    } catch (err) {
      // Deprecated: [debug] (20230608 - tzuhan)
      // eslint-disable-next-line no-console
      console.log(`HeroDescription getMarketInfo error: `, err);
    }
  };

  React.useEffect(() => {
    if (marketCtx.isInit && !isInit) {
      getMarketInfo();
    }
  }, [isInit, marketCtx.isInit]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden pt-24">
      {/* Body */}
      <div className="w-full">
        <Cta />
        <div className="py-0"></div>

        <StatisticBlock />
        <div className="py-10"></div>

        {/* <MarketProvider> */}
        <ReserveRatio />
        <div className="py-10"></div>

        <AuditReport />
        <div className="py-10"></div>

        <CryptoCategory />
        {/* </MarketProvider> */}
        <div className="py-10 lg:py-20"></div>

        <Banner />
        <div className="py-16 lg:pb-2/5 lg:pt-20"></div>

        {/* Web3.0 */}
        <HeroReverse
          heading={t('HOME_PAGE.WEB_3_TITLE')}
          highlight={t('HOME_PAGE.WEB_3_TITLE_HIGHLIGHT')}
          content={t('HOME_PAGE.WEB_3_DESCRIPTION')}
          img="/elements/2634@2x.png"
        />
        <div className="py-5 lg:py-40"></div>

        {/* Easy Trade */}
        <Hero
          heading={
            <div className="font-bold">
              <span className="text-tidebitTheme">{t('HOME_PAGE.EASY_TRADE_TITLE_HIGHLIGHT')}</span>{' '}
              {t('HOME_PAGE.EASY_TRADE_TITLE')}
            </div>
          }
          content={t('HOME_PAGE.EASY_TRADE_DESCRIPTION')}
          img="/elements/group_15200@2x.png"
        />
        <div className="py-5 lg:py-40"></div>

        {/* Secure System */}
        <HeroReverse1
          heading={
            <div className="font-bold">
              <span className="text-tidebitTheme">
                {t('HOME_PAGE.SECURE_SYSTEM_TITLE_HIGHLIGHT')}
              </span>{' '}
              {t('HOME_PAGE.SECURE_SYSTEM_TITLE')}
            </div>
          }
          content={t('HOME_PAGE.SECURE_SYSTEM_DESCRIPTION')}
          img="/elements/group_15145@2x.png"
        />
        <div className="py-5 lg:py-40"></div>

        {/* Free Online Courses */}
        <Hero1
          heading={
            <div className="font-bold">
              <span className="text-tidebitTheme">
                {t('HOME_PAGE.FREE_ONLINE_COURSES_TITLE_HIGHLIGHT')}
              </span>{' '}
              {t('HOME_PAGE.FREE_ONLINE_COURSES_TITLE')}
            </div>
          }
          content={t('HOME_PAGE.FREE_ONLINE_COURSES_DESCRIPTION')}
          img={`/elements/group_15201.svg`}
        />
        <div className="py-5 lg:py-10"></div>

        {/* App download */}
        <div className="flex w-full justify-center">
          <AppDowloadContainer />
        </div>
      </div>

      {/* Footer */}
      <div className="">
        <Footer />
      </div>
    </div>
  );
}

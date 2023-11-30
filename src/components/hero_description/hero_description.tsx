import React from 'react';
import AppDowloadContainer from '../app_download_container/app_download_container';
import CryptoCategory from '../crypto_category/crypto_category';
import Cta from '../cta/cta';
import Hero from '../hero/hero';
import Hero1 from '../hero1/hero1';
import HeroReverse from '../hero_reverse/hero_reverse';
import HeroReverse1 from '../hero_reverse1/hero_reverse1';
import StatisticBlock from '../statistic/statistic';
import ReserveRatio from '../reserve_ratio/reserve_ratio';
import {useTranslation} from 'next-i18next';
import {MarketContext} from '../../contexts/market_context';
import AuditReport from '../audit_report/audit_report';
import {Code} from '../../constants/code';
import {NotificationContext} from '../../contexts/notification_context';
import {TickerProvider} from '../../contexts/ticker_context';

type TranslateFunction = (s: string) => string;

export default function HeroDescription() {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const [isInit, setIsInit] = React.useState(false);
  const marketCtx = React.useContext(MarketContext);
  const notificationCtx = React.useContext(NotificationContext);

  const getMarketInfo = async () => {
    try {
      await marketCtx.getTideBitPromotion();
      await marketCtx.getWebsiteReserve();
      setIsInit(true);
    } catch (err) {
      notificationCtx.addException(
        'getMarketInfo hero_description',
        err as Error,
        Code.UNKNOWN_ERROR
      );
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
      <div className="w-full">
        <div className="">
          <Cta />
        </div>

        <div className="pt-10 xl:pt-20 pb-10">
          <StatisticBlock />
        </div>

        <div id="ReserveRatio" className="py-16">
          <ReserveRatio />
        </div>

        <div id="AuditReport" className="py-16">
          <AuditReport />
        </div>

        <div id="CryptoCategory" className="pt-20 pb-40">
          <TickerProvider>
            <CryptoCategory />
          </TickerProvider>
        </div>

        {/* Info: removed for supervision reason (20231115 - Shirley) */}
        {/* <div className="py-20">
          <Banner />
        </div> */}

        {/* Info: Web3.0 (20231114 - Shirley) */}
        <HeroReverse
          heading={t('HOME_PAGE.WEB_3_TITLE')}
          highlight={t('HOME_PAGE.WEB_3_TITLE_HIGHLIGHT')}
          content={t('HOME_PAGE.WEB_3_DESCRIPTION')}
          img="/elements/2634@2x.png"
        />
        <div className="py-20 lg:py-40"></div>

        {/* Info: Easy Trade (20231114 - Shirley) */}
        <Hero
          heading={
            <div className="font-bold">
              <span className="text-tidebitTheme">{t('HOME_PAGE.EASY_TRADE_TITLE_HIGHLIGHT')}</span>
              {t('HOME_PAGE.EASY_TRADE_TITLE')}
            </div>
          }
          content={t('HOME_PAGE.EASY_TRADE_DESCRIPTION')}
          img="/elements/group_15200@2x.png"
        />
        <div className="py-20 lg:py-40"></div>

        {/* Info: Secure System (20231114 - Shirley) */}
        <HeroReverse1
          heading={
            <div className="font-bold">
              <span className="text-tidebitTheme">
                {t('HOME_PAGE.SECURE_SYSTEM_TITLE_HIGHLIGHT')}
              </span>
              {t('HOME_PAGE.SECURE_SYSTEM_TITLE')}
            </div>
          }
          content={t('HOME_PAGE.SECURE_SYSTEM_DESCRIPTION')}
          img="/elements/group_15145@2x.png"
        />
        <div className="py-20 lg:py-40"></div>

        {/* Info: Free Online Courses (20231114 - Shirley) */}
        <Hero1
          heading={
            <div className="font-bold">
              <span className="text-tidebitTheme">
                {t('HOME_PAGE.FREE_ONLINE_COURSES_TITLE_HIGHLIGHT')}
              </span>
              {t('HOME_PAGE.FREE_ONLINE_COURSES_TITLE')}
            </div>
          }
          content={t('HOME_PAGE.FREE_ONLINE_COURSES_DESCRIPTION')}
          img={`/elements/group_15201.svg`}
        />
        <div className="py-20 lg:py-40"></div>

        {/* Info: App download (20231114 - Shirley) */}
        <div className="flex w-full justify-center">
          <AppDowloadContainer />
        </div>

        <div className="py-20 lg:py-40"></div>
      </div>
    </div>
  );
}

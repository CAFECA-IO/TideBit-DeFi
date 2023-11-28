import React, {useEffect} from 'react';
import Link from 'next/link';
import CryptoNewsItem from '../crypto_news_item/crypto_news_item';
import {useTranslation} from 'next-i18next';
import {IRecommendedNews} from '../../interfaces/tidebit_defi_background/news';
import useMarketStore from '../../stores/market_store';
import useUserStore from '../../stores/user_store';
import TestResult from '../test_result/test_result';
import UserBadge from '../user_badge/user_badge';

type TranslateFunction = (s: string) => string;

interface ICryptoNewsSectionProps {
  briefs: IRecommendedNews[];
}

const CryptoNewsSection = (props: ICryptoNewsSectionProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  // TODO: dev (20231122 - Shirley)
  // eslint-disable-next-line no-console
  console.log('CryptoNewsSection render');

  const overallWidth = 'w-full pr-5 lg:p-0 lg:w-2/3 xl:w-3/4';
  const dividerWidth = 'w-full lg:w-2/3 xl:w-3/4';

  const cryptoBriefNews = props.briefs;

  const displayedCryptoNews =
    cryptoBriefNews instanceof Array &&
    cryptoBriefNews
      ?.sort((a, b) => b.timestamp - a.timestamp)
      ?.map(news => {
        return (
          <CryptoNewsItem
            key={news.img}
            id={news.newsId}
            timestamp={news.timestamp}
            img={news.img}
            title={news.title}
            content={news.description}
          />
        );
      });

  return (
    <>
      <TestResult />
      <UserBadge />
      <div className="flex-col justify-start">
        <h1 className="pr-12 text-start text-xl text-lightWhite">
          {t('TRADE_PAGE.CRYPTO_NEWS_SECTION_TITLE')}
        </h1>
        <span className={`${dividerWidth} mb-3 inline-block h-px rounded bg-white/30`}></span>
        {displayedCryptoNews}
      </div>

      <div className={`flex justify-center ${overallWidth} mb-20 lg:mb-0`}>
        <Link
          href="/news"
          className="text-xs text-tidebitTheme underline underline-offset-2 hover:text-tidebitTheme/80"
        >
          {t('TRADE_PAGE.CRYPTO_NEWS_SECTION_SEE_ALL')}
        </Link>
      </div>
    </>
  );
};

export default CryptoNewsSection;

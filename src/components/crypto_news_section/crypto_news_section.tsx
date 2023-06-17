import React, {useContext} from 'react';
import Link from 'next/link';
import CryptoNewsItem from '../crypto_news_item/crypto_news_item';
import {MarketContext} from '../../contexts/market_context';
import {useTranslation} from 'next-i18next';
import {IRecommendedNews} from '../../interfaces/tidebit_defi_background/news';

type TranslateFunction = (s: string) => string;

interface ICryptoNewsSectionProps {
  briefs: IRecommendedNews[];
}

const CryptoNewsSection = (props: ICryptoNewsSectionProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const overallWidth = 'w-full pr-5 lg:p-0 lg:w-2/3 xl:w-3/4';
  const dividerWidth = 'w-full lg:w-2/3 xl:w-3/4';
  const marketCtx = useContext(MarketContext);

  // const cryptoBriefNews = marketCtx.tickerStatic?.cryptoBriefNews ?? [];
  const cryptoBriefNews = props.briefs;

  const displayedCryptoNews =
    cryptoBriefNews instanceof Array &&
    cryptoBriefNews
      ?.sort((a, b) => b.timestamp - a.timestamp)
      ?.map((news, index) => {
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

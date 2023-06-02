import React, {useContext} from 'react';
import CryptoNewsItem from '../crypto_news_item/crypto_news_item';
import {MarketContext} from '../../contexts/market_context';
import {dummyTickerStatic} from '../../interfaces/tidebit_defi_background/ticker_static';
import NewsItem from '../news_item/news_item';
import Link from 'next/link';
import Pagination from '../pagination/pagination';

const NewsSection = () => {
  const overallWidth = 'w-full pr-5 lg:p-0 lg:w-2/3 xl:w-3/4';
  const dividerWidth = 'w-full lg:w-2/3 xl:w-3/4';
  const marketCtx = useContext(MarketContext);

  // const cryptoBriefNews = marketCtx.tickerStatic?.cryptoBriefNews ?? [];
  const cryptoBriefNews = dummyTickerStatic.cryptoBriefNews;

  const displayedCryptoNews =
    cryptoBriefNews instanceof Array &&
    cryptoBriefNews?.map((news, index) => {
      return (
        <NewsItem
          key={news.img}
          id={news.id}
          timestamp={news.timestamp}
          img={news.img}
          title={news.title}
          description={news.description}
        />
      );
    });

  return (
    <div>
      <section className="overflow-hidden text-gray-400">
        {displayedCryptoNews}
        <Pagination />
      </section>
    </div>
  );
};

export default NewsSection;

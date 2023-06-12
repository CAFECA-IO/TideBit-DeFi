import React, {useContext} from 'react';
import CryptoNewsItem from '../crypto_news_item/crypto_news_item';
import {MarketContext} from '../../contexts/market_context';
import {dummyTickerStatic} from '../../interfaces/tidebit_defi_background/ticker_static';
import NewsItem from '../news_item/news_item';
import Link from 'next/link';
import Pagination from '../pagination/pagination';
import {
  IRecommendedNews,
  getDummyRecommendationNews,
} from '../../interfaces/tidebit_defi_background/news';
import {Currency} from '../../constants/currency';
import {ITEMS_PER_PAGE} from '../../constants/display';

const NewsSection = ({
  activePage,
  briefNews,
}: {
  activePage: number;
  briefNews: IRecommendedNews[];
}) => {
  const start = (activePage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const newsForCurrentPage = briefNews.slice(start, end);

  const displayedCryptoNews =
    newsForCurrentPage instanceof Array &&
    newsForCurrentPage
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((news, index) => {
        return (
          <NewsItem
            key={news.newsId}
            newsId={news.newsId}
            timestamp={news.timestamp}
            img={news.img}
            title={news.title}
            description={news.description}
          />
        );
      });

  return (
    <div>
      <section className="overflow-hidden text-gray-400">{displayedCryptoNews}</section>
    </div>
  );
};

export default NewsSection;

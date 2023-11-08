import React from 'react';
import NewsItem from '../news_item/news_item';
import {IRecommendedNews} from '../../interfaces/tidebit_defi_background/news';
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
      .map(news => {
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

import React, {useContext} from 'react';
import NewsHeader from '../news_header/news_header';
import NewsSection from '../news_section/news_section';
import Pagination from '../pagination/pagination';
import {getDummyRecommendationNews} from '../../interfaces/tidebit_defi_background/news';
import {Currency} from '../../constants/currency';
import {MarketContext} from '../../contexts/market_context';

const NewsPageBody = () => {
  const marketCtx = useContext(MarketContext);
  const allNews = marketCtx.getPaginationNews(Currency.ETH);
  const [activePage, setActivePage] = React.useState(1);
  const totalPages = Math.ceil(allNews.length / 10);

  return (
    <div className="bg-gradient-to-r from-darkGray1/80 via-black to-black pt-40 pb-20">
      <div className="mb-12">
        {' '}
        {/* TODO: search function (20230602 - SHirley) */}
        <NewsHeader />
      </div>
      <div className="">
        {' '}
        <NewsSection activePage={activePage} briefNews={allNews} />
      </div>

      <div className="mt-10">
        <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default NewsPageBody;

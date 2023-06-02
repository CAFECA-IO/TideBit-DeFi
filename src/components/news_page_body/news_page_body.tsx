import React, {useContext, useEffect} from 'react';
import NewsHeader from '../news_header/news_header';
import NewsSection from '../news_section/news_section';
import Pagination from '../pagination/pagination';
import {Currency} from '../../constants/currency';
import {MarketContext} from '../../contexts/market_context';
import useStateRef from 'react-usestateref';

const NewsPageBody = () => {
  const marketCtx = useContext(MarketContext);
  const allNews = marketCtx.getPaginationNews(Currency.ETH);
  const [activePage, setActivePage] = React.useState(1);
  const [search, setSearch, searchRef] = useStateRef('');

  const filteredNews = allNews.filter(
    news => news.title.includes(searchRef.current) || news.description.includes(searchRef.current)
  );

  const totalPages = Math.ceil(filteredNews.length / 10);

  const searchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearch(searchTerm);
  };

  useEffect(() => {
    setActivePage(1);
  }, [searchRef.current]);

  return (
    <div className="bg-gradient-to-r from-darkGray1/80 via-black to-black pt-40 pb-20">
      <div className="mb-12">
        {' '}
        <NewsHeader searchChangeHandler={searchChangeHandler} />
      </div>
      <div className="">
        {' '}
        <NewsSection activePage={activePage} briefNews={filteredNews} />
      </div>

      <div className="mt-10">
        <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default NewsPageBody;

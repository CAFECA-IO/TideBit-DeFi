import React, {useContext, useEffect} from 'react';
import NewsHeader from '../news_header/news_header';
import NewsSection from '../news_section/news_section';
import Pagination from '../pagination/pagination';
import {Currency} from '../../constants/currency';
import {MarketContext} from '../../contexts/market_context';
import useStateRef from 'react-usestateref';
import {IRecommendedNews} from '../../interfaces/tidebit_defi_background/news';
import {ITEMS_PER_PAGE} from '../../constants/display';
import {ETH_NEWS_FOLDER} from '../../constants/config';

interface IPageProps {
  briefs: IRecommendedNews[];
}

const NewsPageBody = (props: IPageProps) => {
  const marketCtx = useContext(MarketContext);
  const allNews = marketCtx.getPaginationNews(Currency.ETH);
  const [activePage, setActivePage] = React.useState(1);
  const [search, setSearch, searchRef] = useStateRef('');

  const recommenation = props.briefs;

  const filteredNews = recommenation
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter(
      news =>
        news.title.toLowerCase().includes(searchRef.current.toLowerCase()) ||
        news.description.toLowerCase().includes(searchRef.current.toLowerCase())
    );

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);

  const searchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearch(searchTerm);
  };

  useEffect(() => {
    setActivePage(1);
  }, [searchRef.current]);

  return (
    <div className="bg-gradient-to-r from-darkGray1/80 via-black to-black pt-40 pb-20">
      <div className="mb-20">
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

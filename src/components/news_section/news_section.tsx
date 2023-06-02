import React, {useContext} from 'react';
import CryptoNewsItem from '../crypto_news_item/crypto_news_item';
import {MarketContext} from '../../contexts/market_context';
import {dummyTickerStatic} from '../../interfaces/tidebit_defi_background/ticker_static';
import NewsItem from '../news_item/news_item';
import Link from 'next/link';

const NewsSection = () => {
  const overallWidth = 'w-full pr-5 lg:p-0 lg:w-2/3 xl:w-3/4';
  const dividerWidth = 'w-full lg:w-2/3 xl:w-3/4';
  const marketCtx = useContext(MarketContext);

  // const cryptoBriefNews = marketCtx.tickerStatic?.cryptoBriefNews ?? [];
  const cryptoBriefNews = dummyTickerStatic.cryptoBriefNews;

  const item = (
    <div className="container mx-auto px-5 py-24">
      <div className="-my-8 divide-y-2 divide-gray-800">
        <div className="flex flex-wrap py-8 md:flex-nowrap">
          <div className="mb-6 flex shrink-0 flex-col md:mb-0 md:w-64">
            <span className="font-semibold text-white">CATEGORY</span>
            <span className="mt-1 text-sm text-gray-500">12 Jun 2019</span>
          </div>
          <div className="md:grow">
            <h2 className="mb-2 text-2xl font-medium text-white">
              Bitters hashtag waistcoat fashion axe chia unicorn
            </h2>
            <p className="leading-relaxed">
              Glossier echo park pug, church-key sartorial biodiesel vexillologist pop-up snackwave
              ramps cornhole. Marfa 3 wolf moon party messenger bag selfies, poke vaporware kombucha
              lumbersexual pork belly polaroid hoodie portland craft beer.
            </p>
            <a className="mt-4 inline-flex items-center text-indigo-400">
              Learn More
              <svg
                className="ml-2 h-4 w-4"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
        <div className="flex flex-wrap border-t-2 border-gray-800 py-8 md:flex-nowrap">
          <div className="mb-6 flex shrink-0 flex-col md:mb-0 md:w-64">
            <span className="font-semibold text-white">CATEGORY</span>
            <span className="mt-1 text-sm text-gray-500">12 Jun 2019</span>
          </div>
          <div className="md:grow">
            <h2 className="title-font mb-2 text-2xl font-medium text-white">
              Meditation bushwick direct trade taxidermy shaman
            </h2>
            <p className="leading-relaxed">
              Glossier echo park pug, church-key sartorial biodiesel vexillologist pop-up snackwave
              ramps cornhole. Marfa 3 wolf moon party messenger bag selfies, poke vaporware kombucha
              lumbersexual pork belly polaroid hoodie portland craft beer.
            </p>
            <a className="mt-4 inline-flex items-center text-indigo-400">
              Learn More
              <svg
                className="ml-2 h-4 w-4"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
        <div className="flex flex-wrap border-t-2 border-gray-800 py-8 md:flex-nowrap">
          <div className="mb-6 flex shrink-0 flex-col md:mb-0 md:w-64">
            <span className="title-font font-semibold text-white">CATEGORY</span>
            <span className="mt-1 text-sm text-gray-500">12 Jun 2019</span>
          </div>
          <div className="md:grow">
            <h2 className="title-font mb-2 text-2xl font-medium text-white">
              Woke master cleanse drinking vinegar salvia
            </h2>
            <p className="leading-relaxed">
              Glossier echo park pug, church-key sartorial biodiesel vexillologist pop-up snackwave
              ramps cornhole. Marfa 3 wolf moon party messenger bag selfies, poke vaporware kombucha
              lumbersexual pork belly polaroid hoodie portland craft beer.
            </p>
            <a className="mt-4 inline-flex items-center text-indigo-400">
              Learn More
              <svg
                className="ml-2 h-4 w-4"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  // const newsItem = ()
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

  const pagination = (
    <ol className="mt-10 mb-20 mr-20 flex justify-end gap-1 text-sm font-medium">
      <li>
        <a
          href="#"
          className="inline-flex h-8 w-8 items-center justify-center rounded bg-transparent text-white rtl:rotate-180 "
        >
          <span className="sr-only">Prev Page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </li>

      <li>
        <a
          href="#"
          className="block h-8 w-8 rounded bg-transparent text-center leading-8 text-white"
        >
          1
        </a>
      </li>
      <li>
        <a
          href="#"
          className="block h-8 w-8 rounded bg-transparent text-center leading-8 text-white underline decoration-tidebitTheme decoration-2 underline-offset-4"
        >
          2
        </a>
      </li>

      <li>
        <a
          href="#"
          className="block h-8 w-8 rounded bg-transparent text-center leading-8 text-white"
        >
          3
        </a>
      </li>

      <li>
        <a
          href="#"
          className="block h-8 w-8 rounded bg-transparent text-center leading-8 text-white"
        >
          4
        </a>
      </li>

      <li>
        <a
          href="#"
          className="inline-flex h-8 w-8 items-center justify-center rounded bg-transparent text-white rtl:rotate-180 "
        >
          <span className="sr-only">Next Page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </li>
    </ol>
  );

  return (
    <div>
      <section className="overflow-hidden text-gray-400">
        {displayedCryptoNews}
        {pagination}
      </section>
    </div>
  );
};

export default NewsSection;

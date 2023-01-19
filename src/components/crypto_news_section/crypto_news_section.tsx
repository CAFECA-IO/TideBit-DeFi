import React, {useContext} from 'react';
import CryptoNewsItem from '../crypto_news_item/crypto_news_item';
import {MarketContext} from '../../lib/contexts/market_context';

const CryptoNewsSection = () => {
  const overallWidth = 'w-full pr-5 lg:p-0 lg:w-2/3 xl:w-3/4';
  const dividerWidth = 'w-full lg:w-2/3 xl:w-3/4';
  const {tickerStatic} = useContext(MarketContext);

  const {cryptoBriefNews} = tickerStatic ?? {};

  const displayedCryptoNews = cryptoBriefNews?.map((news, index) => {
    return (
      <CryptoNewsItem key={news.img} img={news.img} title={news.title} content={news.content} />
    );
  });

  return (
    <>
      <div className="flex-col justify-start">
        {' '}
        <h1 className="pr-12 text-start text-xl text-lightWhite">News</h1>
        <span className={`${dividerWidth} mb-3 inline-block h-px rounded bg-white/30`}></span>
        {displayedCryptoNews}
        {/* <CryptoNewsItem
          img="/elements/rectangle_715@2x.png"
          heading={`Add news title here`}
          content={`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
              accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea`}
        />
        <CryptoNewsItem
          img="/elements/rectangle_716@2x.png"
          heading={`Add news title here`}
          content={`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
              accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea`}
        />
        <CryptoNewsItem
          img="/elements/rectangle_717@2x.png"
          heading={`Add news title here`}
          content={`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
              accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea`}
        /> */}
      </div>

      <div className={`flex justify-center ${overallWidth}`}>
        {' '}
        <a href="#" className="text-xs text-tidebitTheme underline underline-offset-2">
          SEE ALL
        </a>
      </div>
    </>
  );
};

export default CryptoNewsSection;

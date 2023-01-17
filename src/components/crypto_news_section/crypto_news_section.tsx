import React from 'react';
import CryptoNewsItem from '../crypto_news_item/crypto_news_item';

const CryptoNewsSection = () => {
  const overallWidth = 'w-full pr-5 lg:p-0 lg:w-2/3 xl:w-3/4';
  const dividerWidth = 'w-full lg:w-2/3 xl:w-3/4';

  return (
    <>
      <div className="flex-col justify-start">
        {' '}
        <h1 className="pr-12 text-start text-xl text-lightWhite">News</h1>
        <span className={`${dividerWidth} mb-3 inline-block h-px rounded bg-white/30`}></span>
        <CryptoNewsItem
          heading={`Add news title here`}
          content={`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
              accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea`}
        />
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

import CryptoCard from '../card/crypto_card';
import {useContext, useEffect, useState} from 'react';

import {
  MarketContext,
  IMarketContext,
  IMarketProvider,
  ITickerData,
} from '../../lib/contexts/market_context';
import {UserContext, IUserContext} from '../../lib/contexts/user_context';

// TODO: import data from market context

const CryptoCategory = ({...otherProps}) => {
  const customClassName = otherProps?.className;

  const {availableTickers} = useContext<IMarketContext>(MarketContext);

  const displayedAllTickers = availableTickers?.map((cryptoCard, i) => {
    if (i === 0) {
      return (
        <CryptoCard
          key={i}
          className="mt-4 ml-4"
          lineGraphProps={cryptoCard.lineGraphProps}
          chain={cryptoCard.chain}
          currency={cryptoCard.currency}
          price={cryptoCard.price}
          fluctuating={cryptoCard.fluctuating}
          gradientColor={cryptoCard.gradientColor}
          tokenImg={cryptoCard.tokenImg}
        />
      );
    }

    return (
      <CryptoCard
        key={i}
        lineGraphProps={cryptoCard.lineGraphProps}
        chain={cryptoCard.chain}
        currency={cryptoCard.currency}
        price={cryptoCard.price}
        fluctuating={cryptoCard.fluctuating}
        gradientColor={cryptoCard.gradientColor}
        tokenImg={cryptoCard.tokenImg}
      />
    );
  });

  return (
    <div
      className={`${customClassName} container mx-auto flex shrink-0 flex-wrap justify-center space-y-1`}
    >
      <div className="mb-10 flex w-full flex-col text-center xl:mb-20">
        <div className="mb-0 items-center text-2xl font-medium text-white xs:text-3xl sm:text-4xl">
          <div className="flex items-center justify-center">
            <span className="my-auto h-px w-1/11 rounded bg-white/50 xs:inline-block xs:w-1/10 lg:w-1/5 xl:mx-2 xl:w-1/3"></span>
            <h1 className="mx-1 text-center xl:w-410px">
              <span className="text-tidebitTheme">Popular</span> cryptocurrencies
            </h1>
            <span className="my-auto h-px w-1/11 rounded bg-white/50 xs:inline-block xs:w-1/10 lg:w-1/5 xl:mx-2 xl:w-1/3"></span>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center">
        <div className="mb-5 grid grid-cols-2 space-y-4 space-x-4 lg:grid-cols-5">
          {displayedAllTickers}

          {/* <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
         
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
         
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div>
        <div className="my-5 flex flex-wrap justify-center lg:w-1/4 xl:w-1/5">
          
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default CryptoCategory;

import CryptoCard from '../crypto_card/crypto_card';
import React, {useContext, useEffect, useState} from 'react';
import {MarketContext, IMarketContext} from '../../contexts/market_context';
import {CRYPTO_CARD_COLORS} from '../../constants/display';
import Link from 'next/link';
import {ITickerData} from '../../interfaces/tidebit_defi_background/ticker_data';
import {useTranslation} from 'next-i18next';
import {ITickerContext, TickerContext} from '../../contexts/ticker_context';

type TranslateFunction = (s: string) => string;
const CryptoCategory = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const tickerCtx = useContext<ITickerContext>(TickerContext);

  const [tickers, setTickers] = useState<ITickerData[] | null>();

  useEffect(() => {
    setTickers(Object.values(tickerCtx.availableTickers));
  }, [tickerCtx.availableTickers]);

  const renderCryptoCard = tickers?.map((item, i) => {
    const color = CRYPTO_CARD_COLORS.find(i => i.label === item.currency);
    const cryptoCard = {
      ...item,
      gradientColor: color?.gradientColor,
    };

    if (i === 0) {
      return (
        <div key={i}>
          <Link href={`/trade/cfd/${cryptoCard.instId?.toLowerCase()}`}>
            <CryptoCard
              onTheSamePage={false}
              className="mt-4 ml-4"
              instId={cryptoCard.instId}
              lineGraphProps={cryptoCard.lineGraphProps}
              chain={cryptoCard.name}
              currency={cryptoCard.currency}
              price={cryptoCard.price}
              fluctuating={cryptoCard.fluctuating}
              gradientColor={cryptoCard?.gradientColor ?? ''}
              tokenImg={cryptoCard.tokenImg}
            />
          </Link>
        </div>
      );
    }

    return (
      <div key={i}>
        <Link href={`/trade/cfd/${cryptoCard.instId?.toLowerCase()}`}>
          <CryptoCard
            onTheSamePage={false}
            instId={cryptoCard.instId}
            lineGraphProps={cryptoCard.lineGraphProps}
            chain={cryptoCard.name}
            currency={cryptoCard.currency}
            price={cryptoCard.price}
            fluctuating={cryptoCard.fluctuating}
            gradientColor={cryptoCard?.gradientColor ?? ''}
            tokenImg={cryptoCard.tokenImg}
          />
        </Link>
      </div>
    );
  });

  return (
    <div className="container mx-auto flex shrink-0 flex-wrap justify-center space-y-1">
      <div className="mb-10 flex w-full flex-col text-center xl:mb-20">
        <div className="mb-0 items-center font-medium text-white text-2xl xs:text-3xl sm:text-4xl">
          <div className="flex items-center justify-center">
            <span className="my-auto h-px w-1/11 rounded bg-white/50 xs:inline-block xs:w-1/10 lg:w-3/10 xl:mx-2"></span>
            <h1 className="mx-1 text-center xl:w-410px">
              <span className="text-tidebitTheme">
                {t('HOME_PAGE.CRYPTO_CATEGORY_TITLE_HIGHLIGHT')}
              </span>
              {t('HOME_PAGE.CRYPTO_CATEGORY_TITLE')}
            </h1>
            <span className="my-auto h-px w-1/11 rounded bg-white/50 xs:inline-block xs:w-1/10 lg:w-3/10 xl:mx-2"></span>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center">
        <div className="grid grid-cols-2 space-y-4 space-x-4 lg:grid-cols-5">
          {renderCryptoCard}
        </div>
      </div>
    </div>
  );
};

export default CryptoCategory;

import CryptoCard from '../crypto_card/crypto_card';
import React, {useContext, useEffect, useState} from 'react';
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
    <div className="container mx-auto flex flex-wrap justify-center space-y-1">
      <div className="mb-5 w-full flex items-center justify-center font-medium text-white lg:mb-10 text-2xl xs:text-3xl sm:text-4xl">
        <span className="h-px w-1/11 rounded bg-white/50 xs:inline-block xs:w-1/10 lg:w-3/10 xl:mx-2"></span>
        <h1 className="mx-3 text-center">
          <span className="text-tidebitTheme">
            {t('HOME_PAGE.CRYPTO_CATEGORY_TITLE_HIGHLIGHT')}
          </span>
          {t('HOME_PAGE.CRYPTO_CATEGORY_TITLE')}
        </h1>
        <span className="h-px w-1/11 rounded bg-white/50 xs:inline-block xs:w-1/10 lg:w-3/10 xl:mx-2"></span>
      </div>

      <div className="flex w-full items-center justify-center">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">{renderCryptoCard}</div>
      </div>
    </div>
  );
};

export default CryptoCategory;

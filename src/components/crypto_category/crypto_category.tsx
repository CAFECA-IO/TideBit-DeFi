import CryptoCard from '../crypto_card/crypto_card';
import {useContext, useEffect, useState} from 'react';

import {MarketContext, IMarketContext} from '../../contexts/market_context';
import {CRYPTO_CARD_COLORS} from '../../constants/display';
import Link from 'next/link';

const CryptoCategory = ({...otherProps}) => {
  const marketCtx = useContext<IMarketContext>(MarketContext);
  const [tickers, setTickers] = useState<any>([]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;

    // console.log('mounted effect');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) return;

    // console.log('ticker render effect');

    setTickers(
      marketCtx.listAvailableTickers().map((item, i) => {
        const color = CRYPTO_CARD_COLORS.find(i => i.label === item.currency);
        const cryptoCard = {
          ...item,
          gradientColor: color?.gradientColor,
        };

        if (i === 0) {
          return (
            <div key={i}>
              <Link href={`/trade/cfd/${cryptoCard.currency?.toLowerCase()}usdt`}>
                <CryptoCard
                  className="mt-4 ml-4"
                  lineGraphProps={cryptoCard.lineGraphProps}
                  chain={cryptoCard.chain}
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
            <Link href={`/trade/cfd/${cryptoCard.currency?.toLowerCase()}usdt`}>
              <CryptoCard
                lineGraphProps={cryptoCard.lineGraphProps}
                chain={cryptoCard.chain}
                currency={cryptoCard.currency}
                price={cryptoCard.price}
                fluctuating={cryptoCard.fluctuating}
                gradientColor={cryptoCard?.gradientColor ?? ''}
                tokenImg={cryptoCard.tokenImg}
              />
            </Link>
          </div>
        );
      })
    );

    // console.log('ticker', {tickers});
  }, []);

  return (
    <div className="container mx-auto flex shrink-0 flex-wrap justify-center space-y-1">
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
        <div className="mb-5 grid grid-cols-2 space-y-4 space-x-4 lg:grid-cols-5">{tickers}</div>
      </div>
    </div>
  );
};

export default CryptoCategory;

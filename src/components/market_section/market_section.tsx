import {useState, useContext} from 'react';
import TradingHeader from '../trading_header/trading_header';
import TradingView from '../trading_view/trading_view';
import {ViewportContext} from '../../lib/contexts/theme_context';
import TradingViewMobile from '../trading_view_mobile/trading_view_mobile';
import TradingHeaderMobile from '../trading_header_mobile/trading_header_mobile';
import TradeStatistics from '../trade_statistics/trade_statistics';
import {MarketContext} from '../../lib/contexts/market_context';
import CryptoSummary from '../crypto_summary/crypto_summary';

const MarketSection = () => {
  const {layoutAssertion} = useContext(ViewportContext);
  const {liveStatstics, bullAndBearIndex} = useContext(MarketContext);
  const {fiveMin, sixtyMin, oneDay} = liveStatstics ?? {};
  // console.log('live statstic:', liveStatstics);

  const displayedTickerHeader =
    layoutAssertion === 'mobile' ? (
      <TradingHeaderMobile />
    ) : (
      <TradingHeader upOrDown="up" tradingVolume="217,268,645" />
    );

  const displayedTradingView =
    layoutAssertion === 'mobile' ? <TradingViewMobile /> : <TradingView />;

  return (
    <div>
      <div className="ml-5 pt-100px">
        <div className="ml-5">
          {displayedTickerHeader}
          {/* <TradingHeader upOrDown="up" tradingVolume="217,268,645" /> */}
        </div>

        <div>
          {displayedTradingView}
          {/* <TradingView /> */}
        </div>

        <div className="mt-5 lg:mt-8 lg:pl-5">
          <TradeStatistics
            fiveMin={{low: fiveMin?.low ?? 0, now: fiveMin?.now ?? '', high: fiveMin?.high ?? 0}}
            sixtyMin={{
              low: sixtyMin?.low ?? 0,
              now: sixtyMin?.now ?? '',
              high: sixtyMin?.high ?? 0,
            }}
            oneDay={{low: oneDay?.low ?? 0, now: oneDay?.now ?? '', high: oneDay?.high ?? 0}}
            bullAndBearIndex={bullAndBearIndex}
            long={bullAndBearIndex}
            short={100 - bullAndBearIndex}
          />
        </div>

        <div className="mt-5 lg:mt-8 lg:pl-5">
          <CryptoSummary />
        </div>
      </div>
    </div>
  );
};

export default MarketSection;

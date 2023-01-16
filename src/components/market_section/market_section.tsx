import {useState, useContext} from 'react';
import TradingHeader from '../trading_header/trading_header';
import TradingView from '../trading_view/trading_view';
import {ViewportContext} from '../../lib/contexts/theme_context';
import TradingViewMobile from '../trading_view_mobile/trading_view_mobile';
import TradingHeaderMobile from '../trading_header_mobile/trading_header_mobile';
import TradeStatistics from '../trade_statistics/trade_statistics';

const MarketSection = () => {
  const {layoutAssertion} = useContext(ViewportContext);

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

        <div>
          {/* TODO: more completed spacing configuration */}
          {/* now:1300 => (1300-1200)/(1320-1200)=5/6 */}
          <TradeStatistics
            fiveMin={{low: 1200, now: '5/6', high: 1320}}
            sixtyMin={{low: 1100, now: '3/10', high: 1840}}
            oneDay={{low: 1060, now: '3/10', high: 1900}}
            bullAndBearIndex="1/3"
            long={33}
            short={67}
          />
        </div>
      </div>
    </div>
  );
};

export default MarketSection;

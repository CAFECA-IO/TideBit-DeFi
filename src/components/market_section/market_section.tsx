import {useState, useContext} from 'react';
import TradingHeader from '../trading_header/trading_header';
import TradingView from '../trading_view/trading_view';
import {ViewportContext} from '../../lib/contexts/theme_context';
import TradingViewMobile from '../trading_view_mobile/trading_view_mobile';
import TradingHeaderMobile from '../trading_header_mobile/trading_header_mobile';
import TradeStatistics from '../trade_statistics/trade_statistics';
import {MarketContext} from '../../lib/contexts/market_context';
import CryptoSummary from '../crypto_summary/crypto_summary';
import CryptoNewsSection from '../crypto_news_section/crypto_news_section';

const MarketSection = () => {
  const {layoutAssertion} = useContext(ViewportContext);

  const {liveStatstics, tickerStatic, tickerLiveStatistics} = useContext(MarketContext);

  const {id, bullAndBearIndex, priceStatistics} = tickerLiveStatistics ?? {};
  const {fiveMin, sixtyMin, oneDay} = priceStatistics ?? {};

  // Trial: getCryptoSummary() in context
  // let cryptoSum = {};
  // const {getCryptoSummary} = tickerStatic ?? {};
  // if (getCryptoSummary) {
  //   cryptoSum = getCryptoSummary() ?? {};
  //   // console.log(cryptoSum);
  // }
  // console.log(cryptoSum);
  // const {icon} = cryptoSum ?? {};

  // Trial: cryptoSummary attribute in context
  const {cryptoSummary} = tickerStatic ?? {};
  const {
    icon,
    label,
    introduction,
    whitePaperLink,
    websiteLink,
    price,
    rank,
    publishTime,
    publishAmount,
    tradingVolume,
    totalValue,
    tradingValue,
  } = cryptoSummary ?? {};

  // const {cryptoSummary} = useContext(MarketContext);
  // const {
  // icon,
  // label,
  // introduction,
  // whitePaperLink,
  // websiteLink,
  // price,
  // rank,
  // publishTime,
  // publishAmount,
  // tradingVolume,
  // totalValue,
  // tradingValue,
  // } = cryptoSummary ?? {};

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
            bullAndBearIndex={bullAndBearIndex ?? 0}
            long={bullAndBearIndex ?? 0}
            short={100 - (bullAndBearIndex ?? 0)}
          />
        </div>

        <div className="mt-5 lg:mt-8 lg:pl-5">
          <CryptoSummary
            icon={icon ?? ''}
            label={label ?? ''}
            introduction={introduction ?? ''}
            whitePaperLink={whitePaperLink ?? ''}
            websiteLink={websiteLink ?? ''}
            price={price ?? ''}
            rank={rank ?? 0}
            publishTime={publishTime ?? ''}
            publishAmount={publishAmount ?? ''}
            tradingVolume={tradingVolume ?? ''}
            totalValue={totalValue ?? ''}
            tradingValue={tradingValue ?? ''}
          />
        </div>

        <div className="mb-10 mt-5 lg:mt-8 lg:pl-5">
          <CryptoNewsSection />
        </div>
      </div>
    </div>
  );
};

export default MarketSection;

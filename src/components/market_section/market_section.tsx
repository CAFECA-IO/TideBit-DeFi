import {useState, useContext} from 'react';
import TradingHeader from '../trading_header/trading_header';
import TradingView from '../trading_view/trading_view';
import {GlobalContext, useGlobal} from '../../contexts/global_context';
import TradingViewMobile from '../trading_view_mobile/trading_view_mobile';
import TradingHeaderMobile from '../trading_header_mobile/trading_header_mobile';
import TradeStatistics from '../trade_statistics/trade_statistics';
import {MarketContext} from '../../contexts/market_context';
import CryptoSummary from '../crypto_summary/crypto_summary';
import CryptoNewsSection from '../crypto_news_section/crypto_news_section';

const MarketSection = () => {
  const marketCtx = useContext(MarketContext);
  const {layoutAssertion} = useGlobal();

  const {
    icon,
    name: label,
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
  } = marketCtx.tickerStatic?.cryptoSummary ?? {};

  const displayedTickerHeader =
    layoutAssertion === 'mobile' ? <TradingHeaderMobile /> : <TradingHeader />;

  const displayedTradingView =
    layoutAssertion === 'mobile' ? <TradingViewMobile /> : <TradingView />;

  return (
    <div className="ml-5 py-100px">
      <div className="ml-5">{displayedTickerHeader}</div>

      <div>{displayedTradingView}</div>

      <div className="mt-5 lg:mt-8 lg:pl-5">
        <TradeStatistics
          fiveMin={{
            low: marketCtx.tickerLiveStatistics?.priceStatistics?.fiveMin?.low ?? 0,
            now: marketCtx.tickerLiveStatistics?.priceStatistics?.fiveMin?.now ?? '',
            high: marketCtx.tickerLiveStatistics?.priceStatistics?.fiveMin?.high ?? 0,
          }}
          sixtyMin={{
            low: marketCtx.tickerLiveStatistics?.priceStatistics?.sixtyMin?.low ?? 0,
            now: marketCtx.tickerLiveStatistics?.priceStatistics?.sixtyMin?.now ?? '',
            high: marketCtx.tickerLiveStatistics?.priceStatistics?.sixtyMin?.high ?? 0,
          }}
          oneDay={{
            low: marketCtx.tickerLiveStatistics?.priceStatistics?.oneDay?.low ?? 0,
            now: marketCtx.tickerLiveStatistics?.priceStatistics?.oneDay?.now ?? '',
            high: marketCtx.tickerLiveStatistics?.priceStatistics?.oneDay?.high ?? 0,
          }}
          bullAndBearIndex={marketCtx.tickerLiveStatistics?.bullAndBearIndex ?? 0}
          long={marketCtx.tickerLiveStatistics?.bullAndBearIndex ?? 0}
          short={100 - (marketCtx.tickerLiveStatistics?.bullAndBearIndex ?? 0)}
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
  );
};

export default MarketSection;

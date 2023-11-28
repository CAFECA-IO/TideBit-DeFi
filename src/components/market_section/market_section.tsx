import React, {useContext} from 'react';
import TradingHeader from '../trading_header/trading_header';
import TradingView from '../trading_view/trading_view';
import TradeStatistics from '../trade_statistics/trade_statistics';
import {MarketContext} from '../../contexts/market_context';
import CryptoSummary from '../crypto_summary/crypto_summary';
import CryptoNewsSection from '../crypto_news_section/crypto_news_section';
import {IRecommendedNews} from '../../interfaces/tidebit_defi_background/news';
import {DEFAULT_ICON} from '../../constants/display';
import {DEFAULT_CRYPTO} from '../../constants/config';
import useNewWorkerStore from '../../stores/new_worker_store';
import useMarketStore from '../../stores/market_store';
import TestResult1 from '../test_result_1/test_result_1';

interface IMarketSectionProps {
  briefs: IRecommendedNews[];
  hideTradingView?: boolean;
}

const MarketSection = (props: IMarketSectionProps) => {
  // const test1 = useMarketStore(s => s.testResult);
  // const test2 = useMarketStore(s => s.testResult);

  // // eslint-disable-next-line no-console
  // console.log('test1: ', test1);
  // // eslint-disable-next-line no-console
  // console.log('test2: ', test2);

  // const marketCtx = useContext(MarketContext);

  // const {
  //   icon,
  //   name: label,
  //   introduction,
  //   whitePaperLink,
  //   websiteLink,
  //   price,
  //   rank,
  //   publishTime,
  //   publishAmount,
  //   tradingVolume,
  //   totalValue,
  //   tradingValue,
  // } = marketCtx.tickerStatic?.cryptoSummary ?? {};

  // const displayedTickerHeader = <TradingHeader />;
  // const fetcher = useNewWorkerStore(s => s.fetchData);

  const displayedTradingView = props?.hideTradingView ? null : <TradingView />;

  const tradeStatisticsStyle = props?.hideTradingView
    ? 'mt-5 lg:mt-20 lg:pl-5'
    : 'mt-5 lg:mt-8 lg:pl-5';

  return (
    <div className="ml-5 py-100px">
      <div className="">
        <TestResult1 />
        {/* <div className="">
          test1 is the same testResult from marketStore in MarketSection component: {test1.count}
        </div>
        <div className="">
          test2 is the same testResult from marketStore in MarketSection component: {test2.count}
        </div> */}
      </div>
      {/* <div className="ml-5">{displayedTickerHeader}</div> */}

      <div className="mx-auto max-w-1920px container">{displayedTradingView}</div>

      <div className={tradeStatisticsStyle}>
        {/* <TradeStatistics
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
        /> */}
      </div>

      <div className="mt-5 lg:mt-8 lg:pl-5">
        {/* <CryptoSummary
          icon={icon ?? marketCtx.selectedTicker?.tokenImg ?? DEFAULT_ICON}
          label={label ?? DEFAULT_CRYPTO}
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
        /> */}
      </div>

      <div className="mb-10 mt-5 lg:mt-8 lg:pl-5">
        <CryptoNewsSection briefs={props.briefs} />
      </div>
    </div>
  );
};

export default MarketSection;

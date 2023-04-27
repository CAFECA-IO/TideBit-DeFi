import React, {useContext, Suspense, useEffect, useRef} from 'react';
import Lottie from 'lottie-react';
import smallConnectingAnimation from '../../../public/animation/lf30_editor_cnkxmhy3.json';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../contexts/user_context';
import {MarketContext} from '../../contexts/market_context';
import {
  getTimestamp,
  getTimestampInMilliseconds,
  roundToDecimalPlaces,
  toDisplayCFDOrder,
} from '../../lib/common';
import {
  IDisplayCFDOrder,
  listDummyDisplayCFDOrder,
} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {TypeOfPosition} from '../../constants/type_of_position';
import {
  BUY_PRICE_ERROR,
  DEFAULT_TICKER,
  DISPLAY_QUOTATION_RENEWAL_INTERVAL_SECONDS,
  QUOTATION_RENEWAL_INTERVAL_SECONDS,
  SELL_PRICE_ERROR,
  SPREAD_ERROR,
  WAITING_TIME_FOR_USER_SIGNING,
  unitAsset,
} from '../../constants/config';
import {IQuotation, getDummyQuotation} from '../../interfaces/tidebit_defi_background/quotation';
import {defaultResultSuccess} from '../../interfaces/tidebit_defi_background/result';
import useStateRef from 'react-usestateref';

const OpenSubTab = () => {
  const {openCFDs} = useContext(UserContext);
  const marketCtx = useContext(MarketContext);
  const ticker = marketCtx?.selectedTickerRef?.current?.currency ?? DEFAULT_TICKER;
  const spread = marketCtx.tickerLiveStatistics?.spread ?? SPREAD_ERROR;

  const defaultBuyQuotation: IQuotation = getDummyQuotation(ticker, TypeOfPosition.BUY);
  const defaultSellQuotation: IQuotation = getDummyQuotation(ticker, TypeOfPosition.SELL);

  const [longQuotation, setLongQuotation, longQuotationRef] =
    useStateRef<IQuotation>(defaultBuyQuotation);
  const [shortQuotation, setShortQuotation, shortQuotationRef] =
    useStateRef<IQuotation>(defaultSellQuotation);

  const [secondsLeft, setSecondsLeft, secondsLeftRef] = useStateRef(
    DISPLAY_QUOTATION_RENEWAL_INTERVAL_SECONDS
  );

  // useEffect(() => {

  // }, [marketCtx.selectedTicker?.price]);

  const cfds = openCFDs
    .map(cfd => {
      const positionLineGraph = marketCtx.listTickerPositions(cfd.targetAsset, {
        begin: cfd.createTimestamp,
      });

      const sd = cfd.typeOfPosition === TypeOfPosition.BUY ? 1 + spread : 1 - spread;
      const currentPrice = positionLineGraph[positionLineGraph.length - 1] * sd;

      const displayCFD: IDisplayCFDOrder = toDisplayCFDOrder(cfd, positionLineGraph, currentPrice);

      return displayCFD;
    })
    .sort((a, b) => {
      return a.createTimestamp - b.createTimestamp;
    })
    .sort((a, b) => {
      return b.stateCode - a.stateCode;
    });

  // Deprecated: to be removed (20230413 - Shirley)
  // /* ToDo: (20230411 - Julian) dummy data */
  // const dummyCFDs: IDisplayCFDOrder[] = listDummyDisplayCFDOrder('ETH')
  //   .slice(-2)
  //   .sort((a, b) => {
  //     return a.createTimestamp - b.createTimestamp;
  //   })
  //   .sort((a, b) => {
  //     return b.stateCode - a.stateCode;
  //   });

  const openPositionList = cfds.map(cfd => {
    return (
      <div key={cfd.id}>
        <OpenPositionItem openCfdDetails={cfd} />
        <div className="my-auto h-px w-full rounded bg-white/50"></div>
      </div>
    );
  });

  return (
    <>
      <div className="h-full overflow-y-auto overflow-x-hidden pb-40">
        <div className="">
          <Suspense
            fallback={
              <div className="inline-flex items-end">
                {/* ToDo: (20230419 - Julian) Loading animation */}
                <Lottie className="w-40px" animationData={smallConnectingAnimation} />
                Loading...
              </div>
            }
          >
            {openPositionList}
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default OpenSubTab;

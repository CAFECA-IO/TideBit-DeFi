import React, {useContext, useState, useEffect} from 'react';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../contexts/user_context';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {getStateCode, toDisplayCFDOrder} from '../../lib/common';
import {MarketContext} from '../../contexts/market_context';
import {TypeOfPosition} from '../../constants/type_of_position';
//import useStateRef from 'react-usestateref';
import {SKELETON_DISPLAY_TIME} from '../../constants/display';
/**  Deprecated: replace by maketContext.getTickerSpread (20230610 - tzuhan)
import {defaultResultFailed} from '../../interfaces/tidebit_defi_background/result';
import {ITickerLiveStatistics} from '../../interfaces/tidebit_defi_background/ticker_live_statistics';
*/

const OpenSubTabMobile = () => {
  const userCtx = useContext(UserContext);
  const marketCtx = useContext(MarketContext);

  /*   const initState = {
    longPrice: 0,
    shortPrice: 0,
  };
  const [caledPrice, setCaledPrice, caledPriceRef] = useStateRef(initState); */
  const [isLoading, setIsLoading] = useState(true);
  const [cfds, setCfds] = useState<IDisplayCFDOrder[]>([]);

  /**  Deprecated: replace by maketContext.getTickerSpread (20230610 - tzuhan)
  const getTickerSpread = async (instId: string) => {
    let tickerSpread = {...defaultResultFailed};
    tickerSpread = await marketCtx.getTickerLiveStatistics(instId);
    const data = tickerSpread.data as ITickerLiveStatistics;
    const spread = data.spread;

    return spread;
  };
  */

  // Deprecated (20230610 - Julian)
  /*   useEffect(() => {
    const buyPrice = !!marketCtx.selectedTicker?.price
      ? roundToDecimalPlaces(
          marketCtx.selectedTicker.price *
            (1 + (marketCtx.tickerLiveStatistics?.spread ?? DEFAULT_SPREAD)),
          2
        )
      : 0;

    const sellPrice = !!marketCtx.selectedTicker?.price
      ? roundToDecimalPlaces(
          marketCtx.selectedTicker.price *
            (1 - (marketCtx.tickerLiveStatistics?.spread ?? DEFAULT_SPREAD)),
          2
        )
      : 0;

    setCaledPrice({
      longPrice: buyPrice,
      shortPrice: sellPrice,
    });
  }, [marketCtx.selectedTicker?.price]); */

  useEffect(() => {
    const cfdList = userCtx.openCFDs
      .map(cfd => {
        /** Deprecated: (20230608 - tzuhan)
        const positionLineGraph = marketCtx.listTickerPositions(cfd.targetAsset, {
          begin: cfd.createTimestamp,
        });
        const spread = marketCtx.getTickerSpread(cfd.targetAsset);
     */
        const tickerPrice = marketCtx.availableTickers[cfd.targetAsset]?.price;

        /**
         * Info: (20230428 - Shirley)
         * without `positionLineGraph`, use market price to calculate
         * without `market price`, use the open price of the CFD to get PNL === 0 and display `--`
         * (OpenPositionItem & UpdateFormModal)
         */
        /** Deprecated: (20230608 - tzuhan)
        const currentPrice =
          (!!tickerPrice &&
            ((cfd.typeOfPosition === TypeOfPosition.BUY && roundToDecimalPlaces(tickerPrice, 2)) ||
              (cfd.typeOfPosition === TypeOfPosition.SELL &&
                roundToDecimalPlaces(tickerPrice, 2)))) ||
          positionLineGraph.length > 0
            ? positionLineGraph[positionLineGraph.length - 1]
            : 0;
        */
        const displayCFD: IDisplayCFDOrder = {
          ...toDisplayCFDOrder(cfd),
          stateCode: getStateCode(cfd, tickerPrice),
        };

        return displayCFD;
      })
      .sort((a, b) => {
        return a.createTimestamp - b.createTimestamp;
      })
      .sort((a, b) => {
        return b.stateCode! - a.stateCode!;
      });

    setCfds(cfdList);
  }, [userCtx.openCFDs]);

  useEffect(() => {
    if (userCtx.isLoadingCFDs) {
      setIsLoading(true);
      return;
    }
    setTimeout(() => setIsLoading(false), SKELETON_DISPLAY_TIME);
  }, [cfds, userCtx.isLoadingCFDs]);

  const openPositionList = isLoading ? (
    <Skeleton count={5} height={150} />
  ) : (
    cfds.map(cfd => {
      return (
        <div key={cfd.id}>
          {<OpenPositionItem openCfdDetails={cfd} />}
          <div className="my-auto h-px w-full rounded bg-white/50"></div>
        </div>
      );
    })
  );

  return (
    <>
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <div className="flex w-screen flex-col overflow-x-hidden px-8 sm:w-500px">
          <div className="h-80vh overflow-y-auto px-4">{openPositionList}</div>
        </div>
      </SkeletonTheme>
    </>
  );
};

export default OpenSubTabMobile;

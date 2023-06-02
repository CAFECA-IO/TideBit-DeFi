import React, {useContext, useState, useEffect} from 'react';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../contexts/user_context';
import {MarketContext} from '../../contexts/market_context';
import {roundToDecimalPlaces, toDisplayCFDOrder} from '../../lib/common';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {TypeOfPosition} from '../../constants/type_of_position';
//import useStateRef from 'react-usestateref';
import {DEFAULT_SPREAD, SKELETON_DISPLAY_TIME} from '../../constants/display';
import {defaultResultFailed} from '../../interfaces/tidebit_defi_background/result';
import {ITickerLiveStatistics} from '../../interfaces/tidebit_defi_background/ticker_live_statistics';

const OpenSubTab = () => {
  const {openCFDs} = useContext(UserContext);
  const marketCtx = useContext(MarketContext);

  // const initState = {
  //   longPrice: 0,
  //   shortPrice: 0,
  // };
  //const [caledPrice, setCaledPrice, caledPriceRef] = useStateRef(initState);
  const [isLoading, setIsLoading] = useState(true);

  const getTickerSpread = async (instId: string) => {
    let tickerSpread = {...defaultResultFailed};
    tickerSpread = await marketCtx.getTickerLiveStatistics(instId);
    const data = tickerSpread.data as ITickerLiveStatistics;
    const spread = data.spread;

    return spread;
  };

  // useEffect(() => {
  //   const buyPrice = !!marketCtx.selectedTicker?.price
  //     ? roundToDecimalPlaces(
  //         marketCtx.selectedTicker.price *
  //           (1 + (marketCtx.tickerLiveStatistics?.spread ?? DEFAULT_SPREAD)),
  //         2
  //       )
  //     : 0;

  //   const sellPrice = !!marketCtx.selectedTicker?.price
  //     ? roundToDecimalPlaces(
  //         marketCtx.selectedTicker.price *
  //           (1 - (marketCtx.tickerLiveStatistics?.spread ?? DEFAULT_SPREAD)),
  //         2
  //       )
  //     : 0;

  //   setCaledPrice({
  //     longPrice: buyPrice,
  //     shortPrice: sellPrice,
  //   });
  // }, [marketCtx.selectedTicker?.price]);

  const cfds = openCFDs
    .map(cfd => {
      const positionLineGraph = marketCtx.listTickerPositions(cfd.targetAsset, {
        begin: cfd.createTimestamp,
      });

      const tickerPrice = marketCtx.availableTickers[cfd.targetAsset]?.price;
      // ToDo: (20230602 - Julian) get ticker spread
      //const spread = getTickerSpread(cfd.targetAsset);
      const buyPrice = !!tickerPrice
        ? roundToDecimalPlaces(tickerPrice * (1 + DEFAULT_SPREAD), 2)
        : 0;
      const sellPrice = !!tickerPrice
        ? roundToDecimalPlaces(tickerPrice * (1 - DEFAULT_SPREAD), 2)
        : 0;
      /**
       * Info: (20230428 - Shirley)
       * without `positionLineGraph`, use market price to calculate
       * without `market price`, use the open price of the CFD to get PNL === 0 and display `--`
       * (OpenPositionItem & UpdateFormModal)
       */
      const currentPrice =
        positionLineGraph.length > 0
          ? positionLineGraph[positionLineGraph.length - 1]
          : (!!tickerPrice &&
              ((cfd.typeOfPosition === TypeOfPosition.BUY && buyPrice) ||
                (cfd.typeOfPosition === TypeOfPosition.SELL && sellPrice))) ||
            0;

      const displayCFD: IDisplayCFDOrder = toDisplayCFDOrder(cfd, positionLineGraph, currentPrice);

      return displayCFD;
    })
    .sort((a, b) => {
      return a.createTimestamp - b.createTimestamp;
    })
    .sort((a, b) => {
      return b.stateCode - a.stateCode;
    });

  useEffect(() => {
    setTimeout(() => setIsLoading(false), SKELETON_DISPLAY_TIME);
  }, [cfds]);

  const openPositionList = cfds.map(cfd => {
    return (
      <div key={cfd.id}>
        {isLoading ? <Skeleton count={5} height={30} /> : <OpenPositionItem openCfdDetails={cfd} />}
        <div className="my-auto h-px w-full rounded bg-white/50"></div>
      </div>
    );
  });

  return (
    <>
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <div className="h-full overflow-y-auto overflow-x-hidden pb-40">{openPositionList}</div>
      </SkeletonTheme>
    </>
  );
};

export default OpenSubTab;

import React, {useContext, useState, useEffect} from 'react';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../contexts/user_context';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {roundToDecimalPlaces, toDisplayCFDOrder} from '../../lib/common';
import {MarketContext} from '../../contexts/market_context';
import {TypeOfPosition} from '../../constants/type_of_position';
import useStateRef from 'react-usestateref';
import {DEFAULT_SPREAD} from '../../constants/display';

const OpenSubTabMobile = () => {
  const {openCFDs} = useContext(UserContext);
  const marketCtx = useContext(MarketContext);

  const initState = {
    longPrice: 0,
    shortPrice: 0,
  };
  const [caledPrice, setCaledPrice, caledPriceRef] = useStateRef(initState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
  }, [marketCtx.selectedTicker?.price]);

  const cfds = openCFDs.map(cfd => {
    const positionLineGraph = marketCtx.listTickerPositions(cfd.targetAsset, {
      begin: cfd.createTimestamp,
    });

    const spread =
      cfd.typeOfPosition === TypeOfPosition.BUY
        ? 1 + (marketCtx.tickerLiveStatistics?.spread ?? DEFAULT_SPREAD)
        : 1 - (marketCtx.tickerLiveStatistics?.spread ?? DEFAULT_SPREAD);

    /**
     * Info: (20230428 - Shirley)
     * without `positionLineGraph`, use market price to calculate
     * without `market price`, use the open price of the CFD to get PNL === 0 and display `--`
     * (OpenPositionItem & UpdateFormModal)
     */
    const currentPrice =
      positionLineGraph.length > 0
        ? positionLineGraph[positionLineGraph.length - 1] * spread
        : (!!marketCtx.selectedTicker?.price &&
            ((cfd.typeOfPosition === TypeOfPosition.BUY && caledPriceRef.current.longPrice) ||
              (cfd.typeOfPosition === TypeOfPosition.SELL && caledPriceRef.current.shortPrice))) ||
          0;

    const displayCFD: IDisplayCFDOrder = toDisplayCFDOrder(cfd, positionLineGraph, currentPrice);
    return displayCFD;
  });

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
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
        <div className="flex w-screen flex-col overflow-x-hidden px-8 sm:w-500px">
          <div className="h-80vh overflow-y-auto px-4">{openPositionList}</div>
        </div>
      </SkeletonTheme>
    </>
  );
};

export default OpenSubTabMobile;

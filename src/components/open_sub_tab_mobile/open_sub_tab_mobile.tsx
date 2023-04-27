import React, {useContext, useEffect} from 'react';
import OpenPositionItem from '../open_position_item/open_position_item';
import {UserContext} from '../../contexts/user_context';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {getTimestamp, roundToDecimalPlaces, toDisplayCFDOrder} from '../../lib/common';
import {MarketContext} from '../../contexts/market_context';
import {TypeOfPosition} from '../../constants/type_of_position';
import {
  BUY_PRICE_ERROR,
  DEFAULT_TICKER,
  QUOTATION_RENEWAL_INTERVAL_SECONDS,
  SELL_PRICE_ERROR,
  SPREAD_ERROR,
  unitAsset,
} from '../../constants/config';
import useStateRef from 'react-usestateref';
import {IQuotation, getDummyQuotation} from '../../interfaces/tidebit_defi_background/quotation';

const OpenSubTabMobile = () => {
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

  // useEffect(() => {
  //   return () => {
  //     setQuotation();
  //   };
  // }, [marketCtx.selectedTicker?.price]);

  const cfds = openCFDs.map(cfd => {
    const positionLineGraph = marketCtx.listTickerPositions(cfd.targetAsset, {
      begin: cfd.createTimestamp,
    });

    const sd = cfd.typeOfPosition === TypeOfPosition.BUY ? 1 + spread : 1 - spread;
    const currentPrice = positionLineGraph[positionLineGraph.length - 1] * sd;

    const displayCFD: IDisplayCFDOrder = toDisplayCFDOrder(cfd, positionLineGraph, currentPrice);
    return displayCFD;
  });

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
      <div className="flex w-screen flex-col overflow-x-hidden px-8 sm:w-500px">
        <div className="h-80vh overflow-y-auto px-4">{openPositionList}</div>
      </div>
    </>
  );
};

export default OpenSubTabMobile;

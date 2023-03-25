import {useContext, useState} from 'react';
import Image from 'next/image';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';
import {
  OPEN_POSITION_LINE_GRAPH_WIDTH,
  TypeOfPnLColorHex,
  TypeOfTransaction,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import PositionLineGraph from '../position_line_graph/position_line_graph';
import UpdateFormModal from '../update_form_modal/update_form_modal';
import {IDataPositionClosedModal, useGlobal} from '../../contexts/global_context';
import {ProfitState} from '../../constants/profit_state';
import {TypeOfPosition} from '../../constants/type_of_position';
import {getNowSeconds, randomIntFromInterval} from '../../lib/common';
import {MarketContext} from '../../contexts/market_context';
import {UserContext} from '../../contexts/user_context';
import {
  IDisplayAcceptedCFDOrder,
  getDummyDisplayAcceptedCFDOrder,
} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {
  IDisplayApplyCFDOrder,
  getDummyDisplayApplyCloseCFDOrder,
} from '../../interfaces/tidebit_defi_background/display_apply_cfd_order';
import {CFDOrderType} from '../../constants/cfd_order_type';

interface IOpenPositionItemProps {
  openCfdDetails: IDisplayAcceptedCFDOrder;
}

const OpenPositionItem = ({openCfdDetails, ...otherProps}: IOpenPositionItemProps) => {
  const marketCtx = useContext(MarketContext);
  const userCtx = useContext(UserContext);
  const {
    visibleUpdateFormModalHandler,
    dataUpdateFormModalHandler,
    visiblePositionClosedModalHandler,
    dataPositionClosedModalHandler,
    toast,
  } = useGlobal();

  const openItemClickHandler = () => {
    dataUpdateFormModalHandler(openCfdDetails);
    visibleUpdateFormModalHandler();

    toast({
      message: `marketPrice: ${
        openCfdDetails.typeOfPosition === TypeOfPosition.BUY
          ? marketCtx.tickerLiveStatistics?.sellEstimatedFilledPrice ?? 0
          : marketCtx.tickerLiveStatistics?.buyEstimatedFilledPrice ?? 999999999
      }\nsuggestion: ${JSON.stringify(openCfdDetails.suggestion)}`,
      type: 'info',
    });
  };

  const nowTimestamp = new Date().getTime() / 1000;
  const remainSecs = openCfdDetails.liquidationTime - nowTimestamp;

  const remainTime =
    remainSecs < 60
      ? Math.round(remainSecs)
      : remainSecs < 3600
      ? Math.round(remainSecs / 60)
      : Math.round(remainSecs / 3600);

  const label =
    remainSecs < 60
      ? [`${Math.round(remainSecs)} S`]
      : remainSecs < 3600
      ? [`${Math.round(remainSecs / 60)} M`]
      : [`${Math.round(remainSecs / 3600)} H`];

  const denominator = remainSecs < 60 ? 60 : remainSecs < 3600 ? 60 : 24;

  const squareClickHandler = () => {
    dataPositionClosedModalHandler(openCfdDetails);
    visiblePositionClosedModalHandler();
  };

  const displayedString =
    openCfdDetails.typeOfPosition === TypeOfPosition.BUY
      ? TypeOfTransaction.LONG
      : TypeOfTransaction.SHORT;

  const displayedColorHex =
    openCfdDetails.pnl.type === ProfitState.PROFIT
      ? TypeOfPnLColorHex.PROFIT
      : openCfdDetails.pnl.type === ProfitState.LOSS
      ? TypeOfPnLColorHex.LOSS
      : TypeOfPnLColorHex.EQUAL;

  const displayedTextColor =
    openCfdDetails.pnl.type === ProfitState.PROFIT ? 'text-lightGreen5' : 'text-lightRed';

  const displayedCrossColor =
    openCfdDetails.pnl.type === ProfitState.PROFIT
      ? 'hover:before:bg-lightGreen5 hover:after:bg-lightGreen5'
      : 'hover:before:bg-lightRed hover:after:bg-lightRed';
  const displayedCrossStyle =
    'before:absolute before:-left-2px before:top-10px before:z-40 before:block before:h-1 before:w-7 before:rotate-45 before:rounded-md after:absolute after:-left-2px after:top-10px after:z-40 after:block after:h-1 after:w-7 after:-rotate-45 after:rounded-md';

  const displayedSymbol =
    openCfdDetails.pnl.type === ProfitState.PROFIT
      ? '+'
      : openCfdDetails.pnl.type === ProfitState.LOSS
      ? '-'
      : '';

  return (
    <div className="relative">
      <div
        className="absolute z-10 h-120px w-280px bg-transparent hover:cursor-pointer"
        onClick={openItemClickHandler}
      ></div>
      {/* brief of this open position */}
      <div className="mt-5 flex justify-between">
        {/* TODO: switch the layout */}
        {/* {displayedTickerLayout} */}
        <div className="">
          <div className="inline-flex items-center text-sm">
            {/* ToDo: default currency icon (20230310 - Julian) issue #338 */}
            <Image
              src={marketCtx.selectedTicker?.tokenImg ?? ''}
              alt="currency icon"
              width={15}
              height={15}
            />
            <p className="ml-1">{openCfdDetails.ticker}</p>
          </div>
          <div className="text-sm text-lightWhite">
            {displayedString.TITLE}{' '}
            <span className="text-xs text-lightGray">{displayedString.SUBTITLE}</span>
          </div>
        </div>

        <div className="mt-1">
          <div className="text-xs text-lightGray">Value</div>
          <div className="text-sm">
            ${' '}
            {openCfdDetails.openValue.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="mt-1">
          <div className="text-xs text-lightGray">PNL</div>
          <div className={`${displayedTextColor} text-sm`}>
            <span className="">{displayedSymbol}</span> ${' '}
            {openCfdDetails.pnl.value.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="relative -mt-4 -ml-2 w-50px">
          {/* -----Paused square----- */}
          <div
            className={`absolute left-14px top-26px z-30 h-6 w-6 hover:cursor-pointer hover:bg-darkGray
              ${displayedCrossColor} ${displayedCrossStyle} transition-all duration-150`}
            onClick={squareClickHandler}
          ></div>

          <div>
            <CircularProgressBar
              label={label}
              showLabel={true}
              numerator={remainTime}
              denominator={denominator}
              progressBarColor={[displayedColorHex]}
              hollowSize="40%"
              circularBarSize="100"
              // clickHandler={circularClick}
            />
          </div>
        </div>
      </div>

      {/* Line graph */}
      <div className="-mt-8 -mb-7 -ml-4">
        <PositionLineGraph
          strokeColor={[`${displayedColorHex}`]}
          dataArray={openCfdDetails.positionLineGraph}
          lineGraphWidth={OPEN_POSITION_LINE_GRAPH_WIDTH}
          annotatedValue={openCfdDetails.openPrice}
        />
      </div>
    </div>
  );
};

export default OpenPositionItem;

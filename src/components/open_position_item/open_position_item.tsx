import {useContext, useState} from 'react';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';
import {
  OPEN_POSITION_LINE_GRAPH_WIDTH,
  TypeOfPnLColorHex,
  TypeOfTransaction,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import PositionLineGraph from '../position_line_graph/position_line_graph';
import UpdateFormModal from '../update_form_modal/update_form_modal';
import {IOpenCFDDetails} from '../../interfaces/tidebit_defi_background/open_cfd_details';
import {useGlobal} from '../../contexts/global_context';
import {ProfitState} from '../../constants/profit_state';
import {TypeOfPosition} from '../../constants/type_of_position';
import {randomIntFromInterval} from '../../lib/common';
import {MarketContext} from '../../contexts/market_context';
import {UserContext} from '../../contexts/user_context';
import {RENEW_QUOTATION_INTERVAL_SECONDS} from '../../constants/config';
import {
  IDisplayAcceptedCFDOrder,
  getDummyDisplayAcceptedCFDOrder,
} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {
  IDisplayApplyCFDOrder,
  getDummyDisplayApplyCloseCFDOrder,
} from '../../interfaces/tidebit_defi_background/display_apply_cfd_order';
import {CFDOrderType} from '../../constants/cfd_order_type';
// import HorizontalRelativeLineGraph from '../horizontal_relative_line_graph/horizontal_relative_line_graph';

interface IOpenPositionItemProps {
  openCfdDetails: IDisplayAcceptedCFDOrder;
}

const OpenPositionItem = ({openCfdDetails, ...otherProps}: IOpenPositionItemProps) => {
  // if (longOrShort !== 'long' && longOrShort !== 'short') return <></>;
  // if (profitOrLoss !== 'profit' && profitOrLoss !== 'loss') return <></>; if (profitOrLoss !== 'profit' && profitOrLoss !== 'loss') return <></>;
  // if (ticker !== 'ETH' && ticker !== 'BTC') return <></>;
  // console.log('openCfdDetails', openCfdDetails);
  const marketCtx = useContext(MarketContext);
  const userCtx = useContext(UserContext);
  const {
    visibleUpdateFormModalHandler,
    dataUpdateFormModalHandler,
    visiblePositionClosedModalHandler,
    dataPositionClosedModalHandler,
    toast,
  } = useGlobal();

  // 傳param進來的地方要改正確的 dummy data
  // TODO: toApplyUpdatedCFD function
  // TODO: toApplyClosedCFD function

  const toApplyUpdatedCFD = () => {
    const dummyData = {};
    return dummyData;
  };

  // from param or from user context
  const toApplyClosedCFD = (): IDisplayApplyCFDOrder => {
    const dummyData = {
      type: CFDOrderType.CREATE,
      // data: getDummyDisplayApplyCreateCFDOrder(marketCtx.selectedTicker!.currency),
      data: {
        ticker: 'BTC',
        amount: 1.8, // User input
        typeOfPosition: TypeOfPosition.BUY, // User input
        leverage: 5,
        price: randomIntFromInterval(1000, 10000),
        targetAsset: 'USDT',
        uniAsset: 'USDT',
        margin: {asset: 'BTC', amount: randomIntFromInterval(650, 10000)}, // User input
        takeProfit: 74521, // User input
        stopLoss: 25250, // User input
        guaranteedStop: true, // User input
        guaranteedStopFee: 1.8 * 10000 * 0.7,
        fee: 0,
        quotation: {
          ticker: 'BTC',
          targetAsset: 'USDT',
          uniAsset: 'USDT',
          price: randomIntFromInterval(1000, 10000),
          deadline: Date.now() / 1000 + RENEW_QUOTATION_INTERVAL_SECONDS,
          signature: '0x',
        }, // 報價單 定時從後端拿

        liquidationPrice: randomIntFromInterval(1000, 10000),
        liquidationTime: Date.now() / 1000 + 86400, // openTimestamp + 86400
      },
      signature: '0x',
      pnl: {
        type: ProfitState.PROFIT,
        value: 50,
      },
    };
    return dummyData;
  };

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
    visiblePositionClosedModalHandler();
    dataPositionClosedModalHandler({
      openCfdDetails: openCfdDetails,
      latestProps: {
        renewalDeadline: new Date().getTime() / 1000 + RENEW_QUOTATION_INTERVAL_SECONDS,
        latestClosedPrice:
          openCfdDetails.typeOfPosition === TypeOfPosition.BUY
            ? randomIntFromInterval(
                marketCtx.tickerLiveStatistics!.buyEstimatedFilledPrice * 0.75,
                marketCtx.tickerLiveStatistics!.buyEstimatedFilledPrice * 1.25
              )
            : openCfdDetails.typeOfPosition === TypeOfPosition.SELL
            ? randomIntFromInterval(
                marketCtx.tickerLiveStatistics!.sellEstimatedFilledPrice * 1.1,
                marketCtx.tickerLiveStatistics!.sellEstimatedFilledPrice * 1.25
              )
            : 99999,
      },
    });
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
  const displayedHoverPausedColor =
    openCfdDetails.pnl.type === ProfitState.PROFIT ? 'hover:bg-lightGreen5' : 'hover:bg-lightRed';

  const displayedSymbol =
    openCfdDetails.pnl.type === ProfitState.PROFIT
      ? '+'
      : openCfdDetails.pnl.type === ProfitState.LOSS
      ? '-'
      : '';

  return (
    <div className="">
      {/* brief of this open position */}
      <div className="">
        <div className="mt-5 flex justify-between">
          <div className="relative -mt-4 -ml-2 w-50px">
            <div
              className="absolute top-3 z-10 h-110px w-280px bg-transparent hover:cursor-pointer"
              onClick={openItemClickHandler}
            ></div>

            {/* Pause square cover
            <div
              className={`absolute left-14px top-26px z-20 h-6 w-6 hover:cursor-pointer hover:bg-darkGray`}
              onClick={clickHandler}
            ></div> */}

            {/* -----Paused square----- */}
            <div
              className={`absolute left-14px top-26px z-30 h-6 w-6 hover:cursor-pointer ${displayedHoverPausedColor}`}
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

          {/* TODO: switch the layout */}
          {/* {displayedTickerLayout} */}
          <div className="w-70px">
            <div className="text-sm">{openCfdDetails.ticker}</div>
            <div className="text-sm text-lightWhite">
              {displayedString.TITLE}{' '}
              <span className="text-xs text-lightGray">{displayedString.SUBTITLE}</span>
            </div>
          </div>

          <div className="mt-1 w-70px">
            <div className="text-xs text-lightGray">Value</div>
            <div className="text-sm">
              $ {openCfdDetails.openValue.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}
            </div>
          </div>

          <div className="mt-1 w-60px">
            <div className="text-xs text-lightGray">PNL</div>
            <div className={`${displayedTextColor} text-sm`}>
              <span className="">{displayedSymbol}</span> ${' '}
              {openCfdDetails.pnl.value.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}
            </div>
          </div>
        </div>
      </div>

      {/* Line graph */}
      <div className="-mt-8 -ml-2 -mb-7">
        <PositionLineGraph
          strokeColor={[`${displayedColorHex}`]}
          dataArray={openCfdDetails.positionLineGraph}
          lineGraphWidth={OPEN_POSITION_LINE_GRAPH_WIDTH}
          annotatedValue={openCfdDetails.positionLineGraph[0]}
        />

        {/* <div className="absolute -top-5">
          <HorizontalRelativeLineGraph
            strokeColor={[`#A5C4F3`]}
            dataArray={tickerTrendArray}
            lineGraphWidth="250"
            annotatedValue={horizontalValueLine}
          />
        </div> */}
      </div>

      {/* Divider */}
      {/* <div className="absolute top-200px my-auto h-px w-7/8 rounded bg-white/50"></div> */}

      {/* <PositionDetailsModal
        // id={`TBD20230207001`}
        // openCfdDetails={dataFormat}
        openCfdDetails={openCfdDetails}
        modalVisible={visiblePositionDetailsModal}
        modalClickHandler={detailedModalClickHandler}
      /> */}
    </div>
  );
};

export default OpenPositionItem;

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
import {timestampToString, getNowSeconds, randomIntFromInterval} from '../../lib/common';
import {MarketContext} from '../../contexts/market_context';
import {UserContext} from '../../contexts/user_context';
import {
  IDisplayAcceptedCFDOrder,
  // getDummyDisplayAcceptedCFDOrder,
} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {
  IDisplayApplyCFDOrder,
  getDummyDisplayApplyCloseCFDOrder,
} from '../../interfaces/tidebit_defi_background/display_apply_cfd_order';
import {useTranslation} from 'react-i18next';

type TranslateFunction = (s: string) => string;
interface IOpenPositionItemProps {
  openCfdDetails: IDisplayAcceptedCFDOrder;
}

const OpenPositionItem = ({openCfdDetails, ...otherProps}: IOpenPositionItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

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
        openCfdDetails?.orderSnapshot?.typeOfPosition === TypeOfPosition.BUY
          ? marketCtx.tickerLiveStatistics?.sellEstimatedFilledPrice ?? 0
          : marketCtx.tickerLiveStatistics?.buyEstimatedFilledPrice ?? 999999999
      }\nsuggestion: ${JSON.stringify(openCfdDetails?.suggestion)}`,
      type: 'info',
    });
  };

  const nowTimestamp = new Date().getTime() / 1000;
  const remainSecs = openCfdDetails?.orderSnapshot?.liquidationTime - nowTimestamp;

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

  const openPrice = openCfdDetails?.orderSnapshot?.openPrice;
  const nowPrice = 300; //openCfdDetails.positionLineGraph[openCfdDetails.positionLineGraph.length - 1];
  const liquidationPrice = openCfdDetails?.orderSnapshot?.liquidationPrice;
  const takeProfitPrice = openCfdDetails?.orderSnapshot?.takeProfit ?? 0;
  const stopLossPrice = openCfdDetails?.orderSnapshot?.stopLoss ?? 0;
  const rangingLiquidation = Math.abs(openPrice - liquidationPrice);
  const rangingTP = Math.abs(openPrice - (takeProfitPrice ?? 0));
  const rangingSL = Math.abs(openPrice - (stopLossPrice ?? 0));

  const displayedAnnotatedValue =
    Math.abs(nowPrice - liquidationPrice) <= rangingLiquidation * 0.1
      ? liquidationPrice
      : Math.abs(nowPrice - takeProfitPrice) <= rangingTP * 0.1
      ? takeProfitPrice
      : Math.abs(nowPrice - stopLossPrice) <= rangingSL * 0.1
      ? stopLossPrice
      : openPrice;

  const displayedAnnotatedString =
    Math.abs(nowPrice - liquidationPrice) <= rangingLiquidation * 0.1
      ? t('TRADE_PAGE.OPEN_POSITION_ITEM_LIQUIDATION')
      : Math.abs(nowPrice - takeProfitPrice) <= rangingTP * 0.1
      ? t('TRADE_PAGE.OPEN_POSITION_ITEM_TP')
      : Math.abs(nowPrice - stopLossPrice) <= rangingSL * 0.1
      ? t('TRADE_PAGE.OPEN_POSITION_ITEM_SL')
      : `$ ${openPrice}`;

  const displayedString =
    openCfdDetails?.orderSnapshot?.typeOfPosition === TypeOfPosition.BUY
      ? TypeOfTransaction.LONG
      : TypeOfTransaction.SHORT;

  const displayedColorHex =
    remainSecs < 60
      ? TypeOfPnLColorHex.LIQUIDATION
      : openCfdDetails?.pnl?.type === ProfitState.PROFIT
      ? TypeOfPnLColorHex.PROFIT
      : openCfdDetails?.pnl?.type === ProfitState.LOSS
      ? TypeOfPnLColorHex.LOSS
      : TypeOfPnLColorHex.EQUAL;

  const displayedColorDashLine =
    Math.abs(nowPrice - liquidationPrice) <= rangingLiquidation * 0.1 ||
    Math.abs(nowPrice - takeProfitPrice) <= rangingTP * 0.1 ||
    Math.abs(nowPrice - stopLossPrice) <= rangingSL * 0.1
      ? TypeOfPnLColorHex.LIQUIDATION
      : displayedColorHex;

  const displayedColorAnnotatedString =
    Math.abs(nowPrice - liquidationPrice) <= rangingLiquidation * 0.1 ||
    Math.abs(nowPrice - takeProfitPrice) <= rangingTP * 0.1 ||
    Math.abs(nowPrice - stopLossPrice) <= rangingSL * 0.1
      ? '#000000'
      : '#FFFFFF';

  const displayedTextColor =
    openCfdDetails?.pnl?.type === ProfitState.PROFIT ? 'text-lightGreen5' : 'text-lightRed'; //lightYellow2

  const displayedCrossColor =
    openCfdDetails?.pnl?.type === ProfitState.PROFIT
      ? 'hover:before:bg-lightGreen5 hover:after:bg-lightGreen5'
      : 'hover:before:bg-lightRed hover:after:bg-lightRed';
  const displayedCrossStyle =
    'before:absolute before:left-1 before:top-10px before:z-40 before:block before:h-1 before:w-5 before:rotate-45 before:rounded-md after:absolute after:left-1 after:top-10px after:z-40 after:block after:h-1 after:w-5 after:-rotate-45 after:rounded-md';

  const displayedSymbol =
    openCfdDetails?.pnl?.type === ProfitState.PROFIT
      ? '+'
      : openCfdDetails?.pnl?.type === ProfitState.LOSS
      ? '-'
      : '';

  const displayedCreateTime = timestampToString(
    openCfdDetails?.orderSnapshot?.createTimestamp ?? 0
  );

  //console.log(openCfdDetails.positionLineGraph);

  return (
    <div className="relative">
      <div
        className="absolute z-10 h-150px w-280px bg-transparent hover:cursor-pointer"
        onClick={openItemClickHandler}
      ></div>
      {/* brief of this open position */}
      <div className="mt-2 flex justify-between">
        {/* TODO: switch the layout */}
        {/* {displayedTickerLayout} */}

        <div className="inline-flex items-center text-sm">
          {/* ToDo: default currency icon (20230310 - Julian) issue #338 */}
          <Image
            src={`/asset_icon/${openCfdDetails?.orderSnapshot?.ticker.toLowerCase()}.svg`}
            alt={`${openCfdDetails?.orderSnapshot?.ticker} icon`}
            width={15}
            height={15}
          />
          <p className="ml-1">{openCfdDetails?.orderSnapshot?.ticker}</p>

          <div className="ml-2 text-sm text-tidebitTheme">
            {displayedString.TITLE}{' '}
            <span className="text-xs text-lightGray">{displayedString.SUBTITLE}</span>
          </div>
        </div>

        <div className="flex flex-col items-end text-xs text-lightGray">
          <p>{displayedCreateTime.date}</p>
          <p>{displayedCreateTime.time}</p>
        </div>
      </div>

      {/* Line graph */}
      <div className="-my-6 -mx-4">
        <PositionLineGraph
          strokeColor={[displayedColorHex, displayedColorDashLine, displayedColorAnnotatedString]}
          dataArray={openCfdDetails.positionLineGraph}
          lineGraphWidth={OPEN_POSITION_LINE_GRAPH_WIDTH}
          annotatedValue={displayedAnnotatedValue}
          annotatedString={displayedAnnotatedString}
        />
      </div>

      <div className="mt-1 flex justify-between">
        <div className="">
          <div className="text-xs text-lightGray">{t('TRADE_PAGE.OPEN_POSITION_ITEM_VALUE')}</div>
          <div className="text-sm">
            ${' '}
            {openCfdDetails?.openValue.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="-ml-8">
          <div className="text-xs text-lightGray">{t('TRADE_PAGE.OPEN_POSITION_ITEM_PNL')}</div>
          <div className={`${displayedTextColor} text-sm`}>
            <span className="">{displayedSymbol}</span> ${' '}
            {openCfdDetails?.pnl?.value.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="relative -mt-4 w-50px">
          {/* -----Paused square----- */}
          <div
            className={`absolute left-12px top-21px z-30 h-28px w-28px rounded-full hover:cursor-pointer hover:bg-darkGray
              ${displayedCrossColor} ${displayedCrossStyle} transition-all duration-150`}
            onClick={squareClickHandler}
          ></div>

          <CircularProgressBar
            label={label}
            showLabel={true}
            numerator={remainTime}
            denominator={denominator}
            progressBarColor={[displayedColorHex]}
            hollowSize="40%"
            circularBarSize="90"
          />
        </div>
      </div>
    </div>
  );
};

export default OpenPositionItem;

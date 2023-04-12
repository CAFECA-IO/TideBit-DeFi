import {useContext, useState} from 'react';
import Image from 'next/image';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';
import {
  OPEN_POSITION_LINE_GRAPH_WIDTH,
  TypeOfPnLColorHex,
  TypeOfTransaction,
  LINE_GRAPH_STROKE_COLOR,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import PositionLineGraph from '../position_line_graph/position_line_graph';
import UpdateFormModal from '../update_form_modal/update_form_modal';
import {IDataPositionClosedModal, useGlobal} from '../../contexts/global_context';
import {ProfitState} from '../../constants/profit_state';
import {TypeOfPosition} from '../../constants/type_of_position';
import {timestampToString, getNowSeconds, randomIntFromInterval} from '../../lib/common';
import {cfdStateCode} from '../../constants/cfd_state_code';
import {POSITION_CLOSE_COUNTDOWN_SECONDS} from '../../constants/config';
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
  const liquidationPrice = openCfdDetails?.orderSnapshot?.liquidationPrice;
  const takeProfitPrice = openCfdDetails?.orderSnapshot?.takeProfit ?? 0;
  const stopLossPrice = openCfdDetails?.orderSnapshot?.stopLoss ?? 0;

  /* Info: (20230411 - Julian) 折線圖參考線的優先顯示順序:
   * 1. Liquidation
   * 2. Stop Loss Price
   * 3. Take Profit Price
   * 4. Open price */
  const lineGraphAnnotation = {
    LIQUIDATION: {VALUE: liquidationPrice, STRING: t('TRADE_PAGE.OPEN_POSITION_ITEM_LIQUIDATION')},
    STOP_LOSS: {VALUE: stopLossPrice, STRING: t('TRADE_PAGE.OPEN_POSITION_ITEM_SL')},
    TAKE_PROFIT: {VALUE: takeProfitPrice, STRING: t('TRADE_PAGE.OPEN_POSITION_ITEM_TP')},
    OPEN_PRICE: {VALUE: openPrice, STRING: `$ ${openPrice}`},
  };

  const displayedAnnotation =
    openCfdDetails.stateCode === cfdStateCode.LIQUIDATION
      ? lineGraphAnnotation.LIQUIDATION
      : openCfdDetails.stateCode === cfdStateCode.STOP_LOSS
      ? lineGraphAnnotation.STOP_LOSS
      : openCfdDetails.stateCode === cfdStateCode.TAKE_PROFIT
      ? lineGraphAnnotation.TAKE_PROFIT
      : lineGraphAnnotation.OPEN_PRICE;

  /* Info: (20230411 - Julian) 倒數 60 秒時圖表呈現黃色 */
  const displayedColorHex =
    remainSecs <= POSITION_CLOSE_COUNTDOWN_SECONDS
      ? TypeOfPnLColorHex.LIQUIDATION
      : openCfdDetails?.pnl?.type === ProfitState.PROFIT
      ? TypeOfPnLColorHex.PROFIT
      : openCfdDetails?.pnl?.type === ProfitState.LOSS
      ? TypeOfPnLColorHex.LOSS
      : TypeOfPnLColorHex.EQUAL;

  /* Info: (20230411 - Julian) 折線圖參考線顏色 */
  const lineGraphAnnotationColor = {
    CLOSING_TIME: {DASH_LINE: TypeOfPnLColorHex.LIQUIDATION, STRING: LINE_GRAPH_STROKE_COLOR.BLACK},
    COMMON: {DASH_LINE: displayedColorHex, STRING: LINE_GRAPH_STROKE_COLOR.DEFAULT},
  };

  const displayedAnnotationColor =
    openCfdDetails.stateCode === cfdStateCode.COMMON
      ? lineGraphAnnotationColor.COMMON
      : lineGraphAnnotationColor.CLOSING_TIME;

  const displayedTypeString =
    openCfdDetails?.orderSnapshot?.typeOfPosition === TypeOfPosition.BUY
      ? TypeOfTransaction.LONG
      : TypeOfTransaction.SHORT;

  const displayedTextColor =
    openCfdDetails?.pnl?.type === ProfitState.PROFIT ? 'text-lightGreen5' : 'text-lightRed';

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

  const displayedPNL = openCfdDetails?.pnl?.value.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  const displayedCreateTime = timestampToString(
    openCfdDetails?.orderSnapshot?.createTimestamp ?? 0
  );

  return (
    <div className="relative my-2">
      <div
        className="absolute z-10 h-150px w-280px bg-transparent hover:cursor-pointer"
        onClick={openItemClickHandler}
      ></div>
      {/* Info: (20230411 - Julian) brief of this open position */}
      <div className="mt-2 flex justify-between">
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
            {displayedTypeString.TITLE}{' '}
            <span className="text-xs text-lightGray">{displayedTypeString.SUBTITLE}</span>
          </div>
        </div>

        <div className="flex flex-col items-end text-xs text-lightGray">
          <p>{displayedCreateTime.date}</p>
          <p>{displayedCreateTime.time}</p>
        </div>
      </div>

      {/* Info: (20230411 - Julian) Line graph */}
      <div className="-my-6 -mx-4">
        <PositionLineGraph
          strokeColor={[
            displayedColorHex,
            displayedAnnotationColor.DASH_LINE,
            displayedAnnotationColor.STRING,
          ]}
          dataArray={openCfdDetails.positionLineGraph}
          lineGraphWidth={OPEN_POSITION_LINE_GRAPH_WIDTH}
          annotatedValue={displayedAnnotation.VALUE}
          annotatedString={displayedAnnotation.STRING}
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
            <span className="">{displayedSymbol}</span> $ {displayedPNL}
          </div>
        </div>

        <div className="relative z-20 -mt-2 h-50px w-50px scale-90">
          {/* Info: (20230411 - Julian) Paused square */}
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

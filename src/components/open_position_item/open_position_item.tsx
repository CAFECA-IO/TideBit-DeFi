import React, {useContext, useMemo} from 'react';
import Image from 'next/image';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';
import {
  OPEN_POSITION_LINE_GRAPH_WIDTH,
  TypeOfPnLColorHex,
  TypeOfTransaction,
  LINE_GRAPH_STROKE_COLOR,
} from '../../constants/display';
import PositionLineGraph from '../position_line_graph/position_line_graph';
import {useGlobal} from '../../contexts/global_context';
import {TypeOfPosition} from '../../constants/type_of_position';
import {numberFormatted, roundToDecimalPlaces, timestampToString, toPnl} from '../../lib/common';
import {cfdStateCode} from '../../constants/cfd_state_code';
import {POSITION_CLOSE_COUNTDOWN_SECONDS} from '../../constants/config';
import {MarketContext} from '../../contexts/market_context';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {useTranslation} from 'next-i18next';
import {defaultResultFailed} from '../../interfaces/tidebit_defi_background/result';
import {IQuotation} from '../../interfaces/tidebit_defi_background/quotation';
import {ToastTypeAndText} from '../../constants/toast_type';
import {ToastId} from '../../constants/toast_id';
import {Code} from '../../constants/code';
import SafeMath from '../../lib/safe_math';
import {RoundCondition} from '../../interfaces/tidebit_defi_background/round_condition';
import {NotificationContext} from '../../contexts/notification_context';
import {TickerContext} from '../../contexts/ticker_context';

type TranslateFunction = (s: string) => string;
interface IOpenPositionItemProps {
  openCfdDetails: IDisplayCFDOrder;
  hideOpenLineGraph?: boolean;
}

const OpenPositionItem = ({openCfdDetails, hideOpenLineGraph}: IOpenPositionItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const notificationCtx = useContext(NotificationContext);
  const marketCtx = useContext(MarketContext);
  const tickerCtx = useContext(TickerContext);
  const {
    visibleUpdateFormModalHandler,
    dataUpdateFormModalHandler,
    visiblePositionClosedModalHandler,
    dataPositionClosedModalHandler,
    toast,
  } = useGlobal();

  const updatedModalClickHandler = () => {
    dataUpdateFormModalHandler({...openCfdDetails, pnl: pnl});
    visibleUpdateFormModalHandler();
  };

  const {
    openPrice,
    openValue,
    createTimestamp,
    instId,
    targetAsset,
    typeOfPosition,
    liquidationTime,
    liquidationPrice,
    takeProfit,
    stopLoss,
    stateCode,
  } = openCfdDetails;

  const spread = marketCtx.getTickerSpread(openCfdDetails.instId);
  const positionLineGraph = useMemo(() => {
    const lineData = marketCtx.listTickerPositions(openCfdDetails.instId, {
      begin: openCfdDetails.createTimestamp,
    });
    return lineData;
  }, []);

  const positionLineGraphWithSpread =
    typeOfPosition === TypeOfPosition.BUY
      ? positionLineGraph.map((v: number) => +SafeMath.mult(v, SafeMath.minus(1, spread)))
      : positionLineGraph.map((v: number) => +SafeMath.mult(v, SafeMath.plus(1, spread)));

  const closePrice = marketCtx.predictCFDClosePrice(
    openCfdDetails.instId,
    openCfdDetails.typeOfPosition
  );

  const pnl = toPnl({
    openPrice,
    closePrice,
    amount: openCfdDetails.amount,
    typeOfPosition: openCfdDetails.typeOfPosition,
    spread,
  });

  const nowTimestamp = new Date().getTime() / 1000;
  const remainSecs = liquidationTime - nowTimestamp;

  const remainTime =
    remainSecs < 60
      ? Math.round(remainSecs)
      : remainSecs < 3600
        ? Math.round(remainSecs / 60)
        : remainSecs < 86400
          ? Math.round(remainSecs / 3600)
          : Math.round(remainSecs / 86400);

  const label =
    remainSecs < 60
      ? [`${Math.round(remainSecs)} S`]
      : remainSecs < 3600
        ? [`${Math.round(remainSecs / 60)} M`]
        : remainSecs < 86400
          ? [`${Math.round(remainSecs / 3600)} H`]
          : [`${Math.round(remainSecs / 86400)} D`];

  const denominator = remainSecs < 60 ? 60 : remainSecs < 3600 ? 60 : remainSecs < 86400 ? 24 : 7;

  const closedModalClickHandler = async () => {
    await getQuotation();
  };

  const toDisplayCloseOrder = (cfd: IDisplayCFDOrder, quotation: IQuotation): IDisplayCFDOrder => {
    const pnlSoFar = toPnl({
      openPrice: cfd.openPrice,
      closePrice: quotation.price,
      amount: cfd.amount,
      typeOfPosition: cfd.typeOfPosition,
      spread: marketCtx.getTickerSpread(cfd.instId),
    });

    return {
      ...cfd,
      closePrice: quotation.price,
      pnl: pnlSoFar,
    };
  };

  const getQuotation = async () => {
    let quotation = {...defaultResultFailed};
    const oppositeTypeOfPosition =
      openCfdDetails?.typeOfPosition === TypeOfPosition.BUY
        ? TypeOfPosition.SELL
        : TypeOfPosition.BUY;

    try {
      quotation = await marketCtx.getCFDQuotation(openCfdDetails?.instId, oppositeTypeOfPosition);

      const data = quotation.data as IQuotation;
      if (
        quotation.success &&
        data.typeOfPosition === oppositeTypeOfPosition &&
        data.instId === openCfdDetails.instId &&
        quotation.data !== null
      ) {
        const displayedCloseOrder = toDisplayCloseOrder(openCfdDetails, data);
        dataPositionClosedModalHandler(displayedCloseOrder);

        visiblePositionClosedModalHandler();
      } else {
        toast({
          type: ToastTypeAndText.ERROR.type,
          toastId: ToastId.GET_QUOTATION_ERROR,
          message: `${t('POSITION_MODAL.ERROR_MESSAGE')} (${
            Code.CANNOT_GET_QUOTATION_FROM_CONTEXT
          })`,
          typeText: t(ToastTypeAndText.ERROR.text),
          isLoading: false,
          autoClose: false,
        });
      }
    } catch (err) {
      notificationCtx.addException(
        'getQuotation open_position_item',
        err as Error,
        Code.UNKNOWN_ERROR
      );
      // TODO: Report error to backend (20230613 - Shirley)
      toast({
        type: ToastTypeAndText.ERROR.type,
        toastId: ToastId.GET_QUOTATION_ERROR,
        message: `${t('POSITION_MODAL.ERROR_MESSAGE')} (${Code.UNKNOWN_ERROR_IN_COMPONENT})`,
        typeText: t(ToastTypeAndText.ERROR.text),
        isLoading: false,
        autoClose: false,
      });
    }
  };

  /* Info: (20230411 - Julian) 折線圖參考線的優先顯示順序:
   * 1. Liquidation
   * 2. Stop Loss Price
   * 3. Take Profit Price
   * 4. Open price
   * VALUE -> 數值(Number), STRING -> 參考線上的文字(String) */
  const displayedPositionPrice =
    typeOfPosition === TypeOfPosition.BUY
      ? +SafeMath.plus(openPrice, SafeMath.mult(openPrice, spread))
      : +SafeMath.minus(openPrice, SafeMath.mult(openPrice, spread));
  const lineGraphAnnotation = {
    LIQUIDATION: {
      VALUE: liquidationPrice,
      STRING: t('TRADE_PAGE.OPEN_POSITION_ITEM_LIQUIDATION'),
    },
    STOP_LOSS: {
      VALUE: stopLoss ?? 0,
      STRING: t('TRADE_PAGE.OPEN_POSITION_ITEM_SL'),
    },
    TAKE_PROFIT: {
      VALUE: takeProfit ?? 0,
      STRING: t('TRADE_PAGE.OPEN_POSITION_ITEM_TP'),
    },
    OPEN_PRICE: {
      VALUE: displayedPositionPrice,
      STRING: `$ ${numberFormatted(displayedPositionPrice)}`,
    },
  };

  const displayedAnnotation =
    stateCode === cfdStateCode.LIQUIDATION
      ? lineGraphAnnotation.LIQUIDATION
      : stateCode === cfdStateCode.STOP_LOSS
        ? lineGraphAnnotation.STOP_LOSS
        : stateCode === cfdStateCode.TAKE_PROFIT
          ? lineGraphAnnotation.TAKE_PROFIT
          : lineGraphAnnotation.OPEN_PRICE;

  /* Info: (20230411 - Julian) 倒數 60 秒時圖表呈現黃色 */
  const displayedColorHex =
    remainSecs <= POSITION_CLOSE_COUNTDOWN_SECONDS
      ? TypeOfPnLColorHex.LIQUIDATION
      : pnl?.value > 0
        ? TypeOfPnLColorHex.PROFIT
        : pnl?.value < 0
          ? TypeOfPnLColorHex.LOSS
          : TypeOfPnLColorHex.EQUAL;

  /* Info: (20230411 - Julian) 折線圖參考線顏色
   * 如果 DASH_LINE 是黃色(LIQUIDATION)或白色(EQUAL)，文字就用黑色(其餘用白色) */
  const lineGraphAnnotationColor =
    displayedColorHex === TypeOfPnLColorHex.LIQUIDATION ||
    displayedColorHex === TypeOfPnLColorHex.EQUAL
      ? LINE_GRAPH_STROKE_COLOR.BLACK
      : LINE_GRAPH_STROKE_COLOR.WHITE;

  const displayedAnnotationColor = {DASH_LINE: displayedColorHex, STRING: lineGraphAnnotationColor};

  const displayedTypeString =
    typeOfPosition === TypeOfPosition.BUY ? TypeOfTransaction.LONG : TypeOfTransaction.SHORT;

  const displayedTextColor =
    pnl?.value > 0 ? 'text-lightGreen5' : pnl?.value < 0 ? 'text-lightRed' : 'text-lightWhite';

  const displayedCrossColor =
    pnl?.value > 0
      ? 'hover:before:bg-lightGreen5 hover:after:bg-lightGreen5'
      : pnl?.value < 0
        ? 'hover:before:bg-lightRed hover:after:bg-lightRed'
        : 'hover:before:bg-lightWhite hover:after:bg-lightWhite';

  const displayedCrossStyle =
    'before:absolute before:left-1 before:top-10px before:z-40 before:block before:h-1 before:w-5 before:rotate-45 before:rounded-md after:absolute after:left-1 after:top-10px after:z-40 after:block after:h-1 after:w-5 after:-rotate-45 after:rounded-md';

  const displayedPnLSymbol = !tickerCtx.selectedTicker?.price
    ? ''
    : pnl?.value > 0
      ? '+'
      : pnl?.value < 0
        ? '-'
        : openPrice !== closePrice && Math.abs(pnl?.value ?? 0) === 0
          ? '≈'
          : '';

  const displayedPnLValue = !!!tickerCtx.selectedTicker?.price
    ? '- -'
    : numberFormatted(pnl?.value);

  const displayedCreateTime = timestampToString(createTimestamp ?? 0);

  const displayedLineGraph = hideOpenLineGraph ? null : (
    <div className="-mx-4 mb-0 mt-3 h-60px">
      <PositionLineGraph
        strokeColor={[
          displayedColorHex,
          displayedAnnotationColor.DASH_LINE,
          displayedAnnotationColor.STRING,
        ]}
        dataArray={positionLineGraphWithSpread}
        lineGraphWidth={OPEN_POSITION_LINE_GRAPH_WIDTH}
        annotatedValue={displayedAnnotation.VALUE}
        annotatedString={displayedAnnotation.STRING}
      />
    </div>
  );

  return (
    <div className={`relative my-2 ${hideOpenLineGraph ? `min-h-50px` : `min-h-140px`}`}>
      <div
        className="absolute z-10 h-160px w-280px bg-transparent hover:cursor-pointer"
        onClick={updatedModalClickHandler}
      ></div>
      {/* Info: (20230411 - Julian) brief of this open position */}
      <div className="mt-2 flex justify-between">
        <div className="inline-flex items-center text-sm">
          {/* ToDo: default currency icon (20230310 - Julian) issue #338 */}
          <Image
            src={`/asset_icon/${targetAsset.toLowerCase()}.svg`}
            alt={`${targetAsset} icon`}
            width={15}
            height={15}
          />
          <p className="ml-1">{instId}</p>

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
      {displayedLineGraph}

      <div className="mt-1 flex justify-between">
        <div className="">
          <div className="text-xs text-lightGray">{t('TRADE_PAGE.OPEN_POSITION_ITEM_VALUE')}</div>
          <div className="text-sm">
            $ {numberFormatted(roundToDecimalPlaces(openValue, 2, RoundCondition.SHRINK))}
          </div>
        </div>

        <div className="-ml-8">
          <div className="text-xs text-lightGray">{t('TRADE_PAGE.OPEN_POSITION_ITEM_PNL')}</div>
          <div className={`${displayedTextColor} text-sm`}>
            <span className="">{displayedPnLSymbol}</span> $ {displayedPnLValue}
          </div>
        </div>

        <div className="relative z-20 -mt-2 h-50px w-50px scale-90">
          {/* Info: (20230411 - Julian) Paused square */}
          <div
            className={`absolute left-12px top-21px z-30 h-28px w-28px rounded-full hover:cursor-pointer hover:bg-darkGray
              ${displayedCrossColor} ${displayedCrossStyle} transition-all duration-150`}
            onClick={closedModalClickHandler}
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

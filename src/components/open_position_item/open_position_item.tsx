import {useContext} from 'react';
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
import {useGlobal} from '../../contexts/global_context';
import {ProfitState} from '../../constants/profit_state';
import {TypeOfPosition} from '../../constants/type_of_position';
import {timestampToString, toPnl} from '../../lib/common';
import {cfdStateCode} from '../../constants/cfd_state_code';
import {POSITION_CLOSE_COUNTDOWN_SECONDS, FRACTION_DIGITS} from '../../constants/config';
import {MarketContext} from '../../contexts/market_context';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {useTranslation} from 'react-i18next';
import {defaultResultFailed} from '../../interfaces/tidebit_defi_background/result';
import {IQuotation} from '../../interfaces/tidebit_defi_background/quotation';
import {ToastTypeAndText} from '../../constants/toast_type';
import {ToastId} from '../../constants/toast_id';
import {Code} from '../../constants/code';

type TranslateFunction = (s: string) => string;
interface IOpenPositionItemProps {
  openCfdDetails: IDisplayCFDOrder;
}

const OpenPositionItem = ({openCfdDetails}: IOpenPositionItemProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const marketCtx = useContext(MarketContext);
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
    // depracated: observe if there's gap between the current price and the line graph (20230710 - Shirley)
    // eslint-disable-next-line no-console
    console.log('line graph array: ', positionLineGraphWithSpread);
  };

  const {
    openPrice,
    openValue,
    createTimestamp,
    ticker,
    targetAsset,
    typeOfPosition,
    liquidationTime,
    liquidationPrice,
    takeProfit,
    stopLoss,
    stateCode,
  } = openCfdDetails;

  const spread = marketCtx.getTickerSpread(openCfdDetails.ticker);
  const positionLineGraph = marketCtx.listTickerPositions(openCfdDetails.ticker, {
    begin: openCfdDetails.createTimestamp,
  });

  const positionLineGraphWithSpread =
    typeOfPosition === TypeOfPosition.BUY
      ? positionLineGraph.map((v: number) => v * (1 - spread))
      : positionLineGraph.map((v: number) => v * (1 + spread));

  const closePrice = marketCtx.predictCFDClosePrice(
    openCfdDetails.ticker,
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
      : Math.round(remainSecs / 3600);

  const label =
    remainSecs < 60
      ? [`${Math.round(remainSecs)} S`]
      : remainSecs < 3600
      ? [`${Math.round(remainSecs / 60)} M`]
      : [`${Math.round(remainSecs / 3600)} H`];

  const denominator = remainSecs < 60 ? 60 : remainSecs < 3600 ? 60 : 24;

  const closedModalClickHandler = async () => {
    await getQuotation();
  };

  const toDisplayCloseOrder = (cfd: IDisplayCFDOrder, quotation: IQuotation): IDisplayCFDOrder => {
    const pnlSoFar = toPnl({
      openPrice: cfd.openPrice,
      closePrice: quotation.price,
      amount: cfd.amount,
      typeOfPosition: cfd.typeOfPosition,
      spread: marketCtx.getTickerSpread(cfd.ticker),
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
      quotation = await marketCtx.getCFDQuotation(openCfdDetails?.ticker, oppositeTypeOfPosition);

      const data = quotation.data as IQuotation;
      if (
        quotation.success &&
        data.typeOfPosition === oppositeTypeOfPosition &&
        data.ticker === openCfdDetails.ticker &&
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
      VALUE: openPrice,
      STRING: `$ ${openPrice.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)}`,
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
      : pnl?.type === ProfitState.PROFIT
      ? TypeOfPnLColorHex.PROFIT
      : pnl?.type === ProfitState.LOSS
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
    pnl?.type === ProfitState.PROFIT
      ? 'text-lightGreen5'
      : pnl?.type === ProfitState.LOSS
      ? 'text-lightRed'
      : 'text-lightWhite';

  const displayedCrossColor =
    pnl?.type === ProfitState.PROFIT
      ? 'hover:before:bg-lightGreen5 hover:after:bg-lightGreen5'
      : 'hover:before:bg-lightRed hover:after:bg-lightRed';
  const displayedCrossStyle =
    'before:absolute before:left-1 before:top-10px before:z-40 before:block before:h-1 before:w-5 before:rotate-45 before:rounded-md after:absolute after:left-1 after:top-10px after:z-40 after:block after:h-1 after:w-5 after:-rotate-45 after:rounded-md';

  const displayedPnLSymbol = !!!marketCtx.selectedTicker?.price
    ? ''
    : pnl?.type === ProfitState.PROFIT
    ? '+'
    : pnl?.type === ProfitState.LOSS
    ? '-'
    : '';

  const displayedPnLValue = !!!marketCtx.selectedTicker?.price
    ? '- -'
    : pnl?.value.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS);

  const displayedCreateTime = timestampToString(createTimestamp ?? 0);
  return (
    <div className="relative my-2 min-h-140px">
      <div
        className="absolute z-10 h-150px w-280px bg-transparent hover:cursor-pointer"
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
          <p className="ml-1">{ticker}</p>

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
      <div className="-mx-4 -mb-10 -mt-6">
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

      <div className="mt-1 flex justify-between">
        <div className="">
          <div className="text-xs text-lightGray">{t('TRADE_PAGE.OPEN_POSITION_ITEM_VALUE')}</div>
          <div className="text-sm">
            $ {openValue.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)}
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

import {useContext, useState} from 'react';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';
import {
  OPEN_POSITION_LINE_GRAPH_WIDTH,
  TypeOfPnLColorHex,
  TypeOfTransaction,
} from '../../constants/display';
import PositionLineGraph from '../position_line_graph/position_line_graph';
import PositionDetailsModal from '../position_details_modal/position_details_modal';
import {IOpenCFDDetails} from '../../interfaces/tidebit_defi_background/open_cfd_details';
import {toast} from 'react-toastify';
import {useGlobal} from '../../contexts/global_context';
import {ProfitState} from '../../constants/profit_state';
import {TypeOfPosition} from '../../constants/type_of_position';
import {randomIntFromInterval} from '../../lib/common';
import {MarketContext} from '../../contexts/market_context';
// import HorizontalRelativeLineGraph from '../horizontal_relative_line_graph/horizontal_relative_line_graph';

interface IOpenPositionItemProps {
  openCfdDetails: IOpenCFDDetails;
}

const OpenPositionItem = ({openCfdDetails, ...otherProps}: IOpenPositionItemProps) => {
  // if (longOrShort !== 'long' && longOrShort !== 'short') return <></>;
  // if (profitOrLoss !== 'profit' && profitOrLoss !== 'loss') return <></>; if (profitOrLoss !== 'profit' && profitOrLoss !== 'loss') return <></>;
  // if (ticker !== 'ETH' && ticker !== 'BTC') return <></>;
  const marketCtx = useContext(MarketContext);
  const {
    visiblePositionDetailsModalHandler,
    dataPositionDetailsModalHandler,
    visiblePositionClosedModalHandler,
    dataPositionClosedModalHandler,
  } = useGlobal();

  const [detailedModalVisible, setDetailedModalVisible] = useState(false);

  // TODO: 先跟 user context 拿特定 order id 的資料，再呼叫 function 拿到單一筆 CFD 詳細資料 。 global context 設定 cfd id，再顯示 position details modal
  // dataPositionDetailsModal 拿到的是整個JSON
  // globalContext.dataPositionDetailsModalHandler(cfd.orderId);
  const openItemClickHandler = () => {
    dataPositionDetailsModalHandler(openCfdDetails);
    visiblePositionDetailsModalHandler();
  };

  const nowTimestamp = new Date().getTime() / 1000;
  // const yesterdayTimestamp = new Date().getTime() / 1000 - 3600 * 10 - 5;
  // const passedHour = ((nowTimestamp - openCfdDetails.openTimestamp) / 3600).toFixed(0);
  const passedHour = Math.round((nowTimestamp - openCfdDetails.openTimestamp) / 3600);
  // console.log('passedHour', passedHour);

  const squareClickHandler = () => {
    visiblePositionClosedModalHandler();
    dataPositionClosedModalHandler({
      openCfdDetails: openCfdDetails,
      latestProps: {
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
        // latestPnL: {
        //   type: randomIntFromInterval(0, 100) <= 2 ? ProfitState.PROFIT : ProfitState.LOSS,
        //   value: randomIntFromInterval(0, 1000),
        // },
      },
    });
    // toast.error('test', {toastId: 'errorTest'});
    // console.log('show the modal displaying transaction detail');
    // return;
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
                numerator={passedHour}
                denominator={24}
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
            <div className="text-sm">$ {openCfdDetails.openValue}</div>
          </div>

          <div className="mt-1 w-60px">
            <div className="text-xs text-lightGray">PNL</div>
            <div className={`${displayedTextColor} text-sm`}>
              <span className="">{displayedSymbol}</span> $ {openCfdDetails.pnl.value}
            </div>
          </div>
        </div>
      </div>

      {/* Line graph */}
      <div className="-mt-8 -ml-2 -mb-7">
        <PositionLineGraph
          strokeColor={[`${displayedColorHex}`]}
          dataArray={openCfdDetails.positionLineGraph.dataArray}
          lineGraphWidth={OPEN_POSITION_LINE_GRAPH_WIDTH}
          annotatedValue={openCfdDetails.positionLineGraph.dataArray[0]}
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

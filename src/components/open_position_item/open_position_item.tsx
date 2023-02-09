import {useState} from 'react';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';
import {
  OPEN_POSITION_LINE_GRAPH_WIDTH,
  PROFIT_LOSS_COLOR_TYPE,
  TRANSACTION_TYPE,
} from '../../constants/display';
import PositionLineGraph from '../position_line_graph/position_line_graph';
import PositionDetailsModal from '../position_details_modal/position_details_modal';
import {IOpenCFDDetails} from '../../interfaces/tidebit_defi_background/open_cfd_details';
import {toast} from 'react-toastify';
import {useGlobal} from '../../lib/contexts/global_context';
// import HorizontalRelativeLineGraph from '../horizontal_relative_line_graph/horizontal_relative_line_graph';

interface IOpenPositionItemProps {
  profitOrLoss: string;
  longOrShort: string;
  ticker: string;
  passedHour: number;
  value: number;
  profitOrLossAmount: number;
  tickerTrendArray: number[];
  horizontalValueLine: number;
  openCfdDetails: IOpenCFDDetails;
  // circularClick?: () => void;
}

const OpenPositionItem = ({
  profitOrLoss,
  longOrShort,
  value,
  ticker,
  passedHour,
  profitOrLossAmount,
  tickerTrendArray,
  horizontalValueLine,
  openCfdDetails,
  // circularClick: circularClick,
  ...otherProps
}: IOpenPositionItemProps) => {
  if (longOrShort !== 'long' && longOrShort !== 'short') return <></>;
  if (profitOrLoss !== 'profit' && profitOrLoss !== 'loss') return <></>;
  if (ticker !== 'ETH' && ticker !== 'BTC') return <></>;
  const {
    visiblePositionDetailsModal,
    visiblePositionDetailsModalHandler,
    dataPositionDetailsModalHandler: positionDetailsModalDataHandler,
    dataPositionDetailsModal: positionDetailsModalData,
    toast,
  } = useGlobal();

  const [detailedModalVisible, setDetailedModalVisible] = useState(false);

  const detailedModalClickHandler = () => {
    // setDetailedModalVisible(!detailedModalVisible);
    visiblePositionDetailsModalHandler(!visiblePositionDetailsModal);
    passOrderIdHandler(openCfdDetails.id);
  };

  // FIXME: Position Details Modal Data
  const passOrderIdHandler = (orderId: string) => {
    positionDetailsModalDataHandler({orderIdPositionDetailsModal: orderId});
    // toast({type: 'info', message: `pass OrderId Handler order id, ${orderId}`});
    // toast({
    //   type: 'info',
    //   message: `position Details Modal Data from context, ${JSON.stringify(
    //     positionDetailsModalData
    //   )}`,
    // });

    // console.log('pass OrderId Handler `order id`', orderId);
    // console.log('position Details Modal Data `from context`', positionDetailsModalData);
  };

  // const progressPercentage = 50;
  // const [progress, setProgress] = useState(0);
  // const [label, setLabel] = useState('');

  const squareClickHandler = () => {
    // toast.error('test', {toastId: 'errorTest'});
    // console.log('show the modal displaying transaction detail');
    // return;
  };

  const displayedString = longOrShort === 'long' ? TRANSACTION_TYPE.long : TRANSACTION_TYPE.short;
  const displayedColorHex =
    profitOrLoss === 'profit' ? PROFIT_LOSS_COLOR_TYPE.profit : PROFIT_LOSS_COLOR_TYPE.loss;

  const displayedTextColor = profitOrLoss === 'profit' ? 'text-lightGreen5' : 'text-lightRed';
  const displayedHoverPausedColor =
    profitOrLoss === 'profit' ? 'hover:bg-lightGreen5' : 'hover:bg-lightRed';

  const displayedSymbol = profitOrLoss === 'profit' ? '+' : '-';

  return (
    <div className="">
      {/* brief of this open position */}
      <div className="">
        <div className="mt-5 flex justify-between">
          <div className="relative -mt-4 -ml-2 w-50px">
            <div
              className="absolute top-3 z-10 h-110px w-280px bg-transparent hover:cursor-pointer"
              onClick={detailedModalClickHandler}
            ></div>

            {/* Pause square cover
            <div
              className={`absolute left-14px top-26px z-20 h-6 w-6 hover:cursor-pointer hover:bg-darkGray`}
              onClick={clickHandler}
            ></div> */}

            {/* -----Paused square----- */}
            <div
              className={`absolute left-14px top-26px z-30 h-6 w-6 hover:cursor-pointer ${displayedHoverPausedColor}`}
              // onClick={squareClickHandler}
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
            <div className="text-sm">{ticker}</div>
            <div className="text-sm text-lightWhite">
              {displayedString.title}{' '}
              <span className="text-xs text-lightGray">{displayedString.subtitle}</span>
            </div>
          </div>

          <div className="mt-1 w-70px">
            <div className="text-xs text-lightGray">Value</div>
            <div className="text-sm">$ {value}</div>
          </div>

          <div className="mt-1 w-60px">
            <div className="text-xs text-lightGray">PNL</div>
            <div className={`${displayedTextColor} text-sm`}>
              <span className="">{displayedSymbol}</span> $ {profitOrLossAmount}
            </div>
          </div>
        </div>
      </div>

      {/* Line graph */}
      <div className="-mt-8 -ml-2 -mb-7">
        <PositionLineGraph
          strokeColor={[`${displayedColorHex}`]}
          dataArray={tickerTrendArray}
          lineGraphWidth={OPEN_POSITION_LINE_GRAPH_WIDTH}
          annotatedValue={horizontalValueLine}
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

      <PositionDetailsModal
        id={`TBD20230207001`}
        // openCfdDetails={dataFormat}
        openCfdDetails={openCfdDetails}
        modalVisible={visiblePositionDetailsModal}
        modalClickHandler={detailedModalClickHandler}
      />
    </div>
  );
};

export default OpenPositionItem;

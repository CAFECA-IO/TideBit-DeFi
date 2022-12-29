import {useState} from 'react';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';
import {PROFIT_LOSS_COLOR_TYPE, TRANSACTION_TYPE} from '../../constants/display';
import PositionLineGraph from '../position_line_graph/position_line_graph';

interface IOpenPositionItemProps {
  profitOrLoss: string;
  longOrShort: string;
  ticker: string;
  passedHour: number;
  value: number;
  profitOrLossAmount: number;
  tickerTrendArray: number[];
  horizontalValueLine: number;
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
  ...otherProps
}: IOpenPositionItemProps) => {
  if (longOrShort !== 'long' && longOrShort !== 'short') return <></>;
  if (profitOrLoss !== 'profit' && profitOrLoss !== 'loss') return <></>;
  if (ticker !== 'ETH' && ticker !== 'BTC') return <></>;

  // const progressPercentage = 50;
  // const [progress, setProgress] = useState(0);
  // const [label, setLabel] = useState('');

  const clickHandler = () => {
    // console.log('show the modal displaying transaction detail');
    return;
  };

  const displayedString = longOrShort === 'long' ? TRANSACTION_TYPE.long : TRANSACTION_TYPE.short;
  const displayedColorHex =
    profitOrLoss === 'profit' ? PROFIT_LOSS_COLOR_TYPE.profit : PROFIT_LOSS_COLOR_TYPE.loss;

  const displayedTextColor = profitOrLoss === 'profit' ? 'text-lightGreen' : 'text-lightRed';
  const displayedHoverPausedColor =
    profitOrLoss === 'profit' ? 'hover:bg-lightGreen' : 'hover:bg-lightRed';

  const displayedSymbol = profitOrLoss === 'profit' ? '+' : '-';

  return (
    <div className="">
      {/* brief of this open position */}
      <div className="">
        <div className="mt-5 flex justify-between">
          <div className="relative -mt-4 -ml-2 w-50px">
            {/* Pause square cover
            <div
              className={`absolute left-14px top-26px z-20 h-6 w-6 hover:cursor-pointer hover:bg-darkGray`}
              onClick={clickHandler}
            ></div> */}
            {/* Pause square */}
            <div
              className={`absolute left-14px top-26px z-10 h-6 w-6 hover:cursor-pointer ${displayedHoverPausedColor}`}
              onClick={clickHandler}
            ></div>

            <CircularProgressBar
              numerator={passedHour}
              denominator={24}
              progressBarColor={[displayedColorHex]}
              hollowSize="40%"
              circularBarSize="100"
            />
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
          lineGraphWidth="180"
          annotatedValue={horizontalValueLine}
        />
      </div>

      {/* Divider */}
      {/* <div className="absolute top-200px my-auto h-px w-7/8 rounded bg-white/50"></div> */}
    </div>
  );
};

export default OpenPositionItem;

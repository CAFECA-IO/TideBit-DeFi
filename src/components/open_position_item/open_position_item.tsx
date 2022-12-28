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
  pNL: number;
}

const OpenPositionItem = ({
  profitOrLoss,
  longOrShort,
  value,
  ticker,
  passedHour,
  pNL,
  ...otherProps
}: IOpenPositionItemProps) => {
  if (longOrShort !== 'long' && longOrShort !== 'short') return <></>;
  if (profitOrLoss !== 'profit' && profitOrLoss !== 'loss') return <></>;
  if (ticker !== 'ETH' && ticker !== 'BTC') return <></>;

  // const progressPercentage = 50;
  // const [progress, setProgress] = useState(0);
  // const [label, setLabel] = useState('');

  const displayedString = longOrShort === 'long' ? TRANSACTION_TYPE.long : TRANSACTION_TYPE.short;
  const displayedRadicalBarColor =
    profitOrLoss === 'profit' ? PROFIT_LOSS_COLOR_TYPE.profit : PROFIT_LOSS_COLOR_TYPE.loss;

  const displayedTextColor = profitOrLoss === 'profit' ? 'text-lightGreen' : 'text-lightRed';

  const displayedSymbol = profitOrLoss === 'profit' ? '+' : '-';

  // TODO: Otherwise, it will destroy the layout
  // It'll dest
  const displayedTickerLayout =
    ticker === 'ETH' ? (
      <div className="">
        <div className="text-sm">ETH</div>
        <div className="text-sm text-lightWhite">
          {displayedString.title}{' '}
          <span className="text-xs text-lightGray">{displayedString.subtitle}</span>
        </div>
      </div>
    ) : (
      <div className="">
        <div>BTC</div>
        <div className="text-lightWhite">
          {displayedString.title} <span className="text-lightGray">{displayedString.subtitle}</span>
        </div>
      </div>
    );

  return (
    <div className="">
      {/* brief of this open position */}
      <div className="">
        <div className="mt-5 flex justify-between">
          <div className="-mt-4 -ml-2 w-50px">
            <CircularProgressBar
              numerator={passedHour}
              denominator={24}
              progressBarColor={[displayedRadicalBarColor]}
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
              <span className="">{displayedSymbol}</span> $ {pNL}
            </div>
          </div>
        </div>
      </div>

      {/* Line graph */}
      <div className="-mt-10 -ml-2">
        <PositionLineGraph />
      </div>

      {/* Divider */}
      {/* <div className="absolute top-200px my-auto h-px w-7/8 rounded bg-white/50"></div> */}
    </div>
  );
};

export default OpenPositionItem;

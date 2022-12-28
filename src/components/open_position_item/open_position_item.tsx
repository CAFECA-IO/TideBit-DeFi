import {useState} from 'react';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';
import {PROFIT_LOSS_COLOR_TYPE, TRANSACTION_TYPE} from '../../constants/display';
import PositionLineGraph from '../position_line_graph/position_line_graph';

interface IOpenPositionItemProps {
  profitOrLoss: string;
  longOrShort: string;
  ticker: string;
  remainingHour: number;
  value: number;
  pNL: number;
}

const OpenPositionItem = ({
  profitOrLoss,
  longOrShort,
  value,
  ticker,
  remainingHour,
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
      <div className="absolute right-140px top-3">
        <div>ETH</div>
        <div className="text-lightWhite">
          {displayedString.title} <span className="text-lightGray">{displayedString.subtitle}</span>
        </div>
      </div>
    ) : (
      <div className="absolute right-140px top-3">
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
        <div className="relative">
          <div className="w-50px">
            <CircularProgressBar
              numerator={remainingHour}
              denominator={24}
              progressBarColor={[displayedRadicalBarColor]}
              hollowSize="40%"
              circularBarSize="100"
            />
          </div>

          {displayedTickerLayout}

          <div className="absolute right-20 top-3">
            <div>Value</div>
            <div>$ {value}</div>
          </div>

          <div className="absolute right-0 top-3">
            <div>PNL</div>
            <div className={`${displayedTextColor}`}>
              <span className="">{displayedSymbol}</span> $ {pNL}
            </div>
          </div>
        </div>
      </div>

      {/* Line graph */}
      <div>
        <PositionLineGraph />
      </div>

      {/* Divider */}
      {/* <div className="absolute top-200px my-auto h-px w-7/8 rounded bg-white/50"></div> */}
    </div>
  );
};

export default OpenPositionItem;

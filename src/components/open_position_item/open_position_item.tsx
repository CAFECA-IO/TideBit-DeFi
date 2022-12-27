import {useState} from 'react';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';
import {PROFIT_LOSS_COLOR_TYPE} from '../../constants/display';

const OpenPositionItem = () => {
  // const progressPercentage = 50;
  // const [progress, setProgress] = useState(0);
  // const [label, setLabel] = useState('');

  return (
    <div>
      {/* brief of this open position */}
      <div>
        <div className="relative">
          <div className="absolute -left-130px top-0">
            <CircularProgressBar
              numerator={11}
              denominator={24}
              progressBarColor={[PROFIT_LOSS_COLOR_TYPE.loss]}
              circularBarSize="100"
            />
          </div>

          <div className="absolute right-36 top-3">
            <div>ETH</div>
            <div className="text-lightWhite">
              Up <span className="text-lightGray">(Buy)</span>
            </div>
          </div>

          <div className="absolute right-20 top-3">
            <div>Value</div>
            <div>$ 656.9</div>
          </div>

          <div className="absolute right-0 top-3">
            <div>PNL</div>
            <div>-$ 34.9</div>
          </div>
        </div>
      </div>

      {/* Line graph */}
      <div></div>

      {/* Divider */}
      <span className="absolute top-200px my-auto h-px w-7/8 rounded bg-white/50"></span>
    </div>
  );
};

export default OpenPositionItem;

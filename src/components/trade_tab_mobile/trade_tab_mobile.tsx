import React from 'react';
import RippleButton from '../ripple_button/ripple_button';

const TradeTabMobile = () => {
  return (
    <div className="flex items-center justify-between">
      {/* Long Button */}
      <div className="flex items-center justify-center">
        <RippleButton
          buttonType="button"
          className={`${'w-120px'} rounded-md bg-lightGreen5 py-2 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightGreen5/80`}
        >
          <b>UP</b> <br />
          <p className="text-xs">Above $ 1545.0</p>
        </RippleButton>
      </div>

      {/* Short Button */}
      <div className="ml-4 flex items-center justify-center">
        <RippleButton
          buttonType="button"
          className={`${'w-120px'} rounded-md bg-lightRed py-2 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightRed/80`}
        >
          <b>Down</b> <br />
          <p className="text-xs">Below $ 1030.0</p>
        </RippleButton>
      </div>
    </div>
  );
};

export default TradeTabMobile;

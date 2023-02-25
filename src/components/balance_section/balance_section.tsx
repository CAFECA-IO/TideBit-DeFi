import React from 'react';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';

const BalanceSection = () => {
  // TODO: userBalance from userContext
  const totalBalance = 200;
  const avblBalance = 80;
  const circleSize = '380';

  // flex w-full justify-center text-center
  return (
    <div className="">
      <CircularProgressBar
        progressBarColor={['#29C1E1']}
        numerator={avblBalance}
        denominator={totalBalance}
        hollowSize="85%"
        circularBarSize={circleSize}
      />
    </div>
  );
};

export default BalanceSection;

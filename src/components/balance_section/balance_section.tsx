import React from 'react';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';
import Image from 'next/image';

const BalanceSection = () => {
  // TODO: userBalance from userContext
  const totalBalance = 200;
  const avblBalance = 80;

  const circleSize = '380';
  const eyeIconSize = 30;

  // TODO: 用 image container 來置中圖片上的文字
  // flex w-full justify-center text-center
  return (
    <div className="">
      {/* absolute top-52 left-1/2 w-300px bg-cuteBlue */}
      <div className="">
        <div className="relative">
          <CircularProgressBar
            progressBarColor={['#29C1E1']}
            numerator={avblBalance}
            denominator={totalBalance}
            hollowSize="85%"
            circularBarSize={circleSize}
          />
        </div>

        <div className="absolute top-52 left-1/2 w-300px bg-cuteBlue">
          <div className="flex items-center space-x-2">
            <p>Total Balance</p>{' '}
            <button type="button" className="hover:cursor-pointer">
              <Image
                src="/elements/group_15205.svg"
                width={eyeIconSize}
                height={eyeIconSize}
                alt="eye icon"
              />
            </button>
          </div>
          <div className="">226283 USDT</div>
          <div className="">
            <div className="">Avbl: 100000 / Locked: 126283</div>
            <div className=""></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSection;

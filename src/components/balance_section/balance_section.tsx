import React, {useState} from 'react';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';
import Image from 'next/image';

const BalanceSection = () => {
  // TODO: userBalance from userContext
  // TODO: fixed to two decimal places
  const totalBalance = Number((200.8489).toFixed(2));
  const avblBalance = Number((80.5233).toFixed(2));
  const lockedBalance = Number((120.3256).toFixed(2));

  const [hidden, setHidden] = useState(false);

  const circleSize = '380';
  const eyeIconSize = 30;

  const hiddenClickHandler = () => {
    setHidden(!hidden);
  };

  const displayedIcon = hidden ? (
    <Image
      src="/elements/group_152051.svg"
      width={eyeIconSize}
      height={eyeIconSize}
      alt="eye close icon"
    />
  ) : (
    <Image
      src="/elements/group_15205.svg"
      width={eyeIconSize}
      height={eyeIconSize}
      alt="eye open icon"
    />
  );

  const displayedBalance = hidden ? '********' : totalBalance;

  const displayedAvblBalance = hidden ? '*****' : avblBalance;

  const displayedLockedBalance = hidden ? '*****' : lockedBalance;

  return (
    <div className="">
      <div className="">
        <div className="balanceImgContainer">
          <CircularProgressBar
            progressBarColor={['#29C1E1']}
            numerator={avblBalance}
            denominator={totalBalance}
            hollowSize="85%"
            circularBarSize={circleSize}
          />
        </div>

        <div className="balanceTextCentered space-y-6 dark:bg-black">
          <div className="flex items-center justify-center space-x-2 text-center">
            <p className="text-base text-lightGray">Total Balance</p>{' '}
            <button onClick={hiddenClickHandler} type="button" className="hover:cursor-pointer">
              {displayedIcon}
            </button>
          </div>

          <div className="flex justify-center text-3xl font-extrabold">
            {displayedBalance}&nbsp;&nbsp;USDT
          </div>

          <div className="">
            <div className="text-xs text-lightGray">
              Avbl: <span className="text-base text-lightWhite">{displayedAvblBalance}</span> /
              Locked: <span className="text-base text-lightWhite">{displayedLockedBalance}</span>
            </div>
            <div className=""></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSection;

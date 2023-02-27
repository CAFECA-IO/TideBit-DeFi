import React, {useContext, useState} from 'react';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';
import Image from 'next/image';
import TideButton from '../tide_button/tide_button';
import {useGlobal} from '../../contexts/global_context';
import {UserContext} from '../../contexts/user_context';
import RippleButton from '../ripple_button/ripple_button';

const BalanceSection = () => {
  const globalCtx = useGlobal();
  const userCtx = useContext(UserContext);
  const {layoutAssertion} = globalCtx;

  // TODO: userBalance from userContext
  // TODO: fixed to two decimal places
  const totalBalance = Number((200.8489).toFixed(2));
  const avblBalance = Number((80.5233).toFixed(2));
  const lockedBalance = Number((120.3256).toFixed(2));

  const [hidden, setHidden] = useState(false);

  const circleSize = '380';
  const eyeIconSize = 30;
  const depositBtnStyle =
    'mt-4 rounded border-0 bg-tidebitTheme py-2 px-30px lg:px-40px text-base text-white transition-all duration-300 hover:bg-cyan-600 md:mt-0';
  const withdrawBtnStyle =
    'mt-4 rounded border-0 bg-tidebitTheme py-2 px-25px lg:px-33px text-base text-white transition-all duration-300 hover:bg-cyan-600 md:mt-0';

  const depositBtn = (
    <p className="flex items-center space-x-3 text-center">
      Deposit
      <span className="ml-3">
        <Image src="/elements/group_149621.svg" width={15} height={15} alt="deposit icon" />
      </span>
    </p>
  );

  const withdrawBtn = (
    <p className="flex items-center space-x-3 text-center">
      Withdraw
      <span className="ml-3">
        <Image src="/elements/group_14962.svg" width={15} height={15} alt="withdraw icon" />
      </span>
    </p>
  );

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

  const depositClickHandler = () => {
    globalCtx.visibleDepositModalHandler();
  };

  const withdrawClickHandler = () => {
    globalCtx.visibleWithdrawalModalHandler();
  };

  return (
    <div className="">
      <div className="">
        {/* balanceImgContainer */}
        <div className="relative text-center">
          <CircularProgressBar
            progressBarColor={['#29C1E1']}
            numerator={avblBalance}
            denominator={totalBalance}
            hollowSize="85%"
            circularBarSize={circleSize}
          />
        </div>

        {/* balanceTextCentered */}
        {/*  xl:top-[28%] */}
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-3/5 space-y-6 dark:bg-black">
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
          </div>
        </div>

        <div className="flex justify-center space-x-5">
          <RippleButton
            className={`${depositBtnStyle}`}
            onClick={depositClickHandler}
            buttonType="button"
          >
            {depositBtn}
          </RippleButton>

          <RippleButton
            className={`${withdrawBtnStyle}`}
            onClick={withdrawClickHandler}
            buttonType="button"
          >
            {withdrawBtn}
          </RippleButton>
        </div>
      </div>
    </div>
  );
};

export default BalanceSection;

import React, {useContext, useState} from 'react';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';
import Image from 'next/image';
import TideButton from '../tide_button/tide_button';
import {useGlobal} from '../../contexts/global_context';
import {UserContext} from '../../contexts/user_context';
import RippleButton from '../ripple_button/ripple_button';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {unitAsset} from '../../constants/config';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;

const BalanceSection = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const globalCtx = useGlobal();
  const userCtx = useContext(UserContext);
  const {layoutAssertion} = globalCtx;

  // TODO: totalBalance from userContext
  // TODO: fixed to two decimal places
  const avblBalance = userCtx.balance?.available ?? 0;
  const lockedBalance = userCtx.balance?.locked ?? 0;
  const totalBalance = avblBalance && lockedBalance ? avblBalance + lockedBalance : 0;

  const [hidden, setHidden] = useState(false);

  const circleSize = '380';
  const eyeIconSize = 30;
  const btnStyle =
    'mt-4 w-160px rounded border-0 bg-tidebitTheme py-2 text-base text-white transition-all duration-300 hover:bg-cyan-600 md:mt-0';

  const depositBtn = (
    <p className="flex w-full items-center justify-center space-x-3 text-center">
      {t('MY_ASSETS_PAGE.BALANCE_SECTION_DEPOSIT')}
      <span className="ml-3">
        <Image src="/elements/group_149621.svg" width={15} height={15} alt="deposit icon" />
      </span>
    </p>
  );

  const withdrawBtn = (
    <p className="flex w-full items-center justify-center space-x-3 text-center">
      {t('MY_ASSETS_PAGE.BALANCE_SECTION_WITHDRAW')}
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

  const displayedBalance = hidden
    ? '********'
    : totalBalance?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE);

  const displayedAvblBalance = hidden
    ? '*****'
    : avblBalance?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE);

  const displayedLockedBalance = hidden
    ? '*****'
    : lockedBalance?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE);

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
        <div className="relative pt-20 text-center">
          <CircularProgressBar
            // showLabel={false}
            progressBarColor={['#29C1E1']}
            numerator={avblBalance}
            denominator={totalBalance}
            hollowSize="85%"
            circularBarSize={circleSize}
          />
        </div>

        {/* balanceTextCentered */}
        {/*  xl:top-[28%] */}
        <div className="absolute left-1/2 top-300px -translate-x-1/2 -translate-y-3/5 space-y-6 dark:bg-transparent">
          <div className="flex items-center justify-center space-x-2 text-center">
            <p className="text-base text-lightGray">
              {t('MY_ASSETS_PAGE.BALANCE_SECTION_TOTAL_BALANCE')}
            </p>{' '}
            <button onClick={hiddenClickHandler} type="button" className="hover:cursor-pointer">
              {displayedIcon}
            </button>
          </div>

          <div className="flex justify-center text-3xl font-extrabold">
            {displayedBalance}&nbsp;&nbsp;{unitAsset}
          </div>

          <div className="">
            <div className="text-xs text-lightGray">
              {t('MY_ASSETS_PAGE.BALANCE_SECTION_AVAILABLE')}:{' '}
              <span className="text-base text-lightWhite">{displayedAvblBalance}</span> /
              {t('MY_ASSETS_PAGE.BALANCE_SECTION_LOCKED')}:{' '}
              <span className="text-base text-lightWhite">{displayedLockedBalance}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-5">
          <RippleButton className={`${btnStyle}`} onClick={depositClickHandler} buttonType="button">
            {depositBtn}
          </RippleButton>

          <RippleButton
            className={`${btnStyle}`}
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

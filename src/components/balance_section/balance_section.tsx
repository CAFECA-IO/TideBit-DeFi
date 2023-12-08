import React, {useContext} from 'react';
import CircularProgressBar from '../circular_progress_bar/circular_progress_bar';
import Image from 'next/image';
import {useGlobal} from '../../contexts/global_context';
import {UserContext} from '../../contexts/user_context';
import RippleButton from '../ripple_button/ripple_button';
import {DEFAULT_BALANCE} from '../../constants/display';
import {unitAsset} from '../../constants/config';
import {useTranslation} from 'next-i18next';
import SafeMath from '../../lib/safe_math';
import {numberFormatted} from '../../lib/common';

type TranslateFunction = (s: string) => string;

const BalanceSection = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const globalCtx = useGlobal();
  const userCtx = useContext(UserContext);
  const {userAssets, isBalanceShow, showBalance} = userCtx;

  /* ToDo: (20230420 - Julian) getUserAssets by currency */
  const availableBalance = userAssets?.balance.available ?? DEFAULT_BALANCE.available;
  const lockedBalance = userAssets?.balance.locked ?? DEFAULT_BALANCE.locked;
  const totalBalance = SafeMath.plus(availableBalance, lockedBalance);

  const circleSize = '380';
  const eyeIconSize = 30;
  const btnStyle =
    'w-160px rounded py-2 text-base text-white transition-all duration-300 enabled:bg-tidebitTheme enabled:hover:bg-cyan-600 disabled:bg-lightGray';

  const displayedIcon = isBalanceShow ? (
    <Image
      src="/elements/group_15205.svg"
      width={eyeIconSize}
      height={eyeIconSize}
      alt="eye open icon"
    />
  ) : (
    <Image
      src="/elements/group_152051.svg"
      width={eyeIconSize}
      height={eyeIconSize}
      alt="eye close icon"
    />
  );

  const displayedBalance = isBalanceShow ? numberFormatted(totalBalance) : '********';
  const displayedAvalibleBalance = isBalanceShow ? numberFormatted(availableBalance) : '*****';
  const displayedLockedBalance = isBalanceShow ? numberFormatted(lockedBalance) : '*****';

  const depositClickHandler = () => globalCtx.visibleDepositModalHandler();
  const withdrawClickHandler = () => globalCtx.visibleWithdrawalModalHandler();

  const depositBtn = (
    <RippleButton
      id="MyAssetsDeposit"
      className={`${btnStyle}`}
      onClick={depositClickHandler}
      buttonType="button"
    >
      <p className="flex w-full items-center justify-center space-x-3 text-center">
        {t('MY_ASSETS_PAGE.BALANCE_SECTION_DEPOSIT')}
        <span className="ml-3">
          <Image src="/elements/group_149621.svg" width={15} height={15} alt="deposit icon" />
        </span>
      </p>
    </RippleButton>
  );

  const withdrawBtn = (
    /* Info: (20230530 - Julian) disabled withdraw */
    <RippleButton
      id="MyAssetsWithdraw"
      className={`${btnStyle}`}
      onClick={withdrawClickHandler}
      buttonType="button"
      disabled
    >
      <p className="flex w-full items-center justify-center space-x-3 text-center">
        {t('MY_ASSETS_PAGE.BALANCE_SECTION_WITHDRAW')}
        <span className="ml-3">
          <Image src="/elements/group_14962.svg" width={15} height={15} alt="withdraw icon" />
        </span>
      </p>
    </RippleButton>
  );

  return (
    <>
      {/* Info: (20230530 - Julian) balance Circle Container */}
      <div className="relative pt-20 text-center">
        <CircularProgressBar
          progressBarColor={['#29C1E1']}
          numerator={availableBalance}
          denominator={totalBalance}
          hollowSize="85%"
          circularBarSize={circleSize}
        />
      </div>

      {/* Info: (20230530 - Julian) balance Text Centered */}
      <div className="absolute left-1/2 top-300px -translate-x-1/2 -translate-y-3/5 space-y-6 dark:bg-transparent">
        <div className="flex items-center justify-center space-x-2 text-center">
          <p className="text-base text-lightGray">
            {t('MY_ASSETS_PAGE.BALANCE_SECTION_TOTAL_BALANCE')}
          </p>
          <div className="h-30px w-32px flex items-center justify-center">
            <button
              id="ShowBalanceButton"
              onClick={showBalance}
              type="button"
              className="hover:cursor-pointer"
            >
              {displayedIcon}
            </button>
          </div>
        </div>

        <div className="flex justify-center text-3xl font-extrabold">
          {displayedBalance}&nbsp;&nbsp;{unitAsset}
        </div>

        <div className="text-xs text-lightGray">
          {t('MY_ASSETS_PAGE.BALANCE_SECTION_AVAILABLE')}{' '}
          <span className="text-base text-lightWhite">{displayedAvalibleBalance}</span> /
          {t('MY_ASSETS_PAGE.BALANCE_SECTION_LOCKED')}{' '}
          <span className="text-base text-lightWhite">{displayedLockedBalance}</span>
        </div>
      </div>

      <div className="flex justify-center space-x-5">
        {depositBtn}
        {withdrawBtn}
      </div>
    </>
  );
};

export default BalanceSection;

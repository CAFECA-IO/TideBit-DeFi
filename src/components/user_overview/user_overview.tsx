import React, {useContext} from 'react';
import Image from 'next/image';
import {UserContext} from '../../contexts/user_context';
import {useTranslation} from 'next-i18next';
import {unitAsset} from '../../constants/config';
import {numberFormatted} from '../../lib/common';

type TranslateFunction = (s: string) => string;

interface IUserOverviewProps {
  depositAvailable: number;
  marginLocked: number;
  profitOrLossAmount: number;
}

const UserOverview = ({depositAvailable, marginLocked, profitOrLossAmount}: IUserOverviewProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const {isBalanceShow, showBalance} = useContext(UserContext);

  const deposit = isBalanceShow ? numberFormatted(depositAvailable) : '*****';
  const locked = isBalanceShow ? numberFormatted(marginLocked) : '*****';
  const pnl = isBalanceShow ? numberFormatted(profitOrLossAmount, false, true) : '*****';

  const displayedIcon = isBalanceShow ? (
    <Image src="/elements/group_15205.svg" width={30} height={30} alt="eye open icon" />
  ) : (
    <Image src="/elements/group_152051.svg" width={30} height={30} alt="eye close icon" />
  );

  return (
    <div className="flex flex-col lg:flex-row items-center lg:flex-1 gap-y-3 gap-x-6 w-full">
      <div className="h-30px">
        <button id="TotalBalanceShowButton" onClick={showBalance} type="button">
          {displayedIcon}
        </button>
      </div>
      <div className="flex justify-between w-full space-x-1 flex-1">
        <div className="flex flex-col items-center lg:items-start w-1/3">
          <h3 className="whitespace-nowrap text-sm text-lightGray4">
            {t('USER.OVERVIEW_AVAILABLE')}
          </h3>
          <p className="whitespace-nowrap text-sm lg:text-base">
            {deposit}
            <span className="text-xs"> {unitAsset}</span>
          </p>
        </div>

        <div className="flex flex-col items-center lg:items-start w-1/3">
          <h3 className="whitespace-nowrap text-sm text-lightGray4">
            {t('USER.OVERVIEW_M_MARGIN')}
          </h3>
          <p className="whitespace-nowrap text-sm lg:text-base">
            {locked} <span className="text-xs"> {unitAsset}</span>
          </p>
        </div>

        <div className="flex flex-col items-center lg:items-start w-1/3">
          <h3 className="whitespace-nowrap text-sm text-lightGray4">{t('USER.OVERVIEW_PNL')}</h3>
          <p className="whitespace-nowrap text-sm lg:text-base">
            {pnl}
            <span className="text-xs"> {unitAsset}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;

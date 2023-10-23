import React from 'react';
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
  const deposit = numberFormatted(depositAvailable);
  const locked = numberFormatted(marginLocked);
  const pnl = numberFormatted(profitOrLossAmount, false, true);

  return (
    <div className="flex justify-between space-x-1 w-full">
      <div className="flex flex-col items-center lg:items-start">
        <div className="whitespace-nowrap text-sm text-lightGray4">
          {t('USER.OVERVIEW_AVAILABLE')}
        </div>
        <div className="whitespace-nowrap text-sm lg:text-base">
          {deposit}
          <span className="text-xs"> {unitAsset}</span>
        </div>
      </div>

      <div className="flex flex-col items-center lg:items-start">
        <div className="whitespace-nowrap text-sm text-lightGray4">
          {t('USER.OVERVIEW_M_MARGIN')}
        </div>
        <div className="whitespace-nowrap text-sm lg:text-base">
          {locked} <span className="text-xs"> {unitAsset}</span>
        </div>
      </div>

      <div className="flex flex-col items-center lg:items-start">
        <div className="whitespace-nowrap text-sm text-lightGray4">{t('USER.OVERVIEW_PNL')}</div>
        <div className="whitespace-nowrap text-sm lg:text-base">
          {pnl}
          <span className="text-xs"> {unitAsset}</span>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;

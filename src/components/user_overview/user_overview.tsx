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
  const pnlSymbpl = profitOrLossAmount < 0 ? '-' : '';
  const pnl = numberFormatted(profitOrLossAmount);

  return (
    <>
      <div className="flex space-x-5 lg:space-x-20">
        <div className="flex flex-col items-center lg:items-start">
          <div className="whitespace-nowrap text-sm text-lightGray4">
            {t('USER.OVERVIEW_AVAILABLE')}
          </div>
          <div className="whitespace-nowrap text-sm lg:text-base">
            {deposit} {unitAsset}
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-start">
          <div className="whitespace-nowrap text-sm text-lightGray4">
            {t('USER.OVERVIEW_M_MARGIN')}
          </div>
          <div className="whitespace-nowrap text-sm lg:text-base">
            {locked} {unitAsset}
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-start">
          <div className="whitespace-nowrap text-sm text-lightGray4">{t('USER.OVERVIEW_PNL')}</div>
          <div className="whitespace-nowrap text-sm lg:text-base">
            <span className="mr-1 whitespace-nowrap">
              {pnlSymbpl} {pnl}
            </span>
            {unitAsset}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserOverview;

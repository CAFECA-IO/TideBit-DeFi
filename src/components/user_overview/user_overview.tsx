import React from 'react';
import {useTranslation} from 'next-i18next';
import {unitAsset} from '../../constants/config';

type TranslateFunction = (s: string) => string;

interface IUserOverviewProps {
  depositAvailable: number;
  marginLocked: number;
  // profitOrLoss: string;
  profitOrLossAmount: number;
}

const UserOverview = ({
  depositAvailable,
  marginLocked,
  // profitOrLoss,
  profitOrLossAmount,
}: IUserOverviewProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  // if (profitOrLoss !== 'profit' && profitOrLoss !== 'loss') return <></>;

  // const displayedSymbol = profitOrLoss === 'profit' ? '+' : '-';

  return (
    <>
      {/* ----------Desktop version---------- */}
      <div className="">
        <div className="hidden space-x-5 lg:flex xl:space-x-20">
          <div className="">
            <div className="text-sm text-lightGray4">{t('USER.OVERVIEW_AVAILABLE')}</div>
            <div className="text-sm xl:text-base">
              {depositAvailable} {unitAsset}
            </div>
          </div>

          <div className="">
            <div className="text-sm text-lightGray4">{t('USER.OVERVIEW_M_MARGIN')}</div>
            <div className="text-sm xl:text-base">
              {marginLocked} {unitAsset}
            </div>
          </div>

          <div className="">
            <div className="text-sm text-lightGray4">{t('USER.OVERVIEW_PNL')}</div>
            <div className="text-sm xl:text-base">
              {profitOrLossAmount} {unitAsset}
            </div>
          </div>
        </div>
      </div>

      {/* ----------Mobile version---------- */}

      <div className="mt-5">
        <div className="flex justify-center space-x-10 text-center lg:hidden">
          <div className="">
            <div className="whitespace-nowrap p-1 text-sm text-lightGray4">
              {t('USER.OVERVIEW_AVAILABLE')}
            </div>
            <div className="whitespace-nowrap p-1 text-xs">
              {depositAvailable} {unitAsset}
            </div>
          </div>

          <div className="">
            <div className="whitespace-nowrap p-1 text-sm text-lightGray4">
              {t('USER.OVERVIEW_M_MARGIN')}
            </div>
            <div className="whitespace-nowrap p-1 text-xs">
              {marginLocked} {unitAsset}
            </div>
          </div>

          <div className="">
            <div className="whitespace-nowrap p-1 text-sm text-lightGray4">
              {t('USER.OVERVIEW_PNL')}
            </div>
            <div className="whitespace-nowrap p-1 text-xs">
              {profitOrLossAmount} {unitAsset}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserOverview;

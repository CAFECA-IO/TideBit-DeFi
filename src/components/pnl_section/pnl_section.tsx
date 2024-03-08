import React, {useContext} from 'react';
import {useTranslation} from 'next-i18next';
import {UserContext} from '../../contexts/user_context';
import {ratioToPercentage, numberFormatted} from '../../lib/common';
import {DEFAULT_PNL_DATA, TypeOfPnLColor} from '../../constants/display';
import {ProfitState} from '../../constants/profit_state';
import {unitAsset} from '../../constants/config';

type TranslateFunction = (s: string) => string;

const PnlSection = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);
  const {userAssets} = userCtx;

  const pnlToday = userAssets?.pnl.today ?? DEFAULT_PNL_DATA;
  const pnl30Days = userAssets?.pnl.monthly ?? DEFAULT_PNL_DATA;
  const cumulativePnl = userAssets?.pnl.cumulative ?? DEFAULT_PNL_DATA;

  const statisticContent = [
    {title: t('MY_ASSETS_PAGE.PNL_SECTION_TODAY'), ...pnlToday},
    {title: t('MY_ASSETS_PAGE.PNL_SECTION_30_DAYS'), ...pnl30Days},
    {title: t('MY_ASSETS_PAGE.PNL_SECTION_CUMULATIVE'), ...cumulativePnl},
  ].map(({amount, percentage, ...rest}) => {
    const amountValue = numberFormatted(amount.value);
    const percent = ratioToPercentage(percentage.value);

    const result = {
      content:
        amount.type === ProfitState.PROFIT
          ? `+${amountValue} ${unitAsset}`
          : amount.type === ProfitState.LOSS
          ? `-${amountValue} ${unitAsset}`
          : amount.type === ProfitState.EQUAL
          ? `${amountValue} ${unitAsset}`
          : '-',
      remarks:
        /* Info: (20230602 - Julian) 調整 format (e.g. 0.012 -> 1.2%)  */
        percentage.type === ProfitState.PROFIT
          ? `▴ ${percent} %`
          : // ? `▴ ${numberFormatted(SafeMath.mult(percentage.value, 100))} %`
          percentage.type === ProfitState.LOSS
          ? `▾ ${percent} %`
          : percentage.type === ProfitState.EQUAL
          ? `${percent} %`
          : '-',
      textColor:
        percentage.type === ProfitState.PROFIT && amount.type === ProfitState.PROFIT
          ? TypeOfPnLColor.PROFIT
          : percentage.type === ProfitState.LOSS && amount.type === ProfitState.LOSS
          ? TypeOfPnLColor.LOSS
          : TypeOfPnLColor.EQUAL,
      ...rest,
    };

    return result;
  });

  const statisticContentList = statisticContent.map(({title, content, remarks, textColor}) => (
    <div
      key={title}
      className="mb-6 flex w-screen justify-center border-b border-lightGray/50 p-4 lg:mb-0 lg:w-1/3 lg:border-b-0"
    >
      <div className="h-full space-y-3 text-center lg:text-start">
        <h1 className={`text-lg leading-relaxed xl:text-xl`}>{title}</h1>
        <h2 className={`text-2xl font-medium lg:text-3xl xl:text-4xl ${textColor}`}>{content}</h2>
        <p className={`text-lg leading-relaxed lg:text-lg xl:text-xl ${textColor}`}>{remarks}</p>
      </div>
    </div>
  ));

  return (
    <section className="my-10 lg:mx-20 bg-black text-lightGray lg:border-t lg:border-b border-lightGray/50 flex flex-wrap py-4 lg:divide-x divide-lightGray/50">
      {statisticContentList}
    </section>
  );
};

export default PnlSection;

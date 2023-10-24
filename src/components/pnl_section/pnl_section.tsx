import React, {useContext} from 'react';
import {useTranslation} from 'next-i18next';
import {UserContext} from '../../contexts/user_context';
import {ratioToPercentage, numberFormatted, roundToDecimalPlaces} from '../../lib/common';
import {DEFAULT_PNL_DATA, TypeOfPnLColor} from '../../constants/display';
import {ProfitState} from '../../constants/profit_state';
import {unitAsset} from '../../constants/config';
import SafeMath from '../../lib/safe_math';
import {RoundCondition} from '../../interfaces/tidebit_defi_background/round_condition';

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
      style={{marginTop: '10px'}}
      className="mx-0 mb-6 flex w-screen justify-center border-b border-lightGray/50 p-4 lg:mx-0 lg:mb-0 lg:w-1/3 lg:border-b-0 lg:border-r"
    >
      <div className="h-full space-y-3 text-center lg:text-start">
        <h1 className={`text-lg leading-relaxed xl:text-xl`}>{title}</h1>
        <h2 className={`text-2xl font-medium lg:text-3xl xl:text-4xl ${textColor}`}>{content}</h2>
        <p className={`text-lg leading-relaxed lg:text-lg xl:text-xl ${textColor}`}>{remarks}</p>
      </div>
    </div>
  ));

  return (
    <section className={`mt-10 bg-black text-lightGray lg:mt-0`}>
      <div className="mx-20 mt-10 hidden border-t border-lightGray/50 lg:flex"></div>
      <div className="mx-auto">
        <div className="flex flex-wrap">{statisticContentList}</div>
      </div>
      <div className="mx-20 mt-5 hidden border-b border-lightGray/50 lg:flex"></div>
    </section>
  );
};

export default PnlSection;

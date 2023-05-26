import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {UserContext} from '../../contexts/user_context';
import {numberFormatted} from '../../lib/common';
import {DEFAULT_PNL_DATA, TypeOfPnLColor} from '../../constants/display';
import {ProfitState} from '../../constants/profit_state';
import {unitAsset} from '../../constants/config';

type TranslateFunction = (s: string) => string;

const PnlSection = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);
  const {userAssets} = userCtx;
  /* ToDo: (20230420 - Julian) getUserAssets by currency */
  const pnlToday = userAssets?.pnl.today ?? DEFAULT_PNL_DATA;
  const pnl30Days = userAssets?.pnl.monthly ?? DEFAULT_PNL_DATA;
  const cumulativePnl = userAssets?.pnl.cumulative ?? DEFAULT_PNL_DATA;

  const statisticContent = [
    {title: t('MY_ASSETS_PAGE.PNL_SECTION_TODAY'), ...pnlToday},
    {title: t('MY_ASSETS_PAGE.PNL_SECTION_30_DAYS'), ...pnl30Days},
    {title: t('MY_ASSETS_PAGE.PNL_SECTION_CUMULATIVE'), ...cumulativePnl},
  ].map(({amount, percentage, ...rest}) => {
    const result = {
      content:
        amount.type === ProfitState.PROFIT
          ? `+${numberFormatted(amount.value)} ${unitAsset}`
          : amount.type === ProfitState.LOSS
          ? `-${numberFormatted(amount.value)} ${unitAsset}`
          : '-',
      remarks:
        percentage.type === ProfitState.PROFIT
          ? `▴ ${numberFormatted(percentage.value)} %`
          : percentage.type === ProfitState.LOSS
          ? `▾ ${numberFormatted(percentage.value)} %`
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

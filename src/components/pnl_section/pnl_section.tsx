import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {UserContext} from '../../contexts/user_context';
import {TypeOfPnLColor} from '../../constants/display';
import {unitAsset} from '../../constants/config';
import {numberFormatted} from '../../lib/common';

type TranslateFunction = (s: string) => string;

const PnlSection = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);

  const defaultPnlData = {amount: 0, percentage: 0};
  /* ToDo: (20230420 - Julian) getUserAssets by currency */
  const pnlToday = userCtx.getUserAssets('')?.pnl.today ?? defaultPnlData;
  const pnl30Days = userCtx.getUserAssets('')?.pnl.monthly ?? defaultPnlData;
  const cumulativePnl = userCtx.getUserAssets('')?.pnl.cumulative ?? defaultPnlData;

  const statisticContent = [
    {title: t('MY_ASSETS_PAGE.PNL_SECTION_TODAY'), ...pnlToday},
    {title: t('MY_ASSETS_PAGE.PNL_SECTION_30_DAYS'), ...pnl30Days},
    {title: t('MY_ASSETS_PAGE.PNL_SECTION_CUMULATIVE'), ...cumulativePnl},
  ].map(({amount, percentage, ...rest}) => {
    const result = {
      content:
        amount > 0
          ? `+${numberFormatted(amount)} ${unitAsset}`
          : `-${numberFormatted(amount)} ${unitAsset}`,
      remarks:
        percentage > 0
          ? `▴ ${numberFormatted(percentage)} %`
          : `▾ ${numberFormatted(percentage)} %`,
      textColor:
        percentage > 0 && amount > 0
          ? TypeOfPnLColor.PROFIT
          : percentage < 0 && amount < 0
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

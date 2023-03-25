import React from 'react';
import {TypeOfPnLColor, UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {unitAsset} from '../../constants/config';

const PnlSection = () => {
  // TODO: pnl from userContext
  // TODO: i18n
  const pnlToday = {amount: -128.29, percentage: -1.5};
  const pnl30Days = {amount: 98124532.83, percentage: 10.36};
  const cumulativePnl = {amount: -57692.47, percentage: -22.75};

  // const displayedTextColor =

  const statisticContent = [
    {title: 'PNL in today', ...pnlToday},
    {title: 'PNL in 30 days', ...pnl30Days},
    {title: 'Cumulative PNL', ...cumulativePnl},
  ].map(({amount, percentage, ...rest}) => {
    const percentageAbs = Math.abs(percentage);
    const result = {
      content:
        amount > 0
          ? `+ ${amount.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)} ${unitAsset}`
          : `${amount.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)} ${unitAsset}`,
      remarks:
        percentage > 0 ? `▴ ${percentageAbs.toString()} %` : `▾ ${percentageAbs.toString()} %`,
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

  const statisticContentList = statisticContent.map(
    ({title, content, remarks, textColor}, index) => (
      <div
        key={title}
        style={{height: '', marginTop: '10px'}}
        className="mx-0 mb-6 flex w-screen justify-center border-b border-lightGray/50 p-4 lg:mx-0 lg:mb-0 lg:w-1/3 lg:border-b-0 lg:border-r"
      >
        <div className="h-full space-y-3 text-center lg:text-start">
          <h1 className={`text-lg leading-relaxed xl:text-xl`}>{title}</h1>
          <h2 className={`text-2xl font-medium lg:text-3xl xl:text-4xl ${textColor}`}>{content}</h2>
          <p className={`text-lg leading-relaxed lg:text-lg xl:text-xl ${textColor}`}>{remarks}</p>
        </div>

        {/* How to position it to w-1/3 */}
        {/* {index !== statisticContent.length - 1 && (
          <div className="-mr-32 ml-10 border-r border-lightGray/50"></div>
        )} */}
        {/* <div className="border-r border-lightGray/50"></div> */}
      </div>
    )
  );

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

import React from 'react';
import {TypeOfPnLColor} from '../../constants/display';

const PnlSection = () => {
  // TODO: pnl from userContext
  const pnlToday = {amount: -128.29, percentage: -1.5};
  const pnl30Days = {amount: 61545218.83, percentage: 10.36};
  const cumulativePnl = {amount: 7692.47, percentage: 22.75};

  // const displayedTextColor =

  const statisticContent = [
    {title: 'PNL in today', ...pnlToday},
    {title: 'PNL in 30 days', ...pnl30Days},
    {title: 'Cumulative PNL', ...cumulativePnl},
  ].map(({amount, percentage, ...rest}) => ({
    content: amount > 0 ? `+ ${amount.toString()} USDT` : `${amount.toString()} USDT`,
    remarks: percentage > 0 ? `▴ + ${percentage.toString()} %` : `▾ ${percentage.toString()} %`,
    textColor:
      percentage > 0
        ? TypeOfPnLColor.PROFIT
        : percentage < 0
        ? TypeOfPnLColor.LOSS
        : TypeOfPnLColor.EQUAL,
    ...rest,
  }));

  const statisticContentList = statisticContent.map(
    ({title, content, remarks, textColor}, index) => (
      <div
        key={title}
        style={{height: '', marginTop: '10px'}}
        className="mx-20 mb-6 flex w-screen justify-center border-b border-lightGray/50 p-4 lg:mx-0 lg:mb-0 lg:w-1/3 lg:border-b-0 lg:border-r"
      >
        <div className="h-full space-y-3 text-center lg:text-start">
          <h1 className={`text-lg leading-relaxed xl:text-xl`}>{title}</h1>
          <h2 className={`text-3xl font-medium xl:text-4xl ${textColor}`}>{content}</h2>
          <p className={`text-lg leading-relaxed xl:text-xl ${textColor}`}>{remarks}</p>
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

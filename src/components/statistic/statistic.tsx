import React, {useContext} from 'react';
import {MarketContext} from '../../contexts/market_context';
import {useTranslation} from 'next-i18next';
import SafeMath from '../../lib/safe_math';
import {numberFormatted} from '../../lib/common';

type TranslateFunction = (s: string) => string;

const StatisticBlock = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const {tidebitPromotion} = useContext(MarketContext);

  const displayedVolume = SafeMath.isNumber(tidebitPromotion.volume)
    ? numberFormatted(tidebitPromotion.volume)
    : tidebitPromotion.volume;
  const displayedUsers = tidebitPromotion.users;
  const displayedVa = SafeMath.isNumber(tidebitPromotion.va)
    ? numberFormatted(tidebitPromotion.va)
    : tidebitPromotion.va;

  const statisticContent = [
    {
      heading: t('HOME_PAGE.STATISTIC_BLOCK_TITLE_1'),
      content: displayedVolume,
    },
    {
      heading: t('HOME_PAGE.STATISTIC_BLOCK_TITLE_2'),
      content: displayedUsers,
    },
    {
      heading: t('HOME_PAGE.STATISTIC_BLOCK_TITLE_3'),
      content: displayedVa,
    },
  ];

  const statisticContentList = statisticContent.map(({heading, content}) => (
    <div key={heading} className="mb-6 flex justify-center p-4 lg:mb-0 lg:w-1/3">
      <div className="h-full text-center lg:text-start">
        <p className="text-lg leading-relaxed xl:text-xl">{heading}</p>
        <h2 className="text-3xl font-medium text-white md:text-4xl xl:text-5xl">{content}</h2>
      </div>
    </div>
  ));

  return (
    <section
      className={`bg-black text-gray-400 flex mx-10 flex-col flex-wrap justify-center lg:flex-row lg:flex-wrap`}
    >
      {statisticContentList}
    </section>
  );
};

export default StatisticBlock;

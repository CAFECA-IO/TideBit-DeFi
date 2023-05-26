import React, {useContext} from 'react';
import {MarketContext} from '../../contexts/market_context';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {FRACTION_DIGITS} from '../../constants/config';
import {useTranslation} from 'next-i18next';
import SafeMath from '../../lib/safe_math';

type TranslateFunction = (s: string) => string;

const StatisticBlock = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const {tidebitPromotion} = useContext(MarketContext);

  const displayedVolume = SafeMath.isNumber(tidebitPromotion.volume)
    ? tidebitPromotion.volume.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)
    : tidebitPromotion.volume;
  const displayedUsers = tidebitPromotion.users;
  const displayedVa = SafeMath.isNumber(tidebitPromotion.va)
    ? tidebitPromotion.va.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS)
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
    <section className={`bg-black text-gray-400`}>
      <div className="mx-10">
        <div className="flex flex-wrap justify-center">{statisticContentList}</div>
      </div>
    </section>
  );
};

export default StatisticBlock;

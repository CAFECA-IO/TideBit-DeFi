import React from 'react';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;

const StatisticBlock = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  // const statisticContent = [
  //   {heading: '24h volumn on TideBit', content: '365 Billion'},
  //   {heading: 'Users on TideBit', content: '30 Billion+'},
  //   {heading: 'Lowest Fee', content: '<0.10 %'},
  // ];
  const statisticContent = [
    {
      heading: t('HOME_PAGE.STATISTIC_BLOCK_TITLE_1'),
      content: t('HOME_PAGE.STATISTIC_BLOCK_DESCRIPTION_1'),
    },
    {
      heading: t('HOME_PAGE.STATISTIC_BLOCK_TITLE_2'),
      content: t('HOME_PAGE.STATISTIC_BLOCK_DESCRIPTION_2'),
    },
    {
      heading: t('HOME_PAGE.STATISTIC_BLOCK_TITLE_3'),
      content: t('HOME_PAGE.STATISTIC_BLOCK_DESCRIPTION_3'),
    },
  ];

  const statisticContentList = statisticContent.map(({heading, content}) => (
    <div key={heading} className="mb-6 flex w-screen justify-center p-4 lg:mb-0 lg:w-1/3">
      <div className="h-full text-center lg:text-start">
        <p className="text-lg leading-relaxed xl:text-xl">{heading}</p>
        <h2 className="text-3xl font-medium text-white md:text-4xl xl:text-5xl">{content}</h2>
      </div>
    </div>
  ));

  return (
    <section className={`bg-black text-gray-400`}>
      <div className="mx-auto">
        <div className="flex flex-wrap">{statisticContentList}</div>
      </div>
    </section>
  );
};

export default StatisticBlock;

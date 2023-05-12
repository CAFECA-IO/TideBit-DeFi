import React, {useContext, useState, useEffect} from 'react';
import LeaderboardTab from '../leaderboard_tab/leaderboard_tab';
import Footer from '../footer/footer';
import {RankingInterval} from '../../constants/ranking_time_span';
import {MarketContext} from '../../contexts/market_context';
import {defaultLeaderboard} from '../../interfaces/tidebit_defi_background/leaderboard';
import {timestampToString} from '../../lib/common';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;

const BoardPageBody = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const marketCtx = useContext(MarketContext);

  const [timeSpan, setTimeSpan] = useState(RankingInterval.LIVE);
  const [subtitle, setSubtitle] = useState(<></>);

  const leaderboardData = marketCtx.getLeaderboard(timeSpan) ?? defaultLeaderboard;
  const {startTime, endTime, rankings} = leaderboardData;

  useEffect(() => {
    // ToDo: (20230512- Julian) i18n
    const result =
      timeSpan === RankingInterval.LIVE ? (
        <div className="inline-block text-base md:text-xl">
          This leaderboard will be closed in{' '}
          <span className="text-tidebitTheme">
            {timestampToString(endTime - Date.now() / 1000).time}
          </span>
        </div>
      ) : timeSpan === RankingInterval.DAILY ? (
        <div className="inline-block text-base md:text-xl">
          This leaderboard of{' '}
          <span className="text-tidebitTheme">{timestampToString(endTime).date}</span>
        </div>
      ) : timeSpan === RankingInterval.WEEKLY ? (
        <div className="inline-block text-base md:text-xl">
          This leaderboard from{' '}
          <span className="text-tidebitTheme">{timestampToString(startTime).date}</span> to{' '}
          <span className="text-tidebitTheme">{timestampToString(endTime).date}</span>
        </div>
      ) : timeSpan === RankingInterval.MONTHLY ? (
        <div className="inline-block text-base md:text-xl">
          This leaderboard of{' '}
          <span className="text-tidebitTheme">{timestampToString(endTime).monthAndYear}</span>
        </div>
      ) : (
        <></>
      );

    setSubtitle(result);
  }, [Date.now(), timeSpan]);

  return (
    <div className="pt-20">
      <div className="min-h-screen">
        <div className="mx-auto my-10 flex w-screen flex-col items-center space-y-4">
          <h1 className="text-3xl">{t('LEADERBOARD_PAGE.TITLE')}</h1>
          <h2 className="text-xl">{subtitle}</h2>
          <div className="pt-150px md:pt-300px">
            <LeaderboardTab timeSpan={timeSpan} setTimeSpan={setTimeSpan} rankings={rankings} />
          </div>
        </div>
      </div>

      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default BoardPageBody;

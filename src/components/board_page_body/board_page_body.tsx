import React, {useContext, useState, useEffect} from 'react';
import LeaderboardTab from '../leaderboard_tab/leaderboard_tab';
import Footer from '../footer/footer';
import {RankingInterval} from '../../constants/ranking_time_span';
import {MarketContext} from '../../contexts/market_context';
import {defaultLeaderboard} from '../../interfaces/tidebit_defi_background/leaderboard';
import {timestampToString} from '../../lib/common';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import {SKELETON_DISPLAY_TIME} from '../../constants/display';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;

const BoardPageBody = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const marketCtx = useContext(MarketContext);

  const [isLoading, setIsLoading] = useState(true);
  const [timeSpan, setTimeSpan] = useState(RankingInterval.LIVE);
  const [leaderboardLiveRemains, setLeaderboardLiveRemains] = useState(0);
  const [leaderboardData, setLeaderboardData] = useState(defaultLeaderboard);

  const {startTime, endTime, rankings} = leaderboardData;

  useEffect(() => {
    setTimeout(() => setIsLoading(false), SKELETON_DISPLAY_TIME);
  }, []);

  useEffect(() => {
    setLeaderboardData(marketCtx.getLeaderboard(timeSpan) ?? defaultLeaderboard);
  }, [timeSpan]);

  useEffect(() => {
    const countdownInterval = setTimeout(() => {
      const now = Math.floor(Date.now() / 1000);
      const remains = endTime - now;
      setLeaderboardLiveRemains(remains);
    }, 1000);

    return () => clearTimeout(countdownInterval);
  }, [leaderboardLiveRemains]);

  const subtitle =
    timeSpan === RankingInterval.LIVE ? (
      <div className="inline-block text-base md:text-xl">
        {t('LEADERBOARD_PAGE.SUBTITLE_LIVE')}{' '}
        <span className="text-tidebitTheme">{timestampToString(leaderboardLiveRemains).time} </span>
        {t('LEADERBOARD_PAGE.SUBTITLE_LIVE_2')}
      </div>
    ) : timeSpan === RankingInterval.DAILY ? (
      <div className="inline-block text-base md:text-xl">
        {t('LEADERBOARD_PAGE.SUBTITLE_DAILY')}{' '}
        <span className="text-tidebitTheme">{timestampToString(endTime).date}</span>
        {t('LEADERBOARD_PAGE.SUBTITLE_DAILY_2')}
      </div>
    ) : timeSpan === RankingInterval.WEEKLY ? (
      <div className="inline-block text-base md:text-xl">
        {t('LEADERBOARD_PAGE.SUBTITLE_WEEKLY')}{' '}
        <span className="text-tidebitTheme">{timestampToString(startTime).date}</span>{' '}
        {t('LEADERBOARD_PAGE.SUBTITLE_WEEKLY_2')}{' '}
        <span className="text-tidebitTheme">{timestampToString(endTime).date}</span>{' '}
        {t('LEADERBOARD_PAGE.SUBTITLE_WEEKLY_3')}
      </div>
    ) : timeSpan === RankingInterval.MONTHLY ? (
      <div className="inline-block text-base md:text-xl">
        {t('LEADERBOARD_PAGE.SUBTITLE_MONTHLY')}{' '}
        <span className="text-tidebitTheme">{timestampToString(endTime).monthAndYear}</span>
        {t('LEADERBOARD_PAGE.SUBTITLE_MONTHLY_2')}
      </div>
    ) : (
      <div className="inline-block text-base md:text-xl">Loading...</div>
    );

  const displayedTitle = isLoading ? (
    <Skeleton width={150} height={30} />
  ) : (
    <h1 className="text-3xl">{t('LEADERBOARD_PAGE.TITLE')}</h1>
  );

  const displayedSubtitle = isLoading ? <Skeleton width={300} height={25} /> : subtitle;

  return (
    <div className="pt-12 md:pt-20">
      <SkeletonTheme baseColor="#1E2329" highlightColor="#444">
        <div className="min-h-screen">
          <div className="mx-auto my-10 flex w-screen flex-col items-center space-y-4">
            {displayedTitle}
            {displayedSubtitle}
            <div className="pt-150px md:pt-250px">
              <LeaderboardTab timeSpan={timeSpan} setTimeSpan={setTimeSpan} rankings={rankings} />
            </div>
          </div>
        </div>
      </SkeletonTheme>
      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default BoardPageBody;

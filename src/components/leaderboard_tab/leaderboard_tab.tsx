import React, {useState} from 'react';
import Image from 'next/image';
import useWindowSize from '../../lib/hooks/use_window_size';
import UserPersonalRanking from '../user_personal_ranking/user_personal_ranking';
import {TypeOfPnLColor} from '../../constants/display';
import {unitAsset} from '../../constants/config';
import {numberFormatted} from '../../lib/common';
import {RankingInterval} from '../../constants/ranking_time_span';

const DEFAULT_PODIUM_WIDTH = 960;
const DEFAULT_PODIUM_HEIGHT = 300;
const DEFAULT_MEDALIST_SIZE = 200;

const LeaderboardTab = () => {
  const windowSize = useWindowSize();

  const podiumWidth =
    windowSize.width > DEFAULT_PODIUM_WIDTH ? windowSize.width : DEFAULT_PODIUM_WIDTH;
  const podiumHeight = (DEFAULT_PODIUM_HEIGHT / DEFAULT_PODIUM_WIDTH) * podiumWidth;
  const medalistSize =
    (podiumWidth - 500) / 3 < DEFAULT_MEDALIST_SIZE
      ? (podiumWidth - 500) / 3
      : DEFAULT_MEDALIST_SIZE;
  const crownSize = medalistSize >= DEFAULT_MEDALIST_SIZE ? medalistSize * 0.5 : medalistSize * 0.4;
  const starSize = medalistSize >= DEFAULT_MEDALIST_SIZE ? 50 : 20;

  const [timeSpan, setTimeSpan] = useState(RankingInterval.LIVE);

  const activeLiveTabStyle =
    timeSpan == RankingInterval.LIVE
      ? 'bg-darkGray7 text-lightWhite'
      : 'bg-darkGray6 text-lightGray';

  const activeDailyTabStyle =
    timeSpan == RankingInterval.DAILY
      ? 'bg-darkGray7 text-lightWhite'
      : 'bg-darkGray6 text-lightGray';

  const activeWeeklyTabStyle =
    timeSpan == RankingInterval.WEEKLY
      ? 'bg-darkGray7 text-lightWhite'
      : 'bg-darkGray6 text-lightGray';

  const activeMonthlyTabStyle =
    timeSpan == RankingInterval.MONTHLY
      ? 'bg-darkGray7 text-lightWhite'
      : 'bg-darkGray6 text-lightGray';

  const displayedPnl = (pnl: number) =>
    pnl > 0 ? (
      <div className={TypeOfPnLColor.PROFIT}>+ {numberFormatted(pnl)} %</div>
    ) : pnl < 0 ? (
      <div className={TypeOfPnLColor.LOSS}>- {numberFormatted(pnl)} %</div>
    ) : (
      <div className={TypeOfPnLColor.EQUAL}>{numberFormatted(pnl)} %</div>
    );

  // ToDo: (20230510 - Julian) get data from Context
  /* Info: (20230511 - Julian) Sorted as Sliver, Gold, Bronze */
  const top3Data = [
    {
      marginTop: 'mt-28 md:mt-24',
      crown: '/leaderboard/silver_crown@2x.png',
      star: '/leaderboard/silver_star.svg',
      medalist: '/leaderboard/silver_medalist.svg',
      userData: {
        name: 'Rose',
        avatar: '/leaderboard/dummy_avatar_1.svg',
        displayedPnl: displayedPnl(43.02),
      },
    },
    {
      marginTop: 'mt-20 md:mt-8',
      crown: '/leaderboard/gold_crown@2x.png',
      star: '/leaderboard/gold_star.svg',
      medalist: '/leaderboard/gold_medalist.svg',
      userData: {
        name: 'Bruce',
        avatar: '/leaderboard/dummy_avatar_2.svg',
        displayedPnl: displayedPnl(47.45),
      },
    },
    {
      marginTop: 'mt-32',
      crown: '/leaderboard/bronze_crown@2x.png',
      star: '/leaderboard/bronze_star.svg',
      medalist: '/leaderboard/bronze_medalist.svg',
      userData: {
        name: 'Simon',
        avatar: '/leaderboard/dummy_avatar_3.svg',
        displayedPnl: displayedPnl(23.42),
      },
    },
  ];

  /* Info: (20230511 - Julian) Time Span Data */
  const rankingTimeSpan = [
    {
      text: 'Live',
      style: activeLiveTabStyle,
      active: () => setTimeSpan(RankingInterval.LIVE),
    },
    {
      text: 'Daily',
      style: activeDailyTabStyle,
      active: () => setTimeSpan(RankingInterval.DAILY),
    },
    {
      text: 'Weekly',
      style: activeWeeklyTabStyle,
      active: () => setTimeSpan(RankingInterval.WEEKLY),
    },
    {
      text: 'Monthly',
      style: activeMonthlyTabStyle,
      active: () => setTimeSpan(RankingInterval.MONTHLY),
    },
  ];

  const top3List = top3Data.map(({marginTop, crown, star, medalist, userData}) => {
    return (
      <div className={marginTop}>
        <div className="relative flex flex-col">
          {/* Info: (20230511 - Julian) User Avatar */}
          <div className={`absolute inline-flex items-center justify-center p-2 md:p-3`}>
            <Image
              src={userData.avatar}
              width={medalistSize}
              height={medalistSize}
              alt="user_avatar"
            />
          </div>
          {/* Info: (20230511 - Julian) Crown & User Name */}
          <div className="absolute -bottom-10 flex w-full flex-col items-center md:-bottom-16 ">
            <Image src={crown} width={crownSize} height={crownSize} alt="crown_icon" />
            <div className="text-xs md:text-lg">{userData.name}</div>
          </div>

          <Image src={medalist} width={medalistSize} height={medalistSize} alt="medalist_icon" />
        </div>

        {/* Info: (20230511 - Julian) User Achievement */}
        <div className="mt-45px flex flex-col items-center space-y-1 md:mt-70px md:space-y-3">
          <Image src={star} width={starSize} height={starSize} alt="crown_icon" />
          <div className="inline-flex items-end text-xs md:text-xl">
            {userData.displayedPnl}
            <span className="ml-1 text-xs text-lightGray4 md:text-sm">{unitAsset}</span>
          </div>
        </div>
      </div>
    );
  });

  const displayedTop3 = (
    <div className="relative w-screen md:w-8/10">
      <div className="absolute -top-48 flex w-full justify-between space-x-4 px-4 md:-top-56 md:px-16">
        {top3List}
      </div>
      <Image
        src="/leaderboard/podium@2x.png"
        width={podiumWidth}
        height={podiumHeight}
        alt="podium_picture"
      />
    </div>
  );

  const tabList = rankingTimeSpan.map(({text, style, active}) => {
    return (
      <div className="w-full">
        <button
          type="button"
          className={`${style} inline-block w-full rounded-t-2xl px-20px py-2 text-xs hover:cursor-pointer md:text-base`}
          onClick={active}
        >
          {text}
        </button>
      </div>
    );
  });

  const dummyRankingItem = (
    <div className="flex w-full whitespace-nowrap px-4 py-6 md:px-8 md:py-4">
      <div className="flex flex-1 items-center space-x-2 md:space-x-3">
        <div className="inline-flex items-center sm:w-70px">
          <Image src="/leaderboard/crown.svg" width={25} height={25} alt="crown_icon" />

          <div className="ml-2 text-sm sm:text-lg">4</div>
        </div>
        {/* Info: (20230510 - Julian) User Avatar */}
        <div className="relative inline-flex h-36px w-36px items-center justify-center overflow-hidden rounded-full bg-tidebitTheme text-center md:h-60px md:w-60px">
          <span className="text-2xl font-bold text-lightWhite md:text-3xl">O</span>
        </div>
        {/* Info: (20230510 - Julian) User Name */}
        <div className="truncate text-sm sm:text-xl">Owen</div>
      </div>
      <div className="flex items-center space-x-3 text-base md:text-xl">
        <div className="inline-flex items-end">
          {displayedPnl(12.34)}
          <span className="ml-1 text-sm text-lightGray4">{unitAsset}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      {displayedTop3}
      {/* ToDo: (20230509 - Julian) Ranking List with tabs */}
      <div className="my-10 w-screen md:w-8/10">
        <div className="inline-flex w-full text-center font-medium md:space-x-3px">{tabList}</div>
        <div className="relative flex w-full flex-col bg-darkGray7 py-2">
          {dummyRankingItem}
          {dummyRankingItem}
          {dummyRankingItem}
          {dummyRankingItem}
          {dummyRankingItem}
          {dummyRankingItem}
          <UserPersonalRanking />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTab;

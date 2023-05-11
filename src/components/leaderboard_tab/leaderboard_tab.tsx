import React, {useState, useContext} from 'react';
import Image from 'next/image';
import useWindowSize from '../../lib/hooks/use_window_size';
import UserPersonalRanking from '../user_personal_ranking/user_personal_ranking';
import {MarketContext} from '../../contexts/market_context';
import {TypeOfPnLColor} from '../../constants/display';
import {unitAsset} from '../../constants/config';
import {numberFormatted} from '../../lib/common';
import {RankingInterval} from '../../constants/ranking_time_span';

const DEFAULT_PODIUM_WIDTH = 960;
const DEFAULT_PODIUM_HEIGHT = 300;
const DEFAULT_MEDALIST_SIZE = 200;

const LeaderboardTab = () => {
  const marketCtx = useContext(MarketContext);
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
  const leaderboardUserAvatarSize = windowSize.width >= 1024 ? 60 : 36;

  const [timeSpan, setTimeSpan] = useState(RankingInterval.LIVE);

  /* Info: (20230511 - Julian) Sorted by rank */
  const leaderboardData =
    marketCtx.getLeaderboard(timeSpan)?.sort((a, b) => {
      return a.rank - b.rank;
    }) ?? [];

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

  /* Info: (20230511 - Julian) Sorted as Sliver, Gold, Bronze */
  const top3Data = [
    {
      rank: 'SILVER',
      marginTop: 'mt-28 md:mt-24',
      crown: '/leaderboard/silver_crown@2x.png',
      star: '/leaderboard/silver_star.svg',
      medalist: '/leaderboard/silver_medalist.svg',
      userData: {
        name: leaderboardData[0].userName,
        avatar: leaderboardData[0].userAvatar ?? '/leaderboard/default_avatar.svg',
        displayedPnl: displayedPnl(leaderboardData[0].cumulativePnl),
      },
    },
    {
      rank: 'GOLD',
      marginTop: 'mt-20 md:mt-8',
      crown: '/leaderboard/gold_crown@2x.png',
      star: '/leaderboard/gold_star.svg',
      medalist: '/leaderboard/gold_medalist.svg',
      userData: {
        name: leaderboardData[1].userName,
        avatar: leaderboardData[1].userAvatar ?? '/leaderboard/default_avatar.svg',
        displayedPnl: displayedPnl(leaderboardData[1].cumulativePnl),
      },
    },
    {
      rank: 'BRONZE',
      marginTop: 'mt-32',
      crown: '/leaderboard/bronze_crown@2x.png',
      star: '/leaderboard/bronze_star.svg',
      medalist: '/leaderboard/bronze_medalist.svg',
      userData: {
        name: leaderboardData[2].userName,
        avatar: leaderboardData[2].userAvatar ?? '/leaderboard/default_avatar.svg',
        displayedPnl: displayedPnl(leaderboardData[2].cumulativePnl),
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

  const top3List = top3Data.map(({rank, marginTop, crown, star, medalist, userData}) => {
    const isDisplayedHalo = rank === 'GOLD' ? 'block' : 'hidden';
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
          <div className="absolute -bottom-10 flex w-full flex-col items-center md:-bottom-16">
            <Image src={crown} width={crownSize} height={crownSize} alt="crown_icon" />
            <div className="text-xs md:text-lg">{userData.name}</div>
          </div>

          <Image src={medalist} width={medalistSize} height={medalistSize} alt="medalist_icon" />

          {/* Info: (20230511 - Julian) Halo (Gold only) */}
          <div className={`absolute -z-10 scale-150 ${isDisplayedHalo}`}>
            <Image
              src="/leaderboard/halo.svg"
              width={medalistSize}
              height={medalistSize}
              alt="halo_icon"
            />
          </div>
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

  // Info: (20230511 - Julian) Leaderboard List (4th ~)
  const leaderboardList = leaderboardData
    .slice(3)
    .map(({rank, userName, userAvatar, cumulativePnl}) => (
      <div className="flex w-full whitespace-nowrap px-4 py-6 md:px-8 md:py-4">
        <div className="flex flex-1 items-center space-x-2 md:space-x-3">
          <div className="inline-flex items-center sm:w-70px">
            <Image src="/leaderboard/crown.svg" width={25} height={25} alt="crown_icon" />

            <div className="ml-2 text-sm sm:text-lg">{rank}</div>
          </div>
          {/* Info: (20230510 - Julian) User Avatar */}
          <Image
            src={userAvatar ?? '/leaderboard/default_avatar.svg'}
            width={leaderboardUserAvatarSize}
            height={leaderboardUserAvatarSize}
            alt="user_avatar"
          />
          {/* Info: (20230510 - Julian) User Name */}
          <div className="truncate text-sm sm:text-xl">{userName}</div>
        </div>
        <div className="flex items-center space-x-3 text-base md:text-xl">
          <div className="inline-flex items-end">
            {displayedPnl(cumulativePnl)}
            <span className="ml-1 text-sm text-lightGray4">{unitAsset}</span>
          </div>
        </div>
      </div>
    ));

  return (
    <div className="flex flex-col items-center">
      {displayedTop3}
      {/* Info: (20230509 - Julian) Leaderboard */}
      <div className="my-10 w-screen md:w-8/10">
        <div className="inline-flex w-full text-center font-medium md:space-x-3px">{tabList}</div>
        <div className="relative flex w-full flex-col bg-darkGray7 pt-2">
          {leaderboardList}
          <UserPersonalRanking timeSpan={timeSpan} />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTab;

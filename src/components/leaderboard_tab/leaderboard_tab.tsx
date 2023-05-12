import React, {useState, useContext} from 'react';
import Image from 'next/image';
import useWindowSize from '../../lib/hooks/use_window_size';
import UserPersonalRanking from '../user_personal_ranking/user_personal_ranking';
import {MarketContext} from '../../contexts/market_context';
import {TypeOfPnLColor, DEFAULT_USER_AVATAR} from '../../constants/display';
import {unitAsset} from '../../constants/config';
import {numberFormatted} from '../../lib/common';
import {RankingInterval} from '../../constants/ranking_time_span';
import {defaultLeaderboard} from '../../interfaces/tidebit_defi_background/leaderboard';

const MIN_SCREEN_WIDTH = 1024;
const DEFAULT_PODIUM_WIDTH = 960;
const DEFAULT_PODIUM_HEIGHT = 300;
const DEFAULT_MEDALIST_SIZE = 200;
const DEFAULT_CROWN_SIZE_DESKTOP = 0.5;
const DEFAULT_CROWN_SIZE_MOBILE = 0.4;
const DEFAULT_STAR_SIZE_DESKTOP = 50;
const DEFAULT_STAR_SIZE_MOBILE = 20;
const DEFAULT_AVATAR_SIZE_DESKTOP = 60;
const DEFAULT_AVATAR_SIZE_MOBILE = 36;
const GAP_BETWEEN_PODIUMAND_MEDALIST = 500;
const NUMBER_OF_MEDALIST = 3;

const LeaderboardTab = () => {
  const marketCtx = useContext(MarketContext);
  const windowSize = useWindowSize();

  const podiumWidth =
    windowSize.width > DEFAULT_PODIUM_WIDTH ? windowSize.width : DEFAULT_PODIUM_WIDTH;
  const podiumHeight = (DEFAULT_PODIUM_HEIGHT / DEFAULT_PODIUM_WIDTH) * podiumWidth;
  const medalistSize =
    (podiumWidth - GAP_BETWEEN_PODIUMAND_MEDALIST) / NUMBER_OF_MEDALIST < DEFAULT_MEDALIST_SIZE
      ? (podiumWidth - GAP_BETWEEN_PODIUMAND_MEDALIST) / NUMBER_OF_MEDALIST
      : DEFAULT_MEDALIST_SIZE;
  const crownSize =
    medalistSize >= DEFAULT_MEDALIST_SIZE
      ? medalistSize * DEFAULT_CROWN_SIZE_DESKTOP
      : medalistSize * DEFAULT_CROWN_SIZE_MOBILE;
  const starSize =
    medalistSize >= DEFAULT_MEDALIST_SIZE ? DEFAULT_STAR_SIZE_DESKTOP : DEFAULT_STAR_SIZE_MOBILE;
  const leaderboardUserAvatarSize =
    windowSize.width >= MIN_SCREEN_WIDTH ? DEFAULT_AVATAR_SIZE_DESKTOP : DEFAULT_AVATAR_SIZE_MOBILE;

  const [timeSpan, setTimeSpan] = useState(RankingInterval.LIVE);

  /* Info: (20230511 - Julian) Sorted by rank */
  const leaderboardData = marketCtx.getLeaderboard(timeSpan)?.sort((a, b) => {
    return b.cumulativePnl - a.cumulativePnl;
  }) ?? [defaultLeaderboard, defaultLeaderboard, defaultLeaderboard];

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

  const displayPnl = (pnl: number) =>
    pnl > 0 ? (
      <div className={TypeOfPnLColor.PROFIT}>+ {numberFormatted(pnl)}</div>
    ) : pnl < 0 ? (
      <div className={TypeOfPnLColor.LOSS}>- {numberFormatted(pnl)}</div>
    ) : (
      <div className={TypeOfPnLColor.EQUAL}>{numberFormatted(pnl)}</div>
    );

  const defaultTop3Data = {
    name: 'N/A',
    avatar: DEFAULT_USER_AVATAR,
    displayedPnl: '-',
  };

  /* Info: (20230511 - Julian) Sorted as Sliver, Gold, Bronze */
  const top3 = [
    {
      sorted: 0,
      rank: 2,
      marginTop: 'mt-28 md:mt-24',
      crown: '/leaderboard/silver_crown@2x.png',
      star: '/leaderboard/silver_star.svg',
      medalist: '/leaderboard/silver_medalist.svg',
    },
    {
      sorted: 1,
      rank: 1,
      marginTop: 'mt-20 md:mt-8',
      crown: '/leaderboard/gold_crown@2x.png',
      star: '/leaderboard/gold_star.svg',
      medalist: '/leaderboard/gold_medalist.svg',
    },
    {
      sorted: 2,
      rank: 3,
      marginTop: 'mt-32',
      crown: '/leaderboard/bronze_crown@2x.png',
      star: '/leaderboard/bronze_star.svg',
      medalist: '/leaderboard/bronze_medalist.svg',
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

  /* Info: (20230511 - Julian) If rank <= 0, then display default data */
  const top3Data = top3.map(({sorted, rank}) => {
    const userData =
      rank <= 0
        ? defaultTop3Data
        : {
            name: leaderboardData[rank - 1].userName,
            avatar: leaderboardData[rank - 1].userAvatar ?? DEFAULT_USER_AVATAR,
            displayedPnl: displayPnl(leaderboardData[rank - 1].cumulativePnl),
          };
    return {...top3[sorted], userData};
  });

  const displayedtop3List = top3Data.map(({rank, marginTop, crown, star, medalist, userData}) => {
    const isDisplayedHalo = rank === 1 ? 'block' : 'hidden';
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
        {displayedtop3List}
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

  /* Info: (20230511 - Julian) Leaderboard List (4th ~) */
  const displayedleaderboardList = leaderboardData
    .slice(3)
    .map(({rank, userName, userAvatar, cumulativePnl}) => {
      const displayedRank = rank <= 0 ? '-' : rank;
      const displayedPnl = rank <= 0 ? '-' : displayPnl(cumulativePnl);
      const displayedName = rank <= 0 ? 'N/A' : userName;
      const displayedAvatar = rank <= 0 ? DEFAULT_USER_AVATAR : userAvatar;
      return (
        <div className="flex w-full whitespace-nowrap px-4 py-6 md:px-8 md:py-4">
          <div className="flex flex-1 items-center space-x-2 md:space-x-3">
            <div className="inline-flex items-center sm:w-70px">
              <Image src="/leaderboard/crown.svg" width={25} height={25} alt="crown_icon" />

              <div className="ml-2 text-sm sm:text-lg">{displayedRank}</div>
            </div>
            {/* Info: (20230510 - Julian) User Avatar */}
            <Image
              src={displayedAvatar ?? DEFAULT_USER_AVATAR}
              width={leaderboardUserAvatarSize}
              height={leaderboardUserAvatarSize}
              alt="user_avatar"
            />
            {/* Info: (20230510 - Julian) User Name */}
            <div className="truncate text-sm sm:text-xl">{displayedName}</div>
          </div>
          <div className="flex items-center space-x-3 text-base md:text-xl">
            <div className="inline-flex items-end">
              {displayedPnl}
              <span className="ml-1 text-sm text-lightGray4">{unitAsset}</span>
            </div>
          </div>
        </div>
      );
    });

  return (
    <div className="flex flex-col items-center">
      {displayedTop3}
      {/* Info: (20230509 - Julian) Leaderboard */}
      <div className="my-10 w-screen md:w-8/10">
        <div className="inline-flex w-full text-center font-medium md:space-x-3px">{tabList}</div>
        <div className="relative flex w-full flex-col bg-darkGray7 pt-2">
          {displayedleaderboardList}
          <UserPersonalRanking timeSpan={timeSpan} />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTab;

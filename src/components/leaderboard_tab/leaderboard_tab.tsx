import React, {Dispatch, SetStateAction, useContext, useState, useEffect} from 'react';
import Image from 'next/image';
import useWindowSize from '../../lib/hooks/use_window_size';
import UserPersonalRanking from '../user_personal_ranking/user_personal_ranking';
import Skeleton from 'react-loading-skeleton';
import {GlobalContext} from '../../contexts/global_context';
import {UserContext} from '../../contexts/user_context';
import {TypeOfPnLColor, DEFAULT_USER_AVATAR, SKELETON_DISPLAY_TIME} from '../../constants/display';
import {unitAsset} from '../../constants/config';
import {IPnL} from '../../interfaces/tidebit_defi_background/pnl';
import {numberFormatted, accountTruncate} from '../../lib/common';
import {RankingInterval, IRankingTimeSpan} from '../../constants/ranking_time_span';
import {defaultLeaderboard, IRanking} from '../../interfaces/tidebit_defi_background/leaderboard';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/tidebit_defi_background/locale';

interface LeaderboardTabProps {
  timeSpan: IRankingTimeSpan;
  setTimeSpan: Dispatch<SetStateAction<IRankingTimeSpan>>;
  rankings: IRanking[];
}

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
const DEFAULT_MEDALIST_SKELETON_SIZE = 100;
const GAP_BETWEEN_PODIUMAND_MEDALIST = 500;
const NUMBER_OF_MEDALIST = 3;

const LeaderboardTab = ({timeSpan, setTimeSpan, rankings}: LeaderboardTabProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [isLoading, setIsLoading] = useState(true);
  const windowSize = useWindowSize();
  const globalCtx = useContext(GlobalContext);
  const userCtx = useContext(UserContext);

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
  const medalistSkeletonSize =
    windowSize.width >= MIN_SCREEN_WIDTH ? medalistSize : DEFAULT_MEDALIST_SKELETON_SIZE;
  const nameSkeletonHeight = windowSize.width >= MIN_SCREEN_WIDTH ? 25 : 15;
  const pnlSkeletonHeight = windowSize.width >= MIN_SCREEN_WIDTH ? 30 : 20;

  /* Info: (20230511 - Julian) Sorted by cumulativePnl */
  const rankingData =
    rankings.sort((a, b) => b.cumulativePnl.value - a.cumulativePnl.value) ?? defaultLeaderboard;

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

  let timer: NodeJS.Timeout;

  useEffect(() => {
    clearTimeout(timer);
    setIsLoading(true);
    timer = setTimeout(() => setIsLoading(false), SKELETON_DISPLAY_TIME);
    return () => clearTimeout(timer);
  }, [timeSpan]);

  const displayPnl = (pnl: IPnL) =>
    pnl?.value > 0 ? (
      <div className={TypeOfPnLColor.PROFIT}>+ {numberFormatted(pnl.value)}</div>
    ) : pnl?.value < 0 ? (
      <div className={TypeOfPnLColor.LOSS}>- {numberFormatted(pnl.value)}</div>
    ) : (
      <div className={TypeOfPnLColor.EQUAL}>{numberFormatted(pnl?.value ?? 0)}</div>
    );

  const defaultTop3Data = {
    name: 'N/A',
    id: '',
    avatar: DEFAULT_USER_AVATAR,
    displayedPnl: <>-</>,
  };

  /* Info: (20230511 - Julian) Sorted as Sliver, Gold, Bronze */
  const top3 = [
    {
      sorted: 0,
      rank: 2,
      marginTop: 'mt-24',
      crown: '/leaderboard/silver_crown@2x.png',
      star: '/leaderboard/silver_star.svg',
      medalist: '/leaderboard/silver_medalist.svg',
    },
    {
      sorted: 1,
      rank: 1,
      marginTop: 'mt-20 md:mt-12',
      crown: '/leaderboard/gold_crown@2x.png',
      star: '/leaderboard/gold_star.svg',
      medalist: '/leaderboard/gold_medalist.svg',
    },
    {
      sorted: 2,
      rank: 3,
      marginTop: 'mt-28 md:mt-32',
      crown: '/leaderboard/bronze_crown@2x.png',
      star: '/leaderboard/bronze_star.svg',
      medalist: '/leaderboard/bronze_medalist.svg',
    },
  ];

  /* Info: (20230511 - Julian) Time Span Data */
  const rankingTimeSpan = [
    {
      text: t('LEADERBOARD_PAGE.LIVE'),
      style: activeLiveTabStyle,
      active: () => setTimeSpan(RankingInterval.LIVE),
    },
    {
      text: t('LEADERBOARD_PAGE.DAILY'),
      style: activeDailyTabStyle,
      active: () => setTimeSpan(RankingInterval.DAILY),
    },
    {
      text: t('LEADERBOARD_PAGE.WEEKLY'),
      style: activeWeeklyTabStyle,
      active: () => setTimeSpan(RankingInterval.WEEKLY),
    },
    {
      text: t('LEADERBOARD_PAGE.MONTHLY'),
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
            /* Info: (20230607 - Julian) If User Name length > 20, then truncate */
            name: accountTruncate(rankingData[rank - 1]?.userName, 20),
            id: rankingData[rank - 1]?.userId,
            avatar: rankingData[rank - 1]?.userAvatar ?? DEFAULT_USER_AVATAR,
            displayedPnl: displayPnl(rankingData[rank - 1]?.cumulativePnl),
          };
    return {...top3[sorted], userData};
  });

  const displayedTop3List = top3Data.map(({rank, marginTop, crown, star, medalist, userData}) => {
    const isDisplayedHalo = rank === 1 ? 'block' : 'hidden';

    const clickHandler = () => {
      globalCtx.dataPersonalAchievementModalHandler(userData.id);
      globalCtx.visiblePersonalAchievementModalHandler();
    };

    return isLoading ? (
      <div key={rank} className={`${marginTop}`}>
        <div className="flex flex-col items-center space-y-2 md:space-y-5">
          <Skeleton width={medalistSkeletonSize} height={medalistSkeletonSize} circle />
          <Skeleton width={80} height={nameSkeletonHeight} />
          <Skeleton width={starSize} height={starSize} circle />
          <Skeleton width={100} height={pnlSkeletonHeight} />
        </div>
      </div>
    ) : (
      <div
        id={`Ranking${rank}`}
        key={rank}
        className={`${marginTop} hover:cursor-pointer`}
        onClick={clickHandler}
      >
        <div className="relative flex flex-col">
          {/* Info: (20230511 - Julian) User Avatar */}
          <div
            className={`absolute inline-flex items-center justify-center p-2 transition-all duration-300 md:p-3`}
          >
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
      <div className="absolute -top-48 flex w-full justify-between space-x-4 px-4 md:-top-60 md:px-16">
        {displayedTop3List}
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
      <div key={text} className="w-full">
        <button
          id={`${text}Tab`}
          type="button"
          className={`${style} inline-block w-full rounded-t-2xl px-20px py-2 text-xs transition-all duration-300 hover:cursor-pointer md:text-base`}
          onClick={active}
        >
          {text}
        </button>
      </div>
    );
  });

  /* Info: (20230814 - Julian) Ranking row  */
  const rankingItem = ({rank, userName, userAvatar, cumulativePnl, userId}: IRanking) => {
    const displayedRank = rank <= 0 ? '-' : rank;
    const displayedPnl = rank <= 0 ? '-' : displayPnl(cumulativePnl);
    const displayedName = rank <= 0 ? 'N/A' : accountTruncate(userName, 20);
    const displayedAvatar = rank <= 0 ? DEFAULT_USER_AVATAR : userAvatar;
    const clickHandler = () => {
      globalCtx.dataPersonalAchievementModalHandler(userId);
      globalCtx.visiblePersonalAchievementModalHandler();
    };

    return isLoading ? (
      <div className="flex h-90px items-center justify-between px-8 py-3">
        <div className="flex items-center space-x-6">
          <Skeleton width={60} height={25} />
          <Skeleton width={leaderboardUserAvatarSize} height={leaderboardUserAvatarSize} circle />
          <Skeleton width={80} height={25} />
        </div>
        <Skeleton width={100} height={30} />
      </div>
    ) : (
      <div
        id={`Ranking${rank}`}
        className="flex h-90px w-full whitespace-nowrap px-4 py-6 hover:cursor-pointer md:px-8 md:py-4"
        onClick={clickHandler}
      >
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
  };

  /* Info: (20230814 - Julian) 找到當前使用者的排名，未登入則 0  */
  const userRankingNumber = rankingData.find(data => data.userId === userCtx.user?.id)?.rank ?? 0;
  /* Info: (20231006 - Julian) 排除了前三名的名單 */
  const rankingWithoutTop3 = rankingData.filter(item => item.rank > 3);

  /* Info: (20231006 - Julian)
   * 有登入且排名存在：排除前三名，名次在當前使用者前面的名單
   * 未登入或排名不存在：排除前三名的名單 */
  const rankingDataBeforeUser =
    userCtx.user?.address && userRankingNumber > 0
      ? rankingWithoutTop3.filter(item => item.rank < userRankingNumber)
      : rankingWithoutTop3;
  const displayedListBeforeUser = rankingDataBeforeUser.map((item, index) => (
    <div key={index}>{rankingItem(item)}</div>
  ));

  /* Info: (20231006 - Julian)
   * 有登入且排名存在：排除前三名，名次在當前使用者後面的名單
   * 未登入或排名不存在：null */
  const rankingDataAfterUser =
    userCtx.user?.address && userRankingNumber > 0
      ? rankingWithoutTop3.filter(item => item.rank > userRankingNumber)
      : null;
  const displayedListAfterUser = rankingDataAfterUser
    ? rankingDataAfterUser.map((item, index) => <div key={index}>{rankingItem(item)}</div>)
    : null;

  return (
    <div className="flex flex-col items-center">
      {displayedTop3}
      {/* Info: (20230509 - Julian) Leaderboard */}
      <div className="my-10 w-screen md:w-8/10">
        <div className="inline-flex w-full text-center font-medium md:space-x-3px">{tabList}</div>
        <div className="flex w-full flex-col bg-darkGray7 pt-2">
          {displayedListBeforeUser}
          <UserPersonalRanking timeSpan={timeSpan} rankingData={rankingData} />
          {displayedListAfterUser}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTab;

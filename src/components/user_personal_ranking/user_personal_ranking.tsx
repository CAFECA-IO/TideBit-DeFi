import React, {useContext, useState, useEffect} from 'react';
import {accountTruncate, numberFormatted} from '../../lib/common';
import {UserContext} from '../../contexts/user_context';
import {GlobalContext} from '../../contexts/global_context';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import {TypeOfPnLColor, SKELETON_DISPLAY_TIME} from '../../constants/display';
import {unitAsset} from '../../constants/config';
import {IRankingTimeSpan, RankingInterval} from '../../constants/ranking_time_span';
import {ProfitState} from '../../constants/profit_state';
import {defaultPersonalRanking} from '../../interfaces/tidebit_defi_background/personal_ranking';
import {ImArrowUp, ImArrowDown, ImArrowRight} from 'react-icons/im';
import {RiShareForwardFill} from 'react-icons/ri';
import {BsFacebook, BsTwitter, BsReddit} from 'react-icons/bs';

export interface IUserPersonalRankingProps {
  timeSpan: IRankingTimeSpan;
}

const UserPersonalRanking = ({timeSpan}: IUserPersonalRankingProps) => {
  const userCtx = useContext(UserContext);
  const globalCtx = useContext(GlobalContext);

  const userId = userCtx.user?.id ?? '';

  const [isLoading, setIsLoading] = useState(true);
  const [showShareList, setShowShareList] = useState(false);
  const [userRankData, setUserRankData] = useState(defaultPersonalRanking);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), SKELETON_DISPLAY_TIME);
  }, []);

  useEffect(() => {
    setUserRankData(
      // userCtx.getPersonalRanking(timeSpan) ?? // TODO: using async/await (20230526 - tzuhan)
      defaultPersonalRanking
    );
  }, [timeSpan]);

  const username = userCtx.user?.address?.slice(-1).toUpperCase();

  const rankingNumber = userRankData.rank;
  const pnl = userRankData.pnl;
  const cumulativePnl = userRankData.cumulativePnl;

  const shareClickHandler = () => setShowShareList(!showShareList);

  const personalInfoClickHandler = () => {
    globalCtx.dataPersonalAchievementModalHandler(userId);
    globalCtx.visiblePersonalAchievementModalHandler();
  };

  /* Info: (20230512 - Julian) rankingNumber <= 0 means can't get ranking data */
  const displayedRankingNumber = rankingNumber <= 0 ? '-' : rankingNumber;

  const displayedPnl =
    rankingNumber <= 0 ? (
      '-'
    ) : pnl.type === ProfitState.PROFIT ? (
      <div className={TypeOfPnLColor.PROFIT}>+ {numberFormatted(pnl.value)}</div>
    ) : pnl.type === ProfitState.LOSS ? (
      <div className={TypeOfPnLColor.LOSS}>- {numberFormatted(pnl.value)}</div>
    ) : (
      <div className={TypeOfPnLColor.EQUAL}>{numberFormatted(pnl.value)}</div>
    );

  const displayedCumulativePnl =
    rankingNumber <= 0 ? (
      '-'
    ) : cumulativePnl.type === ProfitState.PROFIT ? (
      <div className="text-lightYellow2">+ {numberFormatted(cumulativePnl.value)}</div>
    ) : cumulativePnl.type === ProfitState.LOSS ? (
      <div className="text-lightYellow2">- {numberFormatted(cumulativePnl.value)}</div>
    ) : (
      <div className="text-lightYellow2">{numberFormatted(cumulativePnl.value)}</div>
    );

  const displayedArrow =
    cumulativePnl.type === ProfitState.PROFIT ? (
      <ImArrowUp width={20} height={26} />
    ) : cumulativePnl.type === ProfitState.LOSS ? (
      <ImArrowDown width={20} height={26} />
    ) : (
      <ImArrowRight width={20} height={26} />
    );

  /* ToDo: (20230512 - Julian) Share function */
  const socialMediaList = (
    <div
      className={`absolute bottom-10 right-0 inline-flex md:-right-28 md:bottom-16 ${
        showShareList ? 'visible opacity-100' : 'invisible opacity-0'
      } space-x-4 bg-darkGray7 p-2 text-lightWhite transition-all duration-300 hover:cursor-pointer`}
    >
      <a>
        <BsFacebook className="hover:text-lightGray2" />
      </a>
      <a>
        <BsTwitter className="hover:text-lightGray2" />
      </a>
      <a>
        <BsReddit className="hover:text-lightGray2" />
      </a>
    </div>
  );

  const isDisplayedShare =
    timeSpan === RankingInterval.LIVE ? null : (
      <div className="relative text-2xl text-lightWhite hover:cursor-pointer hover:text-lightGray2 md:text-4xl">
        {socialMediaList}
        <RiShareForwardFill onClick={shareClickHandler} />
      </div>
    );

  const isDisplayedLiveRank =
    timeSpan === RankingInterval.LIVE ? (
      <div className="inline-flex items-center space-x-1 text-sm text-lightYellow2 sm:text-lg md:space-x-3">
        <div className="hidden sm:block">{displayedCumulativePnl}</div>
        <div>{displayedArrow}</div>
        <div>{displayedRankingNumber}</div>
      </div>
    ) : null;

  const personalRanking = userCtx.user?.address ? (
    isLoading ? (
      <div className="flex items-center bg-darkGray3 px-4 py-2 md:px-8">
        <div className="flex flex-1 items-center space-x-4">
          <Skeleton width={60} height={25} />
          <Skeleton width={60} height={60} circle />
          <Skeleton width={80} height={25} />
        </div>
        <Skeleton width={120} height={25} />
      </div>
    ) : (
      <div className="flex w-full whitespace-nowrap bg-darkGray3 px-4 py-2 shadow-top md:px-8">
        <div
          className="flex flex-1 items-center space-x-2 md:space-x-3"
          onClick={personalInfoClickHandler}
        >
          <div className="inline-flex items-center sm:w-70px">
            <Image src="/leaderboard/crown.svg" width={25} height={25} alt="crown_icon" />

            <div className="ml-2 text-sm sm:text-lg">{displayedRankingNumber}</div>
          </div>
          {/* Info: (20230510 - Julian) User Avatar */}
          <div className="relative inline-flex h-36px w-36px items-center justify-center overflow-hidden rounded-full bg-tidebitTheme text-center md:h-60px md:w-60px">
            <span className="text-2xl font-bold text-lightWhite md:text-3xl">{username}</span>
          </div>
          {/* Info: (20230510 - Julian) User Name */}
          <div className="truncate text-sm sm:text-xl">
            {accountTruncate(userCtx.user?.address)}
          </div>
        </div>
        <div className="flex items-center space-x-3 text-base md:text-xl">
          <div className="inline-flex items-end">
            {displayedPnl}
            <span className="ml-1 text-sm text-lightGray4">{unitAsset}</span>
          </div>
          {isDisplayedLiveRank}
          {isDisplayedShare}
        </div>
      </div>
    )
  ) : null;

  return <div className="sticky bottom-0 z-30 hover:cursor-pointer">{personalRanking}</div>;
};

export default UserPersonalRanking;

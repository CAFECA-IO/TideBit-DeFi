import React, {useContext, useState} from 'react';
import {accountTruncate, numberFormatted} from '../../lib/common';
import {UserContext} from '../../contexts/user_context';
import {ImArrowUp, ImArrowDown, ImArrowRight} from 'react-icons/im';
import Image from 'next/image';
import {TypeOfPnLColor} from '../../constants/display';
import {unitAsset} from '../../constants/config';
import {IRankingTimeSpan, RankingInterval} from '../../constants/ranking_time_span';
import {RiShareForwardFill, RiInstagramFill} from 'react-icons/ri';
import {BsFacebook, BsGithub, BsReddit} from 'react-icons/bs';

export interface IUserPersonalRankingProps {
  timeSpan: IRankingTimeSpan;
}

const UserPersonalRanking = ({timeSpan}: IUserPersonalRankingProps) => {
  const userCtx = useContext(UserContext);

  const [showShareList, setShowShareList] = useState(false);

  const username = userCtx.wallet?.slice(-1).toUpperCase();

  const rankingNumber = userCtx.getMyRanking(timeSpan)?.rank ?? -1;
  const pnl = userCtx.getMyRanking(timeSpan)?.pnl ?? 0;
  const cumulativePnl = userCtx.getMyRanking(timeSpan)?.cumulativePnl ?? 0;

  const shareClickHandler = () => setShowShareList(!showShareList);

  const displayedRankingNumber = rankingNumber < 0 ? '-' : rankingNumber;

  const displayedPnl =
    displayedRankingNumber == '-' ? (
      '-'
    ) : pnl > 0 ? (
      <div className={TypeOfPnLColor.PROFIT}>+ {numberFormatted(pnl)} %</div>
    ) : pnl < 0 ? (
      <div className={TypeOfPnLColor.LOSS}>- {numberFormatted(pnl)} %</div>
    ) : (
      <div className={TypeOfPnLColor.EQUAL}>{numberFormatted(pnl)} %</div>
    );

  const displayedCumulativePnl =
    displayedRankingNumber == '-' ? (
      '-'
    ) : cumulativePnl > 0 ? (
      <div className="text-lightYellow2">+ {numberFormatted(cumulativePnl)} %</div>
    ) : cumulativePnl < 0 ? (
      <div className="text-lightYellow2">- {numberFormatted(cumulativePnl)} %</div>
    ) : (
      <div className="text-lightYellow2">{numberFormatted(cumulativePnl)} %</div>
    );

  const displayedArrow =
    cumulativePnl > 0 ? (
      <ImArrowUp width={20} height={26} />
    ) : cumulativePnl < 0 ? (
      <ImArrowDown width={20} height={26} />
    ) : (
      <ImArrowRight width={20} height={26} />
    );

  // ToDo: (20230511 - Julian) Style & Animation
  const socialMediaList = (
    <div
      className={`absolute bottom-12 bg-darkGray7 text-lightWhite transition-all duration-300 ${
        showShareList ? 'inline-flex opacity-100' : 'hidden opacity-0'
      } hover:cursor-pointer hover:text-lightGray2`}
    >
      <BsFacebook />
      <RiInstagramFill />
      <BsGithub />
      <BsReddit />
    </div>
  );

  const isDisplayedShare =
    timeSpan === RankingInterval.LIVE ? (
      <div className="inline-flex items-center space-x-1 text-sm text-lightYellow2 sm:text-lg md:space-x-3">
        <div className="hidden sm:block">{displayedCumulativePnl}</div>
        <div>{displayedArrow}</div>
        <div>{displayedRankingNumber}</div>
      </div>
    ) : (
      <div className="relative text-2xl text-lightWhite hover:cursor-pointer hover:text-lightGray2 md:text-4xl">
        {socialMediaList}
        <RiShareForwardFill onClick={shareClickHandler} />
      </div>
    );

  const personalRanking = userCtx.wallet ? (
    <div className="flex w-full whitespace-nowrap bg-darkGray3 px-4 py-6 shadow-top md:px-8 md:py-4">
      <div className="flex flex-1 items-center space-x-2 md:space-x-3">
        <div className="inline-flex items-center sm:w-70px">
          <Image src="/leaderboard/crown.svg" width={25} height={25} alt="crown_icon" />

          <div className="ml-2 text-sm sm:text-lg">{displayedRankingNumber}</div>
        </div>
        {/* Info: (20230510 - Julian) User Avatar */}
        <div className="relative inline-flex h-36px w-36px items-center justify-center overflow-hidden rounded-full bg-tidebitTheme text-center md:h-60px md:w-60px">
          <span className="text-2xl font-bold text-lightWhite md:text-3xl">{username}</span>
        </div>
        {/* Info: (20230510 - Julian) User Name */}
        <div className="truncate text-sm sm:text-xl">{accountTruncate(userCtx.wallet)}</div>
      </div>
      <div className="flex items-center space-x-3 text-base md:text-xl">
        <div className="inline-flex items-end">
          {displayedPnl}
          <span className="ml-1 text-sm text-lightGray4">{unitAsset}</span>
        </div>
        {isDisplayedShare}
      </div>
    </div>
  ) : null;

  return <div className="sticky bottom-0 z-30">{personalRanking}</div>;
};

export default UserPersonalRanking;

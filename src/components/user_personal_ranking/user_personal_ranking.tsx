import React, {useContext} from 'react';
import {accountTruncate, numberFormatted} from '../../lib/common';
import {UserContext} from '../../contexts/user_context';
import {ImArrowUp, ImArrowDown, ImArrowRight} from 'react-icons/im';
import Image from 'next/image';
import {TypeOfPnLColor} from '../../constants/display';
import {unitAsset} from '../../constants/config';

const UserPersonalRanking = () => {
  const userCtx = useContext(UserContext);

  const username = userCtx.wallet?.slice(-1).toUpperCase();

  /* ToDo: (20230509 - Julian) get Ranking data */
  const rankingNumber = userCtx.getMyRanking('')?.rank ?? 0;
  const pnl = userCtx.getMyRanking('')?.pnl ?? 0;
  const cumulativePnl = userCtx.getMyRanking('')?.cumulativePnl ?? 0;

  const displayedPnl =
    pnl > 0 ? (
      <div className={TypeOfPnLColor.PROFIT}>+ {numberFormatted(pnl)} %</div>
    ) : pnl < 0 ? (
      <div className={TypeOfPnLColor.LOSS}>- {numberFormatted(pnl)} %</div>
    ) : (
      <div className={TypeOfPnLColor.EQUAL}>{numberFormatted(pnl)} %</div>
    );

  const displayedCumulativePnl =
    cumulativePnl > 0 ? (
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

  const personalRanking = userCtx.wallet ? (
    <div className="fixed bottom-0 z-30 flex h-80px w-screen whitespace-nowrap bg-darkGray3 px-4 md:w-8/10">
      <div className="flex flex-1 items-center space-x-2 md:space-x-4">
        <div className="inline-flex items-center sm:w-70px">
          <Image src="/elements/crown.svg" width={25} height={25} alt="crown_icon" />

          <div className="ml-2 text-sm sm:text-lg">{rankingNumber}</div>
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
        <div className="inline-flex items-center space-x-1 text-sm text-lightYellow2 sm:text-lg md:space-x-3">
          <div className="hidden sm:block">{displayedCumulativePnl}</div>
          <div>{displayedArrow}</div>
          <div>{rankingNumber}</div>
        </div>
      </div>
    </div>
  ) : null;

  return <>{personalRanking}</>;
};

export default UserPersonalRanking;

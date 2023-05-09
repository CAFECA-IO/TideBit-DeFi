import React, {useContext} from 'react';
import {accountTruncate} from '../../lib/common';
import {UserContext} from '../../contexts/user_context';
import {ImArrowUp, ImArrowDown, ImArrowRight} from 'react-icons/im';
import Image from 'next/image';
import {TypeOfPnLColor, UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {unitAsset, FRACTION_DIGITS} from '../../constants/config';

const UserPersonalRanking = () => {
  const userCtx = useContext(UserContext);

  const username = userCtx.wallet?.slice(-1).toUpperCase();

  /* ToDo: (20230509 - Julian) get Ranking data */
  const pnl = -7.323;
  const rankingNumber = 214;
  const cumulativePnl = 0;

  const numberFormatted = (n: number) => {
    const result =
      n === 0 ? '0' : Math.abs(n).toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, FRACTION_DIGITS);
    return result;
  };

  const displayedPnl =
    pnl > 0 ? (
      <div className={TypeOfPnLColor.PROFIT}>+ {numberFormatted(pnl)} %</div>
    ) : pnl < 0 ? (
      <div className={TypeOfPnLColor.LOSS}>- {numberFormatted(pnl)} %</div>
    ) : (
      <div className={TypeOfPnLColor.EQUAL}>{numberFormatted(pnl)} %</div>
    );

  const displayedRankingNumber =
    cumulativePnl > 0 ? (
      <div className="text-lightYellow2">+ {numberFormatted(cumulativePnl)} %</div>
    ) : cumulativePnl < 0 ? (
      <div className="text-lightYellow2">- {numberFormatted(cumulativePnl)} %</div>
    ) : (
      <div className="text-lightYellow2">{numberFormatted(cumulativePnl)} %</div>
    );

  /* ToDo: (20230509 - Julian) default icon */
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
      <div className="flex flex-1 items-center space-x-4">
        <div className="inline-flex items-center">
          <Image src="/elements/crown.svg" width={25} height={25} alt="crown_icon" />

          <div className="ml-2 text-lg">{rankingNumber}</div>
        </div>
        <div className="relative inline-flex h-60px w-60px items-center justify-center overflow-hidden rounded-full bg-tidebitTheme text-center">
          <span className="text-3xl font-bold text-lightWhite">{username}</span>
        </div>
        <div className="truncate text-xl">{accountTruncate(userCtx.wallet)}</div>
      </div>
      <div className="flex items-center space-x-3 text-xl">
        <div className="inline-flex items-end">
          {displayedPnl}
          <span className="ml-1 text-sm text-lightGray4">{unitAsset}</span>
        </div>
        <div className="inline-flex items-center space-x-3 text-lightYellow2">
          <div>{displayedRankingNumber}</div>
          {displayedArrow}
          <div>{rankingNumber}</div>
        </div>
      </div>
    </div>
  ) : null;

  return <>{personalRanking}</>;
};

export default UserPersonalRanking;

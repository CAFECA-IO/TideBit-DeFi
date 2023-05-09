import React, {useContext} from 'react';
import {accountTruncate} from '../../lib/common';
import {UserContext} from '../../contexts/user_context';
import {ImArrowUp} from 'react-icons/im';
import Image from 'next/image';
import Footer from '../footer/footer';

const BoardPageBody = () => {
  const userCtx = useContext(UserContext);

  const username = userCtx.wallet?.slice(-1).toUpperCase();

  const personalRanking = userCtx.wallet ? (
    <div className="fixed bottom-0 z-30 flex h-80px w-screen whitespace-nowrap bg-darkGray3 px-4 md:w-8/10">
      <div className="flex flex-1 items-center space-x-4">
        <div className="inline-flex items-center">
          <Image src="/elements/crown.svg" width={25} height={25} alt="crown_icon" />
          {/* ToDo: (20230509 - Julian) get Ranking number */}
          <div className="ml-2 text-lg">213</div>
        </div>
        <div className="relative inline-flex h-60px w-60px items-center justify-center overflow-hidden rounded-full bg-tidebitTheme text-center">
          <span className="text-3xl font-bold text-lightWhite">{username}</span>
        </div>
        <div className="truncate text-xl">{accountTruncate(userCtx.wallet)}</div>
      </div>
      {/* ToDo: (20230509 - Julian) get Ranking data */}
      <div className="inline-flex items-center space-x-3 text-xl">
        <div>
          - 7 %<span className="ml-1 text-sm text-lightGray4">USDT</span>
        </div>
        <div className="inline-flex items-center space-x-3 text-lightYellow2">
          <div>+ 1 %</div>
          <ImArrowUp width={20} height={26} />
          <div>213</div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="relative overflow-x-hidden overflow-y-hidden pt-20">
      <div className="min-h-screen">
        <div className="absolute my-10 mx-auto flex w-screen flex-col items-center space-y-4">
          <div>
            {/* ToDo: (20230509 - Julian) i18n */}
            <h1 className="text-3xl">Leaderboard</h1>
          </div>
          {/* ToDo: (20230509 - Julian) Top 3 */}
          <div className="h-500px w-700px bg-lightWhite"></div>
          {/* ToDo: (20230509 - Julian) Ranking List with tabs */}
          <div className="h-50px w-screen rounded-xl bg-darkGray7 md:w-8/10"></div>
        </div>
        <div className="flex justify-center">{personalRanking}</div>
      </div>

      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default BoardPageBody;

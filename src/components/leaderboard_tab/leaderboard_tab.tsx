import React from 'react';
import Image from 'next/image';
import useWindowSize from '../../lib/hooks/use_window_size';

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

  // ToDo: (20230510 - Julian) avatar size
  // ToDo: (20230510 - Julian) get data from Context
  const gold = (
    <div className="relative mt-20 md:mt-8">
      <div>
        <div
          className={`absolute inline-flex h-${medalistSize}px w-${medalistSize}px items-center justify-center p-3`}
        >
          <div
            className={`inline-flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-cuteBlue text-center`}
          >
            <span className="text-2xl font-bold text-lightWhite md:text-3xl">J</span>
          </div>
        </div>

        <Image
          src="/elements/gold_medalist.svg"
          width={medalistSize}
          height={medalistSize}
          alt="gold_medalist_icon"
        />
      </div>
      <div className="absolute top-36 flex w-full flex-col items-center space-y-3">
        <Image src="/elements/gold_crown@2x.png" width={120} height={120} alt="gold_crown_icon" />
        <div className="text-lg">name</div>
        <Image src="/elements/gold_star.svg" width={50} height={50} alt="gold_crown_icon" />
        <div className="text-xl">+ 47.45 % USDT</div>
      </div>
    </div>
  );

  const silver = (
    <div className="mt-28 md:mt-24">
      <Image
        src="/elements/silver_medalist.svg"
        width={medalistSize}
        height={medalistSize}
        alt="silver_medalist"
      />
    </div>
  );

  const bronze = (
    <div className="mt-32 md:mt-32">
      <Image
        src="/elements/bronze_medalist.svg"
        width={medalistSize}
        height={medalistSize}
        alt="bronze_medalist"
      />
    </div>
  );

  const displayedTop3 = (
    <div className="relative w-screen md:w-8/10">
      <div className="absolute -top-56 flex w-full justify-between px-10 md:px-20">
        {/* ToDo: (20230510 - Julian) loop */}
        {silver}
        {gold}
        {bronze}
      </div>
      <Image
        src="/elements/podium.png"
        width={podiumWidth}
        height={podiumHeight}
        alt="podium_picture"
      />
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      {displayedTop3}
      {/* ToDo: (20230509 - Julian) Ranking List with tabs */}
      <div className="my-10 h-50px w-screen rounded-xl bg-darkGray7 md:w-8/10"></div>
    </div>
  );
};

export default LeaderboardTab;

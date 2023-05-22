import React, {useEffect, useState} from 'react';
import BalanceSection from '../balance_section/balance_section';
import PnlSection from '../pnl_section/pnl_section';
import InterestSection from '../interest_section/interest_section';
import ReceiptSection from '../receipt_section/receipt_section';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import Footer from '../footer/footer';

const AssetsPageBody = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <div>
      <SkeletonTheme baseColor="#1E2329" highlightColor="#444">
        <div className="pt-10">
          {' '}
          <div className="">
            {isLoading ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="mx-510px mt-28 flex h-320px w-320px flex-col items-center space-y-4 bg-darkGray7 p-16">
                  <Skeleton width={150} height={25} />
                  <Skeleton width={200} height={50} />
                  <Skeleton width={220} height={25} />
                </div>
                <div className="flex space-x-5">
                  <Skeleton width={160} height={40} />
                  <Skeleton width={160} height={40} />
                </div>
              </div>
            ) : (
              <BalanceSection />
            )}
          </div>
          <div className="">
            {isLoading ? (
              <div className="mt-10 flex w-screen flex-col justify-between space-y-16 px-32 py-10 md:mt-6 md:flex-row md:space-y-0">
                <div className="flex flex-col items-center space-y-3 md:items-start">
                  <Skeleton width={120} height={25} />
                  <Skeleton width={170} height={30} />
                  <Skeleton width={100} height={25} />
                </div>
                <div className="flex flex-col items-center space-y-3 md:items-start">
                  <Skeleton width={120} height={25} />
                  <Skeleton width={170} height={30} />
                  <Skeleton width={100} height={25} />
                </div>
                <div className="flex flex-col items-center space-y-3 md:items-start">
                  <Skeleton width={120} height={25} />
                  <Skeleton width={170} height={30} />
                  <Skeleton width={100} height={25} />
                </div>
              </div>
            ) : (
              <PnlSection />
            )}
          </div>
          <div className="relative mb-5 mt-5">
            {/* ToDo: (20230522 - Julian) Add skeleton loading */}
            {/* <div className="absolute flex w-screen justify-center">
              <Skeleton width={200} height={30} className="mt-9" />
            </div> */}
            <InterestSection />
          </div>
          <div className="">
            <ReceiptSection />
          </div>
        </div>

        <div className="">
          <Footer />
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default AssetsPageBody;

import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../../contexts/user_context';
import {useGlobal} from '../../contexts/global_context';
import BalanceSection from '../balance_section/balance_section';
import PnlSection from '../pnl_section/pnl_section';
import InterestSection from '../interest_section/interest_section';
import ReceiptSection from '../receipt_section/receipt_section';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import Footer from '../footer/footer';
import {useTranslation} from 'next-i18next';
import {CustomError, isCustomError} from '../../lib/custom_error';
import {Code} from '../../constants/code';
import {NotificationContext} from '../../contexts/notification_context';

type TranslateFunction = (s: string) => string;

const AssetsPageBody = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const [isInit, setIsInit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const userCtx = useContext(UserContext);
  const globalCtx = useGlobal();
  const notificationCtx = useContext(NotificationContext);

  const redirect = () => {
    globalCtx.dataWarningModalHandler({
      title: t('POSITION_MODAL.WARNING_LOGGED_OUT_TITLE'),
      content: t('POSITION_MODAL.WARNING_LOGGED_OUT_CONTENT'),
      numberOfButton: 1,
      pathOfButton: '/',
      reactionOfButton: t('POSITION_MODAL.WARNING_GO_HOME_BUTTON'),
    });

    globalCtx.visibleWarningModalHandler();
  };

  const getUserPrivateInfo = async () => {
    try {
      const {success: isGetUserAssetsSuccess, code: userAssetsCode} = await userCtx.getUserAssets();
      if (!isGetUserAssetsSuccess)
        throw new CustomError(isCustomError(userAssetsCode) ? userAssetsCode : Code.UNKNOWN_ERROR);
      userCtx.listHistories();
      setIsInit(true);
      setIsLoading(false);
    } catch (err) {
      notificationCtx.addException('getUserPrivateInfo', err as Error, Code.UNKNOWN_ERROR);
      // Deprecated: [debug] (20230608 - tzuhan)
      // eslint-disable-next-line no-console
      console.log(`MyAssets getUserAssets error: `, err);
      redirect();
    }
  };

  useEffect(() => {
    if (userCtx.isInit) {
      if (!userCtx.enableServiceTerm) {
        redirect();
      } else {
        if (!isInit) getUserPrivateInfo();
      }
    }
  }, [isInit, userCtx.isInit, userCtx.enableServiceTerm]);

  const balanceSection = isLoading ? (
    <div className="flex flex-col items-center space-y-2">
      <div className="mx-auto mt-28 flex h-320px w-320px flex-col items-center space-y-4 bg-darkGray7 p-16">
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
  );

  const pnlSection = isLoading ? (
    <div className="mt-10 flex flex-col justify-between space-y-16 px-32 py-10 md:mt-6 md:flex-row md:space-y-0">
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
  );

  const receiptSection = isLoading ? (
    <div className="mb-8 flex flex-col items-center">
      <Skeleton width={200} height={30} className="mt-9" />
      <div className="mt-14 flex w-8/10 justify-between">
        <div className="ml-8 flex flex-col items-center space-y-10">
          <Skeleton width={100} height={25} />
          <Skeleton width={150} height={35} />
        </div>
        <div className="flex flex-col items-center space-y-10">
          <Skeleton width={250} height={25} />
          <Skeleton width={150} height={35} />
        </div>
        <div className="flex flex-col items-center space-y-10">
          <Skeleton width={200} height={25} />
          <Skeleton width={150} height={35} />
        </div>
        <div className="">
          <Skeleton width={250} height={150} />
        </div>
      </div>
    </div>
  ) : (
    <InterestSection />
  );

  return (
    <div className="overflow-x-hidden mx-auto max-w-1920px container">
      <SkeletonTheme baseColor="#1E2329" highlightColor="#444">
        <div className="pt-10">
          {balanceSection}
          {pnlSection}
          {receiptSection}
          <ReceiptSection />
        </div>
      </SkeletonTheme>
      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default AssetsPageBody;

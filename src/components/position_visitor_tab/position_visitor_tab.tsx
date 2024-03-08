import React from 'react';
import {useTranslation} from 'next-i18next';
import {WalletConnectButton} from '../wallet_connect_button/wallet_connect_button';

type TranslateFunction = (s: string) => string;

const PositionVisitorTab = ({rightPosition}: {rightPosition: string}) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const tabBodyWidth = 'w-320px';

  return (
    <div
      className={`pointer-events-none fixed top-82px right-0 z-10 flex overflow-x-hidden overflow-y-hidden outline-none focus:outline-none`}
      style={{right: rightPosition}}
    >
      <div className="relative my-6 mx-auto w-auto max-w-xl">
        <div className={`relative`}>
          <div
            className={`pointer-events-auto ${tabBodyWidth} h-screen bg-darkGray p-5 text-white transition-all duration-300`}
          >
            <div className="h-full w-full flex-col justify-center pt-4/5">
              <div className="ml-5 flex flex-col items-center">
                <div className="">
                  <p className="text-center text-sm text-lightGray">
                    {t('TRADE_PAGE.WALLET_CONNECT_DESCRIPTION')}
                  </p>
                </div>
                <div className="mt-10">
                  <WalletConnectButton
                    id="WalletConnectButtonPositionTab"
                    className="mt-4 py-2 px-5 md:mt-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionVisitorTab;

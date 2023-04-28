import React from 'react';
import {useTranslation} from 'next-i18next';
import {WalletConnectButton} from '../wallet_connect_button/wallet_connect_button';

type TranslateFunction = (s: string) => string;

const TradeVisitorTab = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const tabBodyWidth = 'w-320px';

  return (
    <div>
      {/* TODO: (20230317 - Shirley) order section scroll */}
      {/* `overflow-y-scroll scroll-smooth` only show the scroll bar but no functionality */}
      <div
        className={`pointer-events-none fixed top-82px right-0 z-10 flex overflow-x-hidden overflow-y-hidden outline-none focus:outline-none`}
      >
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {' '}
          <div className={`relative`}>
            {/* ---sidebar self--- */}
            <div
              className={`pointer-events-auto ${tabBodyWidth} h-screen bg-darkGray p-5 text-white transition-all duration-300`}
            >
              {/* <h1 className="pl-5 text-2xl font-bold">Start to trade</h1> */}

              <div className="h-full w-full flex-col justify-center pt-4/5">
                <div className="ml-5 flex flex-col items-center">
                  {' '}
                  {/* <div className="px-1/3">Lest</div> */}
                  <div className="">
                    <p className="text-center text-sm text-lightGray">
                      {t('TRADE_PAGE.WALLET_CONNECT_DESCRIPTION')}
                    </p>
                  </div>
                  <div className="mt-10">
                    {/* <WalletPanel getUserLoginState={getUserLoginHandler} /> */}
                    <WalletConnectButton className="mt-4 py-2 px-5 md:mt-0" />
                  </div>
                </div>
              </div>

              {/* Divider */}
              {/* <span className="absolute top-420px my-auto h-px w-7/8 rounded bg-white/50"></span> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeVisitorTab;

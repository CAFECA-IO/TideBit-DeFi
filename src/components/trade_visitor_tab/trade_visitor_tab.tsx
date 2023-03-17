import {useState} from 'react';
import WalletPanel from '../wallet_panel/wallet_panel';
import TideButton from '../tide_button/tide_button';
import {useGlobal} from '../../contexts/global_context';

const TradeVisitorTab = () => {
  const globalCtx = useGlobal();

  const tabBodyWidth = 'w-320px';

  // const [userLoginState, setUserLoginState] = useState(false);

  // const getUserLoginHandler = (bool: boolean) => {
  //   setUserLoginState(bool);
  // };

  const btnClickHandler = () => {
    globalCtx.visibleWalletPanelHandler();
  };

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
                <div className="ml-5">
                  {' '}
                  {/* <div className="px-1/3">Lest</div> */}
                  <div className="">
                    <p className="text-center text-sm text-lightGray">
                      Connect your wallet to start trading
                    </p>
                  </div>
                  <div className="space-y-2 pl-60px pt-10">
                    {/* <WalletPanel getUserLoginState={getUserLoginHandler} /> */}
                    <TideButton
                      onClick={btnClickHandler}
                      className={`mt-4 rounded border-0 bg-tidebitTheme py-2 px-5 text-base text-white transition-all hover:opacity-90 md:mt-0`}
                    >
                      Wallet Connect
                    </TideButton>
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

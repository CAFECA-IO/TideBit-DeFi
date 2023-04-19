import {useEffect, useRef, useContext, useState} from 'react';
import {ImCross, ImUpload2} from 'react-icons/im';
import WalletOption from '../wallet_option/wallet_option';
import {DELAYED_HIDDEN_SECONDS} from '../../constants/display';
import {useTranslation} from 'next-i18next';
import {MarketContext} from '../../contexts/market_context';
import {UserContext} from '../../contexts/user_context';
import {useGlobal} from '../../contexts/global_context';
import {IWalletExtension, WalletExtension} from '../../constants/wallet_extension';

type TranslateFunction = (s: string) => string;

interface IWalletPanelProps {
  className?: string;
  getUserLoginState?: (props: boolean) => void;
  panelVisible: boolean;
  panelClickHandler: () => void;
}

export default function WalletPanel({
  className,
  getUserLoginState,
  panelVisible,
  panelClickHandler,
}: IWalletPanelProps) {
  const globalCtx = useGlobal();
  const userCtx = useContext(UserContext);

  const {t}: {t: TranslateFunction} = useTranslation('common');

  async function metamaskConnect() {
    globalCtx.visibleWalletPanelHandler();

    if (!userCtx.isConnected) {
      try {
        globalCtx.dataLoadingModalHandler({
          modalTitle: t('WALLET_PANEL.TITLE'),
          modalContent: t('WALLET_PANEL.CONNECTING'),
        });
        globalCtx.visibleLoadingModalHandler();

        await userCtx.connect();

        globalCtx.eliminateAllModals();

        globalCtx.visibleSignatureProcessModalHandler();
      } catch (error) {
        globalCtx.visibleWalletPanelHandler();
      }
    } else {
      globalCtx.visibleSignatureProcessModalHandler();
    }
  }

  const walletconnectOptionClickHandler = () => {
    return;
  };

  const metamaskOptionClickHandler = async () => {
    metamaskConnect();
  };

  const additionalWalletOptions = [
    {name: 'Metamask', img: '/elements/74263ff26820cd0d895968e3b55e8902.svg'},
    {name: 'iSunOne', img: '/elements/i_sun_one.svg'},
    {name: 'imToken', img: '/elements/path_25918.svg'},
    {name: 'Coinbase', img: '/elements/18060234@2x.png'},
    {name: 'Trust', img: '/elements/twt@2x.png'},
    {name: 'Rainbow', img: '/elements/unnamed@2x.png'},
    {name: 'Houbi', img: '/elements/logo@2x.png'},
    {name: 'Coin98', img: '/elements/coin98_c98_logo@2x.png'},
    {name: 'TokenPocket', img: '/elements/tokenpocket_wallet_logo@2x.png'},
    {name: 'WalletConnect', img: '/elements/walletconnect@2x.png'},
    {name: 'BitKeep', img: '/elements/path_25917.svg'},
    {name: 'Others', img: '/elements/wallet@2x.png'},
  ];

  const walletData = {
    [WalletExtension.META_MASK]: {
      name: WalletExtension.META_MASK,
      img: '/elements/74263ff26820cd0d895968e3b55e8902.svg',
      onClick: metamaskOptionClickHandler,
    },
    [WalletExtension.I_SUN_ONE]: {
      name: WalletExtension.I_SUN_ONE,
      img: '/elements/i_sun_one.svg',
    },
    [WalletExtension.IM_TOKEN]: {
      name: WalletExtension.IM_TOKEN,
      img: '/elements/path_25918.svg',
    },
    [WalletExtension.COINBASE]: {
      name: WalletExtension.COINBASE,
      img: '/elements/18060234@2x.png',
    },
    [WalletExtension.TRUST]: {
      name: WalletExtension.TRUST,
      img: '/elements/twt@2x.png',
    },
    [WalletExtension.RAINBOW]: {
      name: WalletExtension.RAINBOW,
      img: '/elements/unnamed@2x.png',
    },
    [WalletExtension.HOUBI]: {
      name: WalletExtension.HOUBI,
      img: '/elements/logo@2x.png',
    },
    [WalletExtension.COIN_98]: {
      name: WalletExtension.COIN_98,
      img: '/elements/coin98_c98_logo@2x.png',
    },
    [WalletExtension.TOKEN_POCKET]: {
      name: WalletExtension.TOKEN_POCKET,
      img: '/elements/tokenpocket_wallet_logo@2x.png',
    },
    [WalletExtension.WALLET_CONNECT]: {
      name: WalletExtension.WALLET_CONNECT,
      img: '/elements/walletconnect@2x.png',
      onClick: walletconnectOptionClickHandler,
    },
    [WalletExtension.BIT_KEEP]: {
      name: WalletExtension.BIT_KEEP,
      img: '/elements/path_25917.svg',
    },
    [WalletExtension.OTHERS]: {
      name: WalletExtension.OTHERS,
      img: '/elements/wallet@2x.png',
    },
  };

  const filteredWalletData = Object.values(walletData).filter(wallet => {
    const walletName = userCtx.walletExtensions.includes(wallet.name);

    // Deprecated: (20230419 - Shirley)
    // eslint-disable-next-line no-console
    console.log('useCtx walletExtensions', userCtx.walletExtensions);
    return walletName;
  });

  // const walletConnectExists = userCtx.walletExtensions.includes(WalletExtension.WALLET_CONNECT);
  const walletConnectExists = filteredWalletData.find(
    wallet => wallet.name === WalletExtension.WALLET_CONNECT
  );

  const renderWalletData = walletConnectExists
    ? filteredWalletData
    : filteredWalletData.concat(walletData[WalletExtension.WALLET_CONNECT]);

  // Deprecated: (20230419 - Shirley)
  // eslint-disable-next-line no-console
  console.log('filteredWalletData', filteredWalletData);
  // eslint-disable-next-line no-console
  console.log('renderWalletData', renderWalletData);

  const walletOptionsSection = (
    <div className="grid grid-cols-3 gap-3">
      {renderWalletData.map(option => (
        <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
          <WalletOption
            name={option.name}
            img={option.img}
            onClick={option.onClick}
            iconSize={50}
          />
        </div>
      ))}
    </div>
  );

  const walletPanel = (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative my-6 mx-20px w-auto max-w-xl md:mx-auto">
          {/*content & panel*/}
          <div className="relative flex w-full flex-col items-center rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none">
            {/*header*/}
            <div className="mx-auto flex items-start rounded-t pt-6">
              <h3 className="my-4 mx-auto text-xl font-semibold text-lightWhite md:mt-2 md:text-4xl">
                {t('WALLET_PANEL.TITLE')}
              </h3>
              <button
                className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none"
                onClick={panelClickHandler}
              >
                <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                  <ImCross />
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative mx-10 flex-auto pt-1 md:px-4 md:pb-4">
              <div className="my-4 text-lg leading-relaxed text-white">{walletOptionsSection}</div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b p-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-30 bg-black opacity-25"></div>
    </>
  );

  const isDisplayedWalletPanel = panelVisible ? <>{walletPanel}</> : null;

  return <>{isDisplayedWalletPanel}</>;
}

import React, {useContext} from 'react';
import {ImCross} from 'react-icons/im';
import WalletOption from '../wallet_option/wallet_option';
import {useTranslation} from 'next-i18next';
import {UserContext} from '../../contexts/user_context';
import {useGlobal} from '../../contexts/global_context';
import {
  IWalletExtension,
  WalletExtensionData,
  WalletExtension,
} from '../../constants/wallet_extension';
import {Code} from '../../constants/code';
import {NotificationContext} from '../../contexts/notification_context';

type TranslateFunction = (s: string) => string;

interface IWalletPanelProps {
  className?: string;
  getUserLoginState?: (props: boolean) => void;
  panelVisible: boolean;
  panelClickHandler: () => void;
}

export default function WalletPanel({panelVisible, panelClickHandler}: IWalletPanelProps) {
  const globalCtx = useGlobal();
  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);

  const {t}: {t: TranslateFunction} = useTranslation('common');

  async function metamaskConnect() {
    globalCtx.visibleWalletPanelHandler();

    if (!userCtx.isConnected) {
      try {
        globalCtx.dataLoadingModalHandler({
          modalTitle: t('WALLET_PANEL.TITLE'),
          modalContent: t('WALLET_PANEL.CONNECTING'),
          isShowZoomOutBtn: false,
        });
        globalCtx.visibleLoadingModalHandler();

        await userCtx.connect();

        globalCtx.eliminateAllModals();

        globalCtx.visibleSignatureProcessModalHandler();
      } catch (error) {
        notificationCtx.addException(
          'metamaskConnect wallet_panel',
          error as Error,
          Code.UNKNOWN_ERROR
        );
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

  const addOnClickHandlers = (walletObj: {name: IWalletExtension; img: string}) => {
    if (walletObj.name === WalletExtension.META_MASK) {
      return {...walletObj, onClick: metamaskOptionClickHandler};
    }

    if (walletObj.name === WalletExtension.WALLET_CONNECT) {
      return {...walletObj, onClick: walletconnectOptionClickHandler};
    }

    return walletObj;
  };

  const filteredWalletData = Object.values(WalletExtensionData).filter(wallet =>
    userCtx.walletExtensions.includes(wallet.name)
  );

  const walletConnectExists = filteredWalletData.find(
    wallet => wallet.name === WalletExtension.WALLET_CONNECT
  );

  const renderWalletData: {
    onClick?: () => void;
    name: IWalletExtension;
    img: string;
  }[] = walletConnectExists
    ? filteredWalletData.map(wallet => addOnClickHandlers(wallet))
    : filteredWalletData
        .concat(WalletExtensionData[WalletExtension.WALLET_CONNECT])
        .map(wallet => addOnClickHandlers(wallet));

  const walletOptionsSection = (
    <div className="grid grid-cols-3 gap-3">
      {renderWalletData.map(option => (
        <div
          id={`${option.name}Button`}
          key={option.name}
          className="col-span-1 flex items-center justify-center rounded bg-darkGray2"
        >
          <WalletOption
            name={option.name}
            img={option.img}
            onClick={option?.onClick}
            iconSize={50}
          />
        </div>
      ))}
    </div>
  );

  const walletPanel = (
    /* Info: (20231204 - Julian) Blur Mask */
    <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/25 outline-none backdrop-blur-sm focus:outline-none">
      <div
        id="WalletPanel"
        className="relative flex w-9/10 lg:w-fit flex-col items-center py-6 rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
      >
        <div className="mx-auto flex items-center">
          <h3 className="my-4 mx-auto text-xl font-semibold text-lightWhite md:mt-2 md:text-4xl">
            {t('WALLET_PANEL.TITLE')}
          </h3>
          <button
            id="WalletPanelCloseButton"
            className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none"
            onClick={panelClickHandler}
          >
            <span className="absolute top-5 right-5 block outline-none focus:outline-none">
              <ImCross />
            </span>
          </button>
        </div>
        <div className="relative mx-10 flex-auto">
          <div className="my-4 text-lg leading-relaxed text-white">{walletOptionsSection}</div>
        </div>
      </div>
    </div>
  );

  const isDisplayedWalletPanel = panelVisible ? <>{walletPanel}</> : null;

  return <>{isDisplayedWalletPanel}</>;
}

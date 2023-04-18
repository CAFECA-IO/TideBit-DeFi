import {useEffect, useRef, useContext, useState} from 'react';
import {ImCross, ImUpload2} from 'react-icons/im';
import WalletOption from '../wallet_option/wallet_option';
import TideButton from '../tide_button/tide_button';
import {ethers, providers} from 'ethers';
import DevToast from '../dev_toast/dev_toast';
import Lottie from 'lottie-react';
import searching from '../../../public/animation/searching.json';
import QRCodeModal from '@walletconnect/qrcode-modal';
import WalletConnect from '@walletconnect/client';
import {SUPPORTED_NETWORKS, WALLET_CONNECT_BRIDGE_URL} from '../../constants/config';
import {DELAYED_HIDDEN_SECONDS} from '../../constants/display';
import {IConnector} from '../../interfaces/wallet_connect';
import {useTranslation} from 'next-i18next';
import {MarketContext} from '../../contexts/market_context';
import {UserContext} from '../../contexts/user_context';
import {useGlobal} from '../../contexts/global_context';

const ICON_SIZE = 50;
const WALLET_CONNECT_PROJECT_ID = process.env.WALLET_CONNECT_PROJECT_ID;

// TODO: salt is optional, but if not provided, the signature will be different each time(?)
type TranslateFunction = (s: string) => string;

interface IWalletPanelProps {
  className?: string;
  getUserLoginState?: (props: boolean) => void;
  // getUserLoginState: (props: boolean) => Promise<void>;
  // getUserInfo: (address: string) => Promise<void>;
  // getUserSignatureWithSaltAndMessage: (
  //   address: string,
  //   salt: string,
  //   message: string
  // ) => Promise<void>;
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
  // const {availableTransferOptions} = useContext(MarketContext);

  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);

  interface IConnectingProps {
    provider: providers.Web3Provider;
  }
  interface IConnectorProps {
    provider: providers.Web3Provider;
  }

  const [connecting, setConnecting] = useState(false);

  const [errorMessages, setErrorMessages] = useState('');
  const [signature, setSignature] = useState('');
  const [userBalance, setUserBalance] = useState('');

  const [chainId, setChainId] = useState(0);

  const [showToast, setShowToast] = useState(false);
  // IConnector
  const [connector, setConnector] = useState<IConnector>();
  const [fetching, setFetching] = useState(false);
  const [supported, setSupported] = useState(false);
  const [symbol, setSymbol] = useState(null);
  const [chooseWalletConnect, setChooseWalletConnect] = useState(false);
  const [walletConnectSuccessful, setWalletConnectSuccessful] = useState(false);
  const [signInStore, setSignInStore] = useState(false);

  const [chooseMetamask, setChooseMetamask] = useState(false);

  // First time connect to metamask, make accountsChanged event listener NOT send signature request
  const [metamaskConnectFirstTimeSuccessful, setMetamaskConnectFirstTimeSuccessful] =
    useState(false);

  const [signaturePending, setSignaturePending] = useState(false);

  const passUserLoginState = async (props: boolean) => {
    getUserLoginState && getUserLoginState(props);
  };

  // TODO: Ongoing connecting process (loading modal->signature process modal)
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

  const walletOptionsSection = (
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
        <WalletOption
          onClick={metamaskOptionClickHandler}
          name={`Metamask`}
          img={`/elements/74263ff26820cd0d895968e3b55e8902.svg`}
          iconSize={50}
        />
      </div>
      <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
        <WalletOption name={`iSunOne`} img={`/elements/i_sun_one.svg`} iconSize={50} />
      </div>
      <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
        <WalletOption name={`imToken`} img={`/elements/path_25918.svg`} iconSize={50} />
      </div>
      <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
        <WalletOption name={`Coinbase`} img={`/elements/18060234@2x.png`} iconSize={50} />
      </div>
      <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
        <WalletOption name={`Trust`} img={`/elements/twt@2x.png`} iconSize={50} />
      </div>
      <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
        <WalletOption name={`Rainbow`} img={`/elements/unnamed@2x.png`} iconSize={50} />
      </div>
      <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
        <WalletOption name={`Houbi`} img={`/elements/logo@2x.png`} iconSize={50} />
      </div>
      <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
        <WalletOption name={`Coin98`} img={`/elements/coin98_c98_logo@2x.png`} iconSize={50} />
      </div>
      <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
        <WalletOption
          name={`TokenPocket`}
          img={`/elements/tokenpocket_wallet_logo@2x.png`}
          iconSize={50}
        />
      </div>
      <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
        <WalletOption
          onClick={walletconnectOptionClickHandler}
          name={`WalletConnect`}
          img={`/elements/walletconnect@2x.png`}
          iconSize={50}
        />
      </div>
      <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
        <WalletOption name={`BitKeep`} img={`/elements/path_25917.svg`} iconSize={45} />
      </div>
      <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
        <WalletOption name={`Others`} img={`/elements/wallet@2x.png`} iconSize={50} />
      </div>
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

  const searchingSection = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative h-160px w-160px pt-10">
        <Lottie animationData={searching} />
      </div>
      <p className="pt-20 text-center text-sm text-white lg:text-lg">
        {t('WALLET_PANEL.SEARCHING')}
      </p>
    </div>
  );

  const searchingModal = (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative my-6 mx-20px w-auto max-w-xl md:mx-auto">
          {/*content & panel*/}
          <div className="relative flex w-full flex-col items-center rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none">
            {/*header*/}
            <div className="mx-auto flex items-start rounded-t pt-10">
              <h3 className="my-4 mx-auto text-xl font-semibold leading-tight text-lightWhite lg:mt-2 lg:text-4xl">
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
            <div className="relative mx-50px flex-auto pt-1 md:px-4 md:pb-4">
              <div className="my-4 text-lg leading-relaxed text-white">
                {/* {walletOptionsSection} */}
                {searchingSection}
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b p-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-30 bg-black opacity-25"></div>
    </>
  );

  const failed = () => {
    globalCtx.dataFailedModalHandler({
      modalTitle: t('POSITION_MODAL.OPEN_POSITION_TITLE'),
      failedTitle: t('POSITION_MODAL.FAILED_TITLE'),
      failedMsg: t('POSITION_MODAL.FAILED_REASON_FAILED_TO_OPEN'),
    });

    globalCtx.visibleFailedModalHandler();
  };

  const displayedPanel = () => {
    searchingModal;
  };

  const isDisplayedWalletPanel = panelVisible ? (
    <>
      {searchingModal}
      {/* {walletPanel} */}
      {/* {failed()} */}
    </>
  ) : null;

  return <>{isDisplayedWalletPanel}</>;
}

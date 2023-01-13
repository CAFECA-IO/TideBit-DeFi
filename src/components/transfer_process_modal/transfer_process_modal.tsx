import Lottie from 'lottie-react';
import bigConnectingAnimation from '../../../public/animation/lf30_editor_qlduo5gq.json';
import successfulAnimation from '../../../public/animation/processing-success.json';
import canceledAnimation from '../../../public/animation/lf30_editor_frrs7znj.json';
import failedAnimation from '../../../public/animation/Lottie_Main_Comp.json';
import {ImCross} from 'react-icons/im';
import useOuterClick from '../../lib/hooks/use_outer_click';
import {useState, useContext} from 'react';
import {MdKeyboardArrowDown, MdKeyboardArrowRight} from 'react-icons/md';
import RippleButton from '../ripple_button/ripple_button';
// import {TRANSFER_OPTIONS} from '../../constants/display';
import {MarketContext} from '../../lib/contexts/market_context';

interface ITransferProcessModal {
  transferType: 'deposit' | 'withdraw';
  userAvailableBalance: number;
  transferStep: 'form' | 'loading' | 'success' | 'cancellation' | 'fail';
  modalVisible: boolean;
  modalClickHandler: () => void;
  getSubmissionState: (props: 'success' | 'cancellation' | 'fail') => void;
  transferOptions: ITransferOptions[];
  // transferProcessStep: string;
  // modalRef?: React.RefObject<HTMLDivElement>;
  // modalVisible?: boolean;
  // clickHandler?: () => void;
}

export interface ITransferOptions {
  // [key: string]: {
  label: string;
  content: string;
  // icon: string;
  // fee: number;
}

export const TRANSFER_PROCESS_MODAL_STEP_CLASSES = {
  form: 'form',
  loading: 'loading',
  success: 'success',
  cancellation: 'cancellation',
  fail: 'fail',
};

// export const TRANSFER_PROCESS_MODAL_STEP_CLASSES = {
//   deposit: {
//     form: 'deposit-form',
//     loading: 'deposit-loading',
//     success: 'deposit-success',
//     cancellation: 'deposit-cancellation',
//     fail: 'deposit-fail',
//   },
//   withdraw: {
//     form: 'withdraw-form',
//     loading: 'withdraw-loading',
//     success: 'withdraw-success',
//     cancellation: 'withdraw-cancellation',
//     fail: 'withdraw-fail',
//   },
// };

const TransferProcessModal = ({
  transferType,
  userAvailableBalance,
  transferStep,
  modalVisible,
  modalClickHandler,
  getSubmissionState,
  transferOptions: transferOptions,
  ...otherProps
}: ITransferProcessModal) => {
  // const {transferOptions, TRANSFER_OPTIONS_MARKET} = useContext(MarketContext);
  // console.log('test options in modal:', transferOptions);

  // const [modalVisible, setModalVisible] = useState(true);

  const [showCryptoMenu, setShowCryptoMenu] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(transferOptions[0]);
  const [amountInput, setAmountInput] = useState<number>();
  const [showWarning, setShowWarning] = useState(false);

  const regex = /^\d*\.?\d{0,2}$/;

  // const modalClickHandler = () => {
  //   setModalVisible(!modalVisible);
  // };

  // TODO: i18n
  const displayedModalTitle = transferType === 'deposit' ? 'Deposit' : 'Withdraw';

  const cryptoMenuClickHandler = () => {
    setShowCryptoMenu(!showCryptoMenu);
  };

  const maxClickHandler = () => {
    setAmountInput(userAvailableBalance);
  };

  const passSubmissionStateHandler = (props: 'success' | 'cancellation' | 'fail') => {
    getSubmissionState(props);
  };

  // TODO: send withdraw / deposit request
  const submitClickHandler = () => {
    // console.log('select cypto:', selectedCrypto);
    // console.log('amount:', amountInput);

    if (amountInput === 0 || amountInput === undefined) {
      setShowWarning(true);
      return;
    }

    setShowWarning(false);

    setTimeout(() => {
      passSubmissionStateHandler('success');
    }, 1000);
  };

  const amountOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (regex.test(value)) {
      // // TODO: 讓 input 不能變成 '01' 的條件式
      // if (Number(value) >= userAvailableBalance || Number(value) <= 0) {
      //   return;
      // }

      // // No upperlimit in deposit modal
      // if (modalType === 'Deposit') {
      //   setAmountInput(Number(value));
      //   return;
      // }

      // Upperlimit in withdraw modal
      if (Number(value) > userAvailableBalance) {
        setAmountInput(Number(userAvailableBalance));
        return;
      }

      setAmountInput(Number(value));
    }
  };

  const showMenu = showCryptoMenu ? 'block' : 'invisible';

  const formButton =
    transferType === 'deposit' ? (
      <p className="flex items-center space-x-3 text-center">
        {displayedModalTitle}{' '}
        <span className="ml-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14.693"
            height="15"
            viewBox="0 0 14.693 15"
          >
            <g fill="#fff" data-name="Group 14962">
              <path
                d="M14.466 47.8h-1.4a.227.227 0 00-.227.227v1.993H1.856v-1.989a.227.227 0 00-.227-.227H.227a.227.227 0 00-.227.227v3.624a.227.227 0 00.227.227h14.239a.227.227 0 00.227-.227v-3.624a.227.227 0 00-.227-.227"
                data-name="Path 1387"
                transform="translate(0 -36.883)"
              ></path>
              <path
                d="M26.035 1.725h-4.4a.265.265 0 01-.265-.265V.265A.265.265 0 0121.639 0h4.4a.265.265 0 01.261.265v1.2a.265.265 0 01-.265.265"
                data-name="Path 1388"
                transform="translate(-16.491)"
              ></path>
              <path
                d="M16.177 15.645l-2.546 2.984a.673.673 0 01-.913 0l-2.546-2.984-2.546-2.985c-.2-.238.051-.536.457-.536h2.669V9.659a.227.227 0 01.227-.227h4.468a.227.227 0 01.227.227v2.465h2.593c.406 0 .66.3.457.536z"
                data-name="Path 1389"
                transform="translate(-5.828 -7.277)"
              ></path>
            </g>
          </svg>
        </span>
      </p>
    ) : (
      <p className="flex items-center space-x-3 text-center">
        {displayedModalTitle} {/* {transferProcessStep.} */}
        <span className="ml-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14.693"
            height="15"
            data-name="Group 14962"
            viewBox="0 0 14.693 15"
          >
            <path
              fill="#fff"
              d="M14.466 47.8h-1.4a.227.227 0 00-.227.227v1.993H1.856v-1.989a.227.227 0 00-.227-.227H.227a.227.227 0 00-.227.227v3.624a.227.227 0 00.227.227h14.239a.227.227 0 00.227-.227v-3.624a.227.227 0 00-.227-.227"
              data-name="Path 1387"
              transform="translate(0 -36.883)"
            ></path>
            <path
              fill="#fff"
              d="M26.036 0h-4.4a.265.265 0 00-.265.265v1.2a.265.265 0 00.265.265h4.4a.265.265 0 00.264-.27V.265A.265.265 0 0026.036 0"
              data-name="Path 1388"
              transform="translate(-16.491 9.805)"
            ></path>
            <path
              fill="#fff"
              d="M16.178 12.595l-2.547-2.984a.673.673 0 00-.913 0l-2.546 2.984-2.546 2.984c-.2.238.051.536.457.536h2.67v2.465a.227.227 0 00.227.227h4.469a.227.227 0 00.227-.227v-2.465h2.593c.406 0 .66-.3.457-.536z"
              data-name="Path 1389"
              transform="translate(-5.828 -9.432)"
            ></path>
          </svg>
        </span>
      </p>
    );

  const formStyle = showCryptoMenu ? 'ring-1 ring-tidebitTheme' : '';

  const rotationStyle = showCryptoMenu ? ' -rotate-90' : 'rotate-0';

  const fadeStyle = showCryptoMenu ? 'opacity-100' : 'opacity-0';

  const warningStyle = showWarning ? 'block' : 'invisible';

  const avaliableCryptoMenu = transferOptions.map(item => {
    return (
      <li
        key={item.label}
        onClick={() => {
          cryptoItemClickHandler(item);
        }}
      >
        <p className="mx-3 my-1 block rounded px-5 py-2 text-base hover:cursor-pointer hover:bg-darkGray5">
          {item.label}
        </p>
      </li>
    );
  });

  const cryptoItemClickHandler = (target: {label: string; content: string}) => {
    // const {label} = target;
    // console.log('target', {target});
    // console.log('label', {label});
    setSelectedCrypto(target);
    cryptoMenuClickHandler();
  };

  const formContent = (
    <div className="relative flex-auto pt-1">
      <div className="text-lg leading-relaxed text-lightWhite">
        <div className="flex-col justify-center text-center">
          {/* ----------Type input---------- */}
          <div className="mx-20 pt-16 text-start">
            <p className="text-sm text-lightGray4">Asset</p>
            <div className="hover:cursor-pointer" onClick={cryptoMenuClickHandler}>
              <div className={`${formStyle} flex rounded-md bg-darkGray8`}>
                <div className={`z-50 flex items-center space-x-2 pl-2`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#53ae94"
                      d="M10 0A10 10 0 110 10 10 10 0 0110 0"
                      data-name="Path 285"
                    ></path>
                    <path
                      fill="#fff"
                      d="M400.4 495.094v-1.488h3.4v-2.266h-9.263v2.267h3.4v1.486c-2.765.127-4.844.675-4.844 1.331s2.08 1.2 4.844 1.331v4.765h2.46v-4.765c2.76-.127 4.835-.675 4.835-1.33s-2.075-1.2-4.835-1.33m0 2.256c-.069 0-.426.026-1.22.026-.635 0-1.081-.018-1.239-.026-2.443-.108-4.266-.534-4.266-1.043s1.824-.934 4.266-1.042v1.661c.16.011.618.038 1.249.038.759 0 1.14-.032 1.21-.038v-1.661c2.438.109 4.257.534 4.257 1.042s-1.82.933-4.257 1.042"
                      data-name="Path 286"
                      transform="translate(-389.169 -486.427)"
                    ></path>
                  </svg>

                  <p className="w-60px text-lg text-lightWhite">{selectedCrypto?.label}</p>
                </div>
                {/* TODO: input search */}
                <input
                  className="w-150px bg-darkGray8 py-2 pl-3 text-sm text-lightGray hover:cursor-pointer focus:outline-none focus:ring-0"
                  type="text"
                  placeholder="Tether"
                  disabled
                  onFocus={() => {
                    // console.log('focusing');
                  }}
                  value={selectedCrypto?.content}
                />

                <button
                  type="button"
                  className="animate-openMenu pl-2"
                  onClick={cryptoMenuClickHandler}
                >
                  <MdKeyboardArrowDown
                    className={`transition-all duration-300 ${rotationStyle}`}
                    size={30}
                  />
                  {/* {showCryptoMenu ? (
                    <MdKeyboardArrowRight className="text-blue-300" size={30} />
                  ) : (
                    <MdKeyboardArrowDown
                      className={`text-blue-300 ${rotationStyle}`}
                      size={30}
                    />
                  )} */}
                </button>
              </div>
            </div>
          </div>

          {/* ----------Crypto Menu---------- */}
          <div
            id="dropdownIcon"
            className={`absolute top-125px right-20 z-10 ${showMenu} ${fadeStyle} w-290px divide-y divide-gray-600 rounded bg-darkGray8 shadow transition-all duration-100`}
          >
            <ul
              className="h-320px overflow-y-scroll py-1 text-start text-sm text-gray-200"
              aria-labelledby="dropdownMenuIconButton"
            >
              {avaliableCryptoMenu}
            </ul>
            {/* <div className="py-1">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Separated link
              </a>
            </div> */}
          </div>

          {/* ----------Amount input---------- */}
          <div className="mx-20 pt-12 text-start">
            <p className="text-sm text-lightGray4">Amount</p>
            {/* <div className="max-w-xl bg-darkGray8">Tether</div> */}
            <div className="flex rounded-md bg-darkGray8">
              <input
                className="w-250px rounded-md bg-darkGray8 py-2 pl-3 text-sm text-white focus:outline-none focus:ring-0"
                type="number"
                placeholder=""
                value={amountInput}
                onChange={amountOnChangeHandler}
              />

              <button
                type="button"
                className="mx-1 mr-1 text-xs text-lightWhite hover:cursor-default"
              >
                USDT
              </button>
              <button
                type="button"
                onClick={maxClickHandler}
                className="my-1 mx-1 rounded-sm bg-lightGray3 px-2 text-xs text-white hover:bg-lightGray3/80"
              >
                MAX
              </button>
              {/* {modalType === 'Withdraw' && (
                <button
                  type="button"
                  onClick={maxClickHandler}
                  className="my-1 mx-1 rounded-sm bg-lightGray3 px-2 text-xs text-white hover:bg-lightGray3/80"
                >
                  MAX
                </button>
              )} */}
            </div>

            <div className="flex justify-between">
              <p className={`${warningStyle} pt-3 text-end text-sm tracking-wide text-lightRed`}>
                Invalid input
              </p>

              <p className="pt-3 text-end text-sm tracking-wide">
                Available: <span className="text-tidebitTheme">{userAvailableBalance}</span> USDT
              </p>
            </div>
          </div>

          <div>
            <RippleButton
              onClick={submitClickHandler}
              buttonType="button"
              className="mt-16 rounded border-0 bg-tidebitTheme py-2 px-10 text-base text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none"
            >
              {formButton}
            </RippleButton>
          </div>
        </div>
      </div>
    </div>
  );

  const loadingContent = (
    <div className="relative flex-auto pt-1">
      <div className="text-lg leading-relaxed text-lightWhite">
        <div className="flex-col justify-center text-center">
          <Lottie className="ml-60px w-400px pt-5" animationData={bigConnectingAnimation} />
          <div className="mt-3 text-lg">Confirm the transaction</div>
        </div>
      </div>
    </div>
  );

  const successContent = (
    <div className="relative flex-auto pt-1">
      <div className="text-lg leading-relaxed text-lightWhite">
        <div className="flex-col justify-center text-center">
          <Lottie className="ml-120px w-200px pt-5 pb-5" animationData={successfulAnimation} />
          <div className="mt-2 mb-2 text-base">
            <p>Transaction succeeded</p>
            <p>
              It will take <span className="text-tidebitTheme">3 - 5</span> mins to finish all the
              process
            </p>
          </div>
          <div>
            <RippleButton
              buttonType="button"
              className="mt-4 rounded border-0 bg-tidebitTheme py-2 px-24 text-base text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none"
            >
              View on Etherscan
            </RippleButton>
          </div>
        </div>
      </div>
    </div>
  );

  const cancellationContent = (
    <div className="relative flex-auto pt-1">
      <div className="text-lg leading-relaxed text-lightWhite">
        <div className="flex-col justify-center text-center">
          <Lottie className="ml-120px w-220px pt-10" animationData={canceledAnimation} />
          <div className="mt-10 text-lg">Transaction canceled</div>
        </div>
      </div>
    </div>
  );

  const failContent = (
    <div className="relative flex-auto pt-1">
      <div className="text-lg leading-relaxed text-lightWhite">
        <div className="flex-col items-center justify-center text-center">
          <Lottie className="ml-130px w-180px pt-10" animationData={failedAnimation} />
          <div className="mx-16 mt-10 mb-3 bg-lightRed">
            <p className="text-lg">Failed</p>

            <p className="bg-darkGray1/50 py-4 px-2 text-start text-xs leading-4 tracking-wide">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt ut labore et
            </p>
          </div>
          <div>
            <RippleButton
              buttonType="button"
              className="mt-4 rounded border-0 bg-tidebitTheme py-2 px-24 text-base text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none"
            >
              View on Etherscan
            </RippleButton>
          </div>
        </div>
      </div>
    </div>
  );

  const displayedContent = formContent;

  const contentHandler = (type: string) => {
    return {
      [TRANSFER_PROCESS_MODAL_STEP_CLASSES.form]: formContent,
      [TRANSFER_PROCESS_MODAL_STEP_CLASSES.loading]: loadingContent,
      [TRANSFER_PROCESS_MODAL_STEP_CLASSES.success]: successContent,
      [TRANSFER_PROCESS_MODAL_STEP_CLASSES.cancellation]: cancellationContent,
      [TRANSFER_PROCESS_MODAL_STEP_CLASSES.fail]: failContent,
    }[type];
  };

  // console.log('content handler:', contentHandler(TRANSFER_PROCESS_MODAL_TYPE_CLASSES.deposit.form));

  const isDisplayedModal = modalVisible ? (
    <>
      {/*  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">*/}
      {/*  overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none */}
      {/* position: relative; top: 50%; left: 50%; transform: translate(-50%, -50%) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        {/* The position of the modal */}
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {' '}
          {/*content & panel*/}
          <div
            id="transferProcessModal"
            // ref={modalRef}
            className="relative flex h-480px w-450px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-6">
              <h3 className="mt-2 w-full text-center text-4xl font-normal text-lightWhite">
                {displayedModalTitle}
                {/* {(transferProcessStep = 'deposit-' ? 'Deposit' : 'Withdraw')} */}
              </h3>
              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                  <ImCross onClick={modalClickHandler} />
                </span>
              </button>
            </div>
            {/*body*/}
            {/* {displayedContent} */}
            {contentHandler(transferStep)}
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b p-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  ) : null;

  return <div>{isDisplayedModal}</div>;
};

export default TransferProcessModal;

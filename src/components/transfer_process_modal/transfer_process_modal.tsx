import Lottie from 'lottie-react';
import bigConnectingAnimation from '../../../public/animation/lf30_editor_qlduo5gq.json';
import successfulAnimation from '../../../public/animation/processing-success.json';
import canceledAnimation from '../../../public/animation/lf30_editor_frrs7znj.json';
import failedAnimation from '../../../public/animation/Lottie_Main_Comp.json';
import {ImCross} from 'react-icons/im';
import useOuterClick from '../../lib/hooks/use_outer_click';
import {useState} from 'react';
import {MdKeyboardArrowDown, MdKeyboardArrowRight} from 'react-icons/md';
import RippleButton from '../ripple_button/ripple_button';

interface ITransferProcessModal {
  modalType: 'Deposit' | 'Withdraw';
  // modalRef?: React.RefObject<HTMLDivElement>;
  // modalVisible?: boolean;
  // clickHandler?: () => void;
}

export const TRANSFER_PROCESS_MODAL_TYPE_CLASSES = {
  deposit: {
    form: 'deposit-form',
    loading: 'deposit-loading',
    success: 'deposit-success',
    cancellation: 'deposit-cancellation',
    fail: 'deposit-fail',
  },
  withdraw: {
    form: 'withdraw-form',
    loading: 'withdraw-loading',
    success: 'withdraw-success',
    cancellation: 'withdraw-cancellation',
    fail: 'withdraw-fail',
  },
};

const TransferProcessModal = ({modalType, ...otherProps}: ITransferProcessModal) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [showCryptoMenu, setShowCryptoMenu] = useState(false);

  // const {
  //   targetRef: modalRef,
  //   componentVisible: modalVisible,
  //   setComponentVisible: setModalVisible,
  // } = useOuterClick(true);

  const clickHandler = () => {
    setModalVisible(!modalVisible);
  };

  const cryptoMenuClickHandler = () => {
    setShowCryptoMenu(!showCryptoMenu);
  };

  const showMenu = showCryptoMenu ? 'block' : 'invisible';

  const formButton =
    modalType === 'Deposit' ? (
      <p className="flex items-center space-x-3 text-center">
        {modalType}{' '}
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
        {modalType}{' '}
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

  const formContent = (
    <div className="relative flex-auto pt-1">
      <div className="text-lg leading-relaxed text-lightWhite">
        <div className="flex-col justify-center text-center">
          {/* <Lottie className="ml-1/6 w-350px pt-10" animationData={bigConnectingAnimation} /> */}

          {/* <form>
            <div className="flex">
              <label
                htmlFor="search-dropdown"
                className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your Email
              </label>
              <button
                id="dropdown-button"
                data-dropdown-toggle="dropdown"
                className="z-10 inline-flex shrink-0 items-center rounded-l-lg border border-gray-300 bg-gray-100 py-2.5 px-4 text-center text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                type="button"
              >
                All categories{' '}
                <svg
                  aria-hidden="true"
                  className="ml-1 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
              <div
                id="dropdown"
                className="z-10 hidden w-44 divide-y divide-gray-100 rounded bg-white shadow dark:bg-gray-700"
              >
                <ul
                  className="py-1 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdown-button"
                >
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Shopping
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Images
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      News
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Finance
                    </a>
                  </li>
                </ul>
              </div>
              <div className="relative w-full">
                <input
                  type="search"
                  id="search-dropdown"
                  className="dark:placeholder:gray-400 z-20 block w-full rounded-r-lg border border-l-2 border-gray-300 border-l-gray-100 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
                  placeholder="Search"
                  required
                />
                <button
                  type="submit"
                  className="absolute top-0 right-0 rounded-r-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </form> */}

          <div className="mx-20 pt-16 text-start">
            <p className="text-sm text-lightGray4">Asset</p>

            <div>
              <div className={`${formStyle} flex max-w-xl rounded-md bg-darkGray8`}>
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

                  <p className="text-lg text-lightWhite">USDT</p>
                </div>

                <input
                  className="bg-darkGray8 py-2 pl-3 text-sm text-lightGray focus:outline-none focus:ring-0"
                  type="text"
                  placeholder="Tether"
                  disabled
                />

                <button
                  type="button"
                  className="animate-openMenu pl-3"
                  onClick={cryptoMenuClickHandler}
                >
                  {showCryptoMenu ? (
                    <MdKeyboardArrowRight size={30} />
                  ) : (
                    <MdKeyboardArrowDown size={30} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mx-20 pt-12 text-start">
            <p className="text-sm text-lightGray4">Amount</p>
            {/* <div className="max-w-xl bg-darkGray8">Tether</div> */}
            <div className="flex rounded-md bg-darkGray8">
              <input
                className="w-250px rounded-md bg-darkGray8 py-2 pl-3 text-sm text-lightGray focus:outline-none focus:ring-0"
                type="number"
                placeholder=""
              />

              <button className="mx-1 text-xs text-lightWhite">USDT</button>
              <button className="my-1 rounded-sm bg-lightGray3 px-2 text-xs text-white">MAX</button>
            </div>

            <p className="pt-3 text-end text-sm tracking-wide">
              Available: <span className="text-tidebitTheme">100.34</span> USDT
            </p>
          </div>

          {/* <!-- Dropdown menu --> */}
          <div
            id="dropdownDots"
            className={`absolute top-125px right-20 z-10 ${showMenu} w-290px divide-y divide-gray-100 rounded bg-white shadow dark:divide-gray-600 dark:bg-darkGray8`}
          >
            <ul
              className="py-1 text-start text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownMenuIconButton"
            >
              <li>
                <p className="block px-8 py-3 text-base hover:cursor-pointer hover:bg-darkGray8">
                  BTC
                </p>
              </li>
              <li>
                <p className="block px-8 py-3 text-base hover:cursor-pointer hover:bg-darkGray8">
                  ETH
                </p>
              </li>
              <li>
                <p className="block px-8 py-3 text-base hover:cursor-pointer hover:bg-darkGray8">
                  USDT
                </p>
              </li>
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

          <div>
            <RippleButton
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
          <Lottie className="ml-1/6 w-350px pt-10" animationData={bigConnectingAnimation} />
          <div className="mt-5 text-lg">Confirm the transaction</div>
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

  // const contentHandler = (type: string) => {};

  const isDisplayedModal = modalVisible ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {/*content & panel*/}
          <div
            id="connectModal"
            // ref={modalRef}
            className="relative flex h-480px w-450px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-6">
              <h3 className="mt-2 w-full text-center text-4xl font-normal text-lightWhite">
                {modalType}
              </h3>
              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                  <ImCross onClick={clickHandler} />
                </span>
              </button>
            </div>
            {/*body*/}
            {displayedContent}
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

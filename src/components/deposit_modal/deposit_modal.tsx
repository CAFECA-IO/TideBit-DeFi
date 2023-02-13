import React, {useContext, useState} from 'react';
import RippleButton from '../ripple_button/ripple_button';
import {MarketContext} from '../../contexts/market_context';
import {MdKeyboardArrowDown} from 'react-icons/md';
import {ImCross} from 'react-icons/im';
import {ICryptocurrency} from '../../interfaces/tidebit_defi_background/cryptocurrency';
import Image from 'next/image';

interface IDepositModal {
  // transferType: 'deposit' | 'withdraw';
  // userAvailableBalance: number;
  // transferStep: 'form' | 'loading' | 'success' | 'cancellation' | 'fail';
  modalVisible: boolean;
  modalClickHandler: () => void;
  getSubmissionState: (props: 'success' | 'cancellation' | 'fail') => void;
  // transferOptions: ITransferOptions[];
  getTransferData: (props: {asset: string; amount: number}) => void;
  submitHandler: (props: {asset: string; amount: number}) => void;
}

// TODO: SVG icon from Context
const DepositModal = ({
  // transferType, // [to be removed]globalContext
  // transferStep, // [to be removed]
  modalVisible,
  modalClickHandler,
  getSubmissionState, // [process] to be removed
  getTransferData, // pass data to parent component
  submitHandler, // submit information from parent component
  ...otherProps
}: IDepositModal) => {
  // TODO: [UserContext] deposit: userCtx.walletBalance, withdraw: userCtx.balance?.available
  const userAvailableBalance = 92;
  const {availableTransferOptions} = useContext(MarketContext);

  // const {user} = useContext(UserContext);
  // console.log('availableTransferOptions: ', availableTransferOptions);

  const [showCryptoMenu, setShowCryptoMenu] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(availableTransferOptions[0]);
  const [amountInput, setAmountInput] = useState<number | undefined>();
  const [showWarning, setShowWarning] = useState(false);

  // console.log('selectedCrypto: ', selectedCrypto);

  const regex = /^\d*\.?\d{0,2}$/;

  // const modalClickHandler = () => {
  //   setModalVisible(!modalVisible);
  // };

  const cryptoMenuClickHandler = () => {
    setShowCryptoMenu(!showCryptoMenu);
  };

  const maxClickHandler = () => {
    setAmountInput(userAvailableBalance);
    getTransferData({asset: selectedCrypto.symbol, amount: userAvailableBalance});
  };

  const passSubmissionStateHandler = (props: 'success' | 'cancellation' | 'fail') => {
    getSubmissionState(props);
  };

  // TODO: send withdraw / deposit request
  const submitClickHandler = () => {
    // console.log('select cwwypto:', selectedCrypto);
    // console.log('amount:', amountInput);

    if (amountInput === 0 || amountInput === undefined) {
      setShowWarning(true);
      return;
    }

    setShowWarning(false);

    submitHandler({asset: selectedCrypto.symbol, amount: amountInput});

    // console.log('in modal, after clicking submit: ', selectedCrypto.symbol, amountInput);

    setAmountInput(undefined);
    // setTimeout(() => {
    //   passSubmissionStateHandler('loading');
    // }, 500);
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
        getTransferData({asset: selectedCrypto.symbol, amount: Number(userAvailableBalance)});

        return;
      }

      setAmountInput(Number(value));
      getTransferData({asset: selectedCrypto.symbol, amount: Number(value)});
    }
  };

  const showMenu = showCryptoMenu ? 'block' : 'invisible';

  const formButton = (
    <p className="flex items-center space-x-3 text-center">
      Deposit
      <span className="ml-3">
        <Image src="/elements/group_149621.svg" width={15} height={15} alt="withdraw icon" />
      </span>
    </p>
  );

  const formStyle = showCryptoMenu ? 'ring-1 ring-tidebitTheme' : '';

  const rotationStyle = showCryptoMenu ? ' -rotate-90' : 'rotate-0';

  const fadeStyle = showCryptoMenu ? 'opacity-100' : 'opacity-0';

  const warningStyle = showWarning ? 'block' : 'invisible';

  const avaliableCryptoMenu = availableTransferOptions.map(item => {
    return (
      <li
        key={item.symbol}
        onClick={() => {
          cryptoItemClickHandler(item);
        }}
      >
        <p className="mx-3 my-1 block rounded px-5 py-2 text-base hover:cursor-pointer hover:bg-darkGray5">
          {item.name}
        </p>
      </li>
    );
  });

  const cryptoItemClickHandler = (target: ICryptocurrency) => {
    // const {symbol} = target;
    // console.log('target', {target});
    // console.log('symbol', {symbol});
    setAmountInput(undefined);
    setSelectedCrypto(target);
    cryptoMenuClickHandler();

    getTransferData({asset: target.symbol, amount: amountInput ?? 0});
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
                  {/* Targeted Crypto icon */}
                  {selectedCrypto.icon === '' ? (
                    <></>
                  ) : (
                    <Image src={selectedCrypto.icon} width={20} height={20} alt="crypto icon" />
                  )}

                  <p className="w-60px text-lg text-lightWhite">{selectedCrypto?.symbol}</p>
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
                  value={selectedCrypto?.name}
                />

                <button
                  type="button"
                  className="absolute top-90px right-90px animate-openMenu"
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
                value={amountInput === undefined ? '' : amountInput}
                onChange={amountOnChangeHandler}
              />

              <button
                type="button"
                className="mx-1 mr-1 text-xs text-lightWhite hover:cursor-default"
              >
                {selectedCrypto.symbol}
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
                Available in MetaMask:{' '}
                <span className="text-tidebitTheme">{userAvailableBalance}</span>{' '}
                {selectedCrypto.symbol}
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
                Deposit
              </h3>
              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                  <ImCross onClick={modalClickHandler} />
                </span>
              </button>
            </div>
            {/*body*/}
            {formContent}
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

export default DepositModal;

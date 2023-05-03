import React, {useContext, useState} from 'react';
import RippleButton from '../ripple_button/ripple_button';
import {MarketContext} from '../../contexts/market_context';
import {MdKeyboardArrowDown} from 'react-icons/md';
import {ImCross} from 'react-icons/im';
import Image from 'next/image';
import {ICryptocurrency} from '../../interfaces/tidebit_defi_background/cryptocurrency';
import {useGlobal} from '../../contexts/global_context';
import useStateRef from 'react-usestateref';
import {getTimestamp, locker, wait} from '../../lib/common';
import {DELAYED_HIDDEN_SECONDS} from '../../constants/display';
import {UserContext} from '../../contexts/user_context';
import {OrderType} from '../../constants/order_type';
import {useTranslation} from 'react-i18next';
import {Code} from '../../constants/code';

type TranslateFunction = (s: string) => string;
interface IWithdrawalModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  getSubmissionState: (props: 'success' | 'cancellation' | 'fail') => void;
  getTransferData: (props: {asset: string; amount: number}) => void;
  submitHandler: (props: {asset: ICryptocurrency; amount: number}) => void;
}

const WithdrawalModal = ({
  modalVisible,
  modalClickHandler,
  getSubmissionState, // [process]
  getTransferData, // pass data to parent component
  submitHandler, // submit information from parent component
  ...otherProps
}: IWithdrawalModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);

  const {withdrawCryptocurrencies} = useContext(MarketContext);
  const globalCtx = useGlobal();

  const [showCryptoMenu, setShowCryptoMenu, showCryptoMenuRef] = useStateRef(false);
  const [selectedCrypto, setSelectedCrypto, selectedCryptoRef] = useStateRef(
    withdrawCryptocurrencies[0]
  );
  const [amountInput, setAmountInput, amountInputRef] = useStateRef<number | undefined>();

  const userAvailableBalance = userCtx.getBalance(selectedCrypto.symbol)?.available ?? 0;

  const regex = /^\d*\.?\d{0,2}$/;

  /* Info: (20230427 - Julian) toastId by minimizedModal
   * ToDo: (20230427 - Julian) 改良取得id的方式
   */
  const toastId = `${t('D_W_MODAL.WITHDRAW')}_LoadingModalMinimized`;

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

  // TODO: send withdrawal request
  const submitClickHandler = async () => {
    if (amountInput === 0 || amountInput === undefined) {
      return;
    }

    submitHandler({asset: selectedCrypto, amount: amountInput});
    const [lock, unlock] = locker('withdrawal_modal.submitClickHandler');

    if (!lock()) return;

    await wait(DELAYED_HIDDEN_SECONDS / 5);
    globalCtx.visibleWithdrawalModalHandler();

    globalCtx.dataLoadingModalHandler({
      modalTitle: t('D_W_MODAL.WITHDRAW'),
      modalContent: t('D_W_MODAL.CONFIRM_CONTENT'),
      isShowZoomOutBtn: true,
    });
    globalCtx.visibleLoadingModalHandler();

    const withdrawOrder = {
      orderType: OrderType.WITHDRAW,
      createTimestamp: getTimestamp(),
      targetAsset: selectedCrypto.symbol,
      to: selectedCrypto.contract,
      targetAmount: amountInput,
      remark: '',
      fee: 0,
    };

    try {
      const result = await userCtx.withdraw(withdrawOrder);
      // TODO: the button URL
      if (result.success) {
        // ToDo: to tell when to show the loading modal with button
        globalCtx.dataLoadingModalHandler({
          modalTitle: t('D_W_MODAL.WITHDRAW'),
          modalContent: t('D_W_MODAL.TRANSACTION_BROADCAST'),
          btnMsg: t('D_W_MODAL.VIEW_ON_BUTTON'),
          btnUrl: '#',
          isShowZoomOutBtn: true,
        });

        // INFO: for UX
        await wait(DELAYED_HIDDEN_SECONDS);

        globalCtx.eliminateAllModals();

        globalCtx.dataSuccessfulModalHandler({
          modalTitle: t('D_W_MODAL.WITHDRAW'),
          modalContent: t('D_W_MODAL.TRANSACTION_SUCCEED'),
          btnMsg: t('D_W_MODAL.VIEW_ON_BUTTON'),
          btnUrl: '#',
        });

        globalCtx.eliminateToasts(toastId);
        globalCtx.visibleSuccessfulModalHandler();
        // TODO: `result.code` (20230316 - Shirley)
      } else if (
        // Info: cancel (20230412 - Shirley)
        result.code === Code.SERVICE_TERM_DISABLE ||
        result.code === Code.WALLET_IS_NOT_CONNECT ||
        result.code === Code.REJECTED_SIGNATURE
      ) {
        globalCtx.eliminateAllModals();

        globalCtx.dataCanceledModalHandler({
          modalTitle: t('D_W_MODAL.WITHDRAW'),
          modalContent: `${t('D_W_MODAL.FAILED_REASON_CANCELED')} (${result.code})`,
        });

        globalCtx.eliminateToasts(toastId);
        globalCtx.visibleCanceledModalHandler();
      } else if (
        result.code === Code.INTERNAL_SERVER_ERROR ||
        result.code === Code.INVAILD_INPUTS
      ) {
        globalCtx.eliminateAllModals();

        globalCtx.dataFailedModalHandler({
          modalTitle: t('D_W_MODAL.WITHDRAW'),
          modalContent: `${t('D_W_MODAL.FAILED_REASON_FAILED_TO_WITHDRAW')} (${result.code})`,
        });

        globalCtx.eliminateToasts(toastId);
        globalCtx.visibleFailedModalHandler();
      }
    } catch (error: any) {
      globalCtx.eliminateAllModals();

      // ToDo: Report error to backend (20230413 - Shirley)
      // Info: Unknown error
      globalCtx.dataFailedModalHandler({
        modalTitle: t('D_W_MODAL.WITHDRAW'),
        modalContent: `${t('D_W_MODAL.FAILED_REASON_FAILED_TO_WITHDRAW')} (${
          Code.UNKNOWN_ERROR_IN_COMPONENT
        })`,
      });

      globalCtx.eliminateToasts(toastId);
      globalCtx.visibleFailedModalHandler();
    }

    unlock();

    setAmountInput(undefined);

    return;
  };

  const amountOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (regex.test(value)) {
      // Upperlimit in withdraw modal
      if (Number(value) > userAvailableBalance) {
        setAmountInput(Number(userAvailableBalance));
        getTransferData({asset: selectedCrypto.symbol, amount: Number(userAvailableBalance)});

        return;
      }

      setAmountInput(Number(value));
      getTransferData({asset: selectedCrypto.symbol, amount: Number(value)});
      return;
    }
  };

  const showMenu = showCryptoMenu ? 'block' : 'invisible';

  const formButton = (
    <p className="flex items-center space-x-3 text-center">
      {t('D_W_MODAL.WITHDRAW')}
      <span className="ml-3">
        <Image src="/elements/group_14962.svg" width={15} height={15} alt="withdraw icon" />
      </span>
    </p>
  );

  const formStyle = showCryptoMenu ? 'ring-1 ring-tidebitTheme' : '';

  const rotationStyle = showCryptoMenu ? ' -rotate-90' : 'rotate-0';

  const fadeStyle = showCryptoMenu ? 'opacity-100' : 'opacity-0';

  const avaliableCryptoMenu = withdrawCryptocurrencies.map(item => {
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
    setAmountInput(undefined);
    setSelectedCrypto(target);
    cryptoMenuClickHandler();

    getTransferData({asset: target.symbol, amount: amountInput ?? 0});
  };

  const formContent = (
    <div className="relative flex-auto pt-0">
      <div className="text-lg leading-relaxed text-lightWhite">
        <div className="flex-col justify-center text-center">
          {/* ----------Type input---------- */}
          <div className="mx-6 pt-8 text-start">
            <p className="text-sm text-lightGray4">{t('D_W_MODAL.ASSET')}</p>
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
                  className="w-150px rounded-md bg-darkGray8 py-2 pl-0 text-sm text-lightGray hover:cursor-pointer focus:outline-none focus:ring-0"
                  type="text"
                  placeholder={selectedCrypto.name}
                  disabled
                  value={selectedCrypto?.name}
                />

                <button
                  type="button"
                  className="absolute right-36px top-55px animate-openMenu"
                  onClick={cryptoMenuClickHandler}
                >
                  <MdKeyboardArrowDown
                    className={`transition-all duration-300 ${rotationStyle}`}
                    size={30}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* ----------Crypto Menu---------- */}
          <div
            id="dropdownIcon"
            className={`absolute top-90px right-6 z-10 ${showMenu} ${fadeStyle} w-250px divide-y divide-gray-600 rounded bg-darkGray8 shadow transition-all duration-100`}
          >
            <ul
              className="h-320px overflow-y-scroll py-1 text-start text-sm text-gray-200"
              aria-labelledby="dropdownMenuIconButton"
            >
              {avaliableCryptoMenu}
            </ul>
          </div>

          {/* ----------Amount input---------- */}
          <div className="mx-6 pt-12 text-start">
            <p className="text-sm text-lightGray4">{t('D_W_MODAL.AMOUNT')}</p>
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
                className="my-1 mx-1 whitespace-nowrap rounded-sm bg-lightGray3 px-2 text-xs text-white hover:bg-lightGray3/80"
              >
                {t('D_W_MODAL.MAX')}
              </button>
            </div>

            <div className="flex justify-end">
              <p className="pt-3 text-end text-xs tracking-wide">
                {t('D_W_MODAL.AVAILABLE_ON_TIDEBIT')}:{' '}
                <span className="text-tidebitTheme">{userAvailableBalance}</span>{' '}
                {selectedCrypto.symbol}
              </p>
            </div>
          </div>

          <div className={``}>
            <RippleButton
              disabled={amountInput === 0 || amountInput === undefined}
              onClick={submitClickHandler}
              buttonType="button"
              className={`absolute -bottom-14 mt-0 rounded border-0 bg-tidebitTheme py-2 px-10 text-base text-white transition-colors duration-300 hover:bg-cyan-600 focus:outline-none disabled:bg-lightGray`}
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
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        {/* The position of the modal */}
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {' '}
          {/*content & panel*/}
          <div
            id="withdrawalModal"
            // ref={modalRef}
            className="relative flex h-420px w-296px flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-9">
              <h3 className="mt-2 w-full text-center text-xl font-normal text-lightWhite">
                {t('D_W_MODAL.WITHDRAW')}
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

export default WithdrawalModal;

import React, {useContext, useState} from 'react';
import RippleButton from '../ripple_button/ripple_button';
import {MarketContext} from '../../contexts/market_context';
import {MdKeyboardArrowDown} from 'react-icons/md';
import {ImCross} from 'react-icons/im';
import {ICryptocurrency} from '../../interfaces/tidebit_defi_background/cryptocurrency';
import Image from 'next/image';
import {DELAYED_HIDDEN_SECONDS, UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {useGlobal} from '../../contexts/global_context';
import {useTranslation} from 'react-i18next';
import {getTimestamp, locker, wait} from '../../lib/common';
import {OrderType} from '../../constants/order_type';
import {UserContext} from '../../contexts/user_context';
import {Code} from '../../constants/code';
import useStateRef from 'react-usestateref';
import {ToastTypeAndText} from '../../constants/toast_type';

type TranslateFunction = (s: string) => string;
interface IDepositModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  getSubmissionState: (props: 'success' | 'cancellation' | 'fail') => void;
  getTransferData: (props: {asset: string; amount: number}) => void;
  submitHandler: (props: {asset: ICryptocurrency; amount: number}) => void;
}

const DepositModal = ({
  modalVisible,
  modalClickHandler,
  getSubmissionState, // [process]
  getTransferData, // pass data to parent component
  submitHandler, // submit information from parent component
  ...otherProps
}: IDepositModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {depositCryptocurrencies} = useContext(MarketContext);
  const globalCtx = useGlobal();
  const userCtx = useContext(UserContext);

  const [showCryptoMenu, setShowCryptoMenu, showCryptoMenuRef] = useStateRef(false);
  const [selectedCrypto, setSelectedCrypto, selectedCryptoRef] = useStateRef(
    depositCryptocurrencies[0]
  );
  const [amountInput, setAmountInput] = useState<number | undefined>();

  const userAvailableBalance = userCtx.getWalletBalance(selectedCrypto.symbol)?.balance ?? 0;

  const regex = /^\d*\.?\d{0,2}$/;

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

  // TODO: send deposit request
  const submitClickHandler = async () => {
    if (amountInput === 0 || amountInput === undefined) {
      return;
    }

    submitHandler({asset: selectedCrypto, amount: amountInput});
    const [lock, unlock] = locker('deposit_modal.submitClickHandler');

    if (!lock()) return;

    await wait(DELAYED_HIDDEN_SECONDS / 5);
    globalCtx.visibleDepositModalHandler();

    globalCtx.dataLoadingModalHandler({
      modalTitle: t('D_W_MODAL.DEPOSIT'),
      modalContent: t('D_W_MODAL.CONFIRM_CONTENT'),
      isShowZoomOutBtn: true,
    });
    globalCtx.visibleLoadingModalHandler();

    const depositOrder = {
      orderType: OrderType.DEPOSIT,
      createTimestamp: getTimestamp(),
      targetAsset: selectedCrypto.symbol,
      decimals: selectedCrypto.decimals,
      to: selectedCrypto.contract,
      targetAmount: amountInput,
      remark: '',
      fee: 0,
    };

    try {
      const result = await userCtx.deposit(depositOrder);

      // Deprecate: after Julian confirm result format (20230413 - Shirley)
      // eslint-disable-next-line no-console
      console.log(`userCtx.deposit result:`, result);

      // TODO: for debug
      globalCtx.toast({
        message: 'deposit result: ' + JSON.stringify(result),
        type: ToastTypeAndText.INFO.type,
        typeText: t(ToastTypeAndText.INFO.text),
      });

      // TODO: the button URL
      if (result.success) {
        // ToDo: to tell when to show the loading modal with button
        globalCtx.dataLoadingModalHandler({
          modalTitle: t('D_W_MODAL.DEPOSIT'),
          modalContent: t('D_W_MODAL.TRANSACTION_BROADCAST'),
          btnMsg: t('D_W_MODAL.VIEW_ON_BUTTON'),
          btnUrl: '#',
          isShowZoomOutBtn: true,
        });

        // INFO: for UX
        await wait(DELAYED_HIDDEN_SECONDS);

        globalCtx.eliminateAllModals();

        globalCtx.dataSuccessfulModalHandler({
          modalTitle: t('D_W_MODAL.DEPOSIT'),
          modalContent: t('D_W_MODAL.TRANSACTION_SUCCEED'),
          btnMsg: t('D_W_MODAL.VIEW_ON_BUTTON'),
          btnUrl: '#',
        });

        globalCtx.eliminateToasts('all');
        globalCtx.visibleSuccessfulModalHandler();
      } else if (
        // Info: cancel (20230413 - Shirley)
        result.code === Code.SERVICE_TERM_DISABLE ||
        result.code === Code.WALLET_IS_NOT_CONNECT ||
        result.code === Code.REJECTED_SIGNATURE
      ) {
        globalCtx.eliminateAllModals();

        globalCtx.dataCanceledModalHandler({
          modalTitle: t('D_W_MODAL.DEPOSIT'),
          modalContent: t('D_W_MODAL.FAILED_REASON_CANCELED'),
        });

        globalCtx.eliminateToasts('all');
        globalCtx.visibleCanceledModalHandler();
      } else if (
        result.code === Code.INTERNAL_SERVER_ERROR ||
        result.code === Code.INVAILD_INPUTS
      ) {
        globalCtx.eliminateAllModals();

        globalCtx.dataFailedModalHandler({
          modalTitle: t('D_W_MODAL.DEPOSIT'),
          modalContent: t('D_W_MODAL.FAILED_CONTENT'),
          failedTitle: t('D_W_MODAL.FAILED_TITLE'),
          failedMsg: t('D_W_MODAL.FAILED_REASON_FAILED_TO_DEPOSIT'),
        });

        globalCtx.eliminateToasts('all');
        globalCtx.visibleFailedModalHandler();
      }
    } catch (error: any) {
      globalCtx.eliminateAllModals();

      // ToDo: Report error to backend (20230413 - Shirley)
      // Info: Unknown error
      globalCtx.dataFailedModalHandler({
        modalTitle: t('D_W_MODAL.DEPOSIT'),
        modalContent: t('D_W_MODAL.FAILED_CONTENT'),
        failedTitle: t('D_W_MODAL.FAILED_TITLE'),
        failedMsg: t('D_W_MODAL.FAILED_REASON_FAILED_TO_DEPOSIT'),
      });

      globalCtx.eliminateToasts('all');
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
      {t('D_W_MODAL.DEPOSIT')}
      <span className="ml-3">
        <Image src="/elements/group_149621.svg" width={15} height={15} alt="deposit icon" />
      </span>
    </p>
  );

  const formStyle = showCryptoMenu ? 'ring-1 ring-tidebitTheme' : '';

  const rotationStyle = showCryptoMenu ? ' -rotate-90' : 'rotate-0';

  const fadeStyle = showCryptoMenu ? 'opacity-100' : 'opacity-0';

  const avaliableCryptoMenu = depositCryptocurrencies.map(item => {
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
                  onFocus={() => {
                    // console.log('focusing');
                  }}
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
                {t('D_W_MODAL.AVAILABLE_IN_WALLET')}:{' '}
                <span className="text-tidebitTheme">
                  {userAvailableBalance.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}
                </span>{' '}
                {selectedCrypto.symbol}
              </p>
            </div>
          </div>

          <div className={``}>
            <RippleButton
              // Use the logic directly in the `disabled` attribute instead of `setSubmitDisabled`
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
            id="depositModal"
            // ref={modalRef}
            className="relative flex h-420px w-296px flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-9">
              <h3 className="mt-2 w-full text-center text-xl font-normal text-lightWhite">
                {t('D_W_MODAL.DEPOSIT')}
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

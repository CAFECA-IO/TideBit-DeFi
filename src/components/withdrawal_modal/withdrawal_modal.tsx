import React, {useContext} from 'react';
import RippleButton from '../ripple_button/ripple_button';
import {MarketContext} from '../../contexts/market_context';
import {MdKeyboardArrowDown} from 'react-icons/md';
import {ImCross} from 'react-icons/im';
import Image from 'next/image';
import {
  ICryptocurrency,
  defaultCryptocurrency,
} from '../../interfaces/tidebit_defi_background/cryptocurrency';
import {useGlobal} from '../../contexts/global_context';
import useStateRef from 'react-usestateref';
import {findCodeByReason, getTimestamp, locker, numberFormatted, wait} from '../../lib/common';
import {DELAYED_HIDDEN_SECONDS} from '../../constants/display';
import {UserContext} from '../../contexts/user_context';
import {OrderType} from '../../constants/order_type';
import {useTranslation} from 'next-i18next';
import {Code} from '../../constants/code';
import {ToastId} from '../../constants/toast_id';
import {CustomError} from '../../lib/custom_error';
import {NotificationContext} from '../../contexts/notification_context';

type TranslateFunction = (s: string) => string;
interface IWithdrawalModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  getTransferData: (props: {asset: string; amount: number}) => void;
}

const WithdrawalModal = ({modalVisible, modalClickHandler, getTransferData}: IWithdrawalModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);

  const {withdrawCryptocurrencies} = useContext(MarketContext);
  const globalCtx = useGlobal();

  const [showCryptoMenu, setShowCryptoMenu] = useStateRef(false);
  const [selectedCrypto, setSelectedCrypto] = useStateRef(
    withdrawCryptocurrencies[0] ?? defaultCryptocurrency
  );
  const [amountInput, setAmountInput] = useStateRef<number | undefined>();

  const userAvailableBalance = userCtx.getBalance(selectedCrypto.symbol)?.available ?? 0;

  const regex = /^\d*\.?\d{0,2}$/;

  const cryptoMenuClickHandler = () => {
    setShowCryptoMenu(!showCryptoMenu);
  };

  const maxClickHandler = () => {
    setAmountInput(userAvailableBalance);
    getTransferData({asset: selectedCrypto.symbol, amount: userAvailableBalance});
  };

  // TODO: send withdrawal request
  const submitClickHandler = async () => {
    if (globalCtx.displayedToast(ToastId.WITHDRAW) || globalCtx.visibleLoadingModal) {
      globalCtx.dataWarningModalHandler({
        title: t('POSITION_MODAL.WARNING_UNFINISHED_TITLE'),
        content: t('POSITION_MODAL.WARNING_UNFINISHED_CONTENT'),
        numberOfButton: 1,
        reactionOfButton: t('POSITION_MODAL.WARNING_OK_BUTTON'),
      });
      globalCtx.visibleWarningModalHandler();
    }

    if (amountInput === 0 || amountInput === undefined) {
      return;
    }

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

        globalCtx.eliminateToasts(ToastId.WITHDRAW);
        globalCtx.visibleSuccessfulModalHandler();
        // TODO: `result.code` (20230316 - Shirley)
      } else if (
        // Info: cancel (20230412 - Shirley)
        result.code === Code.REJECTED_SIGNATURE
      ) {
        globalCtx.eliminateAllModals();

        globalCtx.dataCanceledModalHandler({
          modalTitle: t('D_W_MODAL.WITHDRAW'),
          modalContent: `${t('D_W_MODAL.FAILED_REASON_CANCELED')} (${result.code})`,
        });

        globalCtx.eliminateToasts(ToastId.WITHDRAW);
        globalCtx.visibleCanceledModalHandler();
      } else {
        globalCtx.eliminateAllModals();

        globalCtx.dataFailedModalHandler({
          modalTitle: t('D_W_MODAL.WITHDRAW'),
          failedTitle: t('D_W_MODAL.FAILED_TITLE'),
          failedMsg: `${t('D_W_MODAL.FAILED_REASON_FAILED_TO_WITHDRAW')} (${result.code})`,
        });

        globalCtx.eliminateToasts(ToastId.WITHDRAW);
        globalCtx.visibleFailedModalHandler();
      }
    } catch (error) {
      notificationCtx.addException(
        'submitClickHandler withdrawal_modal',
        error as Error,
        Code.UNKNOWN_ERROR
      );
      // ToDo: Report error to backend (20230413 - Shirley)
      globalCtx.eliminateAllModals();

      if (error instanceof CustomError) {
        const str = error.toString().split('Error: ')[1];
        const errorCode = findCodeByReason(str);

        globalCtx.dataFailedModalHandler({
          modalTitle: t('D_W_MODAL.WITHDRAW'),
          failedTitle: t('D_W_MODAL.FAILED_TITLE'),
          failedMsg: `${t('D_W_MODAL.FAILED_REASON_FAILED_TO_WITHDRAW')} (${errorCode})`,
        });

        globalCtx.eliminateToasts(ToastId.WITHDRAW);

        globalCtx.visibleFailedModalHandler();
      } else {
        globalCtx.dataFailedModalHandler({
          modalTitle: t('D_W_MODAL.WITHDRAW'),
          failedTitle: t('D_W_MODAL.FAILED_TITLE'),
          failedMsg: `${t('D_W_MODAL.FAILED_REASON_FAILED_TO_WITHDRAW')} (${
            Code.UNKNOWN_ERROR_IN_COMPONENT
          })`,
        });

        globalCtx.eliminateToasts(ToastId.WITHDRAW);

        globalCtx.visibleFailedModalHandler();
      }
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
          {/* Info: (20231204 - Julian) ---------- Asset ---------- */}
          <div className="mx-6 pt-8 text-start">
            <p className="text-sm text-lightGray4">{t('D_W_MODAL.ASSET')}</p>
            <button
              id="WithdrawalAssetMenuButton"
              className={`${formStyle} w-full p-1 flex items-center rounded-md bg-darkGray8 focus:ring-0 focus:outline-none`}
              onClick={cryptoMenuClickHandler}
            >
              <div className={`z-50 flex items-center space-x-2 pl-2 flex-1`}>
                {/* Info: (20231204 - Julian) Targeted Crypto icon */}
                {selectedCrypto.icon === '' ? (
                  <></>
                ) : (
                  <Image src={selectedCrypto.icon} width={20} height={20} alt="crypto icon" />
                )}
                <p className="w-60px text-lg text-lightWhite">{selectedCrypto?.symbol}</p>
                <p className="text-sm text-lightGray">{selectedCrypto.name}</p>
              </div>
              {/* Info: (20231204 - Julian) Arrow animation */}
              <div className="animate-openMenu">
                <MdKeyboardArrowDown
                  className={`transition-all duration-300 ${rotationStyle}`}
                  size={30}
                />
              </div>
            </button>
          </div>

          {/* Info: (20231204 - Julian) ----------Crypto Menu---------- */}
          <div
            className={`absolute right-6 top-95px z-10 ${showMenu} ${fadeStyle} w-250px divide-y divide-gray-600 rounded bg-darkGray8 shadow transition-all duration-100`}
          >
            <ul
              className="h-auto overflow-y-scroll text-start text-sm text-gray-200 no-scrollbar"
              aria-labelledby="dropdownMenuIconButton"
            >
              {avaliableCryptoMenu}
            </ul>
          </div>

          {/* Info: (20231204 - Julian) ----------Amount input---------- */}
          <div className="mx-6 pt-12 text-start">
            <p className="text-sm text-lightGray4">{t('D_W_MODAL.AMOUNT')}</p>
            <div className="flex items-center rounded-md bg-darkGray8">
              <input
                id="WithdrawalAmountInput"
                className="w-250px rounded-md bg-darkGray8 py-2 pl-3 text-sm text-white focus:outline-none focus:ring-0"
                type="number"
                value={amountInput === undefined ? '' : amountInput}
                onChange={amountOnChangeHandler}
              />
              {/* Info: (20231204 - Julian) Amount unit */}
              <p className="mx-1 mr-1 text-xs text-lightWhite hover:cursor-default">
                {selectedCrypto.symbol}
              </p>
              {/* Info: (20231204 - Julian) Max button */}
              <button
                id="WithdrawalMaxButton"
                type="button"
                onClick={maxClickHandler}
                className="mx-1 whitespace-nowrap rounded-sm bg-lightGray3 px-2 py-1 text-xs text-white hover:bg-lightGray3/80"
              >
                {t('D_W_MODAL.MAX')}
              </button>
            </div>
            {/* Info: (20231204 - Julian) Available balance */}
            <div className="flex justify-end">
              <p className="pt-3 text-end text-xs tracking-wide">
                {t('D_W_MODAL.AVAILABLE_ON_TIDEBIT')}:{' '}
                <span className="text-tidebitTheme">{numberFormatted(userAvailableBalance)}</span>{' '}
                {selectedCrypto.symbol}
              </p>
            </div>
          </div>

          {/* Info: (20231204 - Julian) ---------- Withdrawal button ---------- */}
          <RippleButton
            id="WithdrawalButton"
            disabled={amountInput === 0 || amountInput === undefined}
            onClick={submitClickHandler}
            buttonType="button"
            className={`absolute -bottom-14 mt-0 rounded border-0 bg-tidebitTheme px-10 py-2 text-base text-white transition-colors duration-300 hover:bg-cyan-600 focus:outline-none disabled:bg-lightGray`}
          >
            {formButton}
          </RippleButton>
        </div>
      </div>
    </div>
  );

  const isDisplayedModal = modalVisible ? (
    /* Info: (20231204 - Julian) Blur Mask */
    <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/25 outline-none backdrop-blur-sm focus:outline-none">
      <div
        id="WithdrawalModal"
        className="relative flex h-420px w-296px flex-col py-6 rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
      >
        <div className="flex items-center justify-between">
          <h3 className="mt-2 w-full text-center text-xl font-normal text-lightWhite">
            {t('D_W_MODAL.WITHDRAW')}
          </h3>
          <button
            id="WithdrawalModalCloseButton"
            onClick={modalClickHandler}
            className="absolute right-5 top-5 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none"
          >
            <ImCross />
          </button>
        </div>
        {formContent}
      </div>
    </div>
  ) : null;

  return <>{isDisplayedModal}</>;
};

export default WithdrawalModal;

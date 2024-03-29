import React, {useContext, useState} from 'react';
import RippleButton from '../ripple_button/ripple_button';
import {MarketContext} from '../../contexts/market_context';
import {MdKeyboardArrowDown} from 'react-icons/md';
import {ImCross} from 'react-icons/im';
import {
  ICryptocurrency,
  defaultCryptocurrency,
} from '../../interfaces/tidebit_defi_background/cryptocurrency';
import Image from 'next/image';
import {DELAYED_HIDDEN_SECONDS} from '../../constants/display';
import {useGlobal} from '../../contexts/global_context';
import {useTranslation} from 'next-i18next';
import {findCodeByReason, locker, numberFormatted, randomHex, wait} from '../../lib/common';
import {OrderType} from '../../constants/order_type';
import {UserContext} from '../../contexts/user_context';
import {Code, Reason} from '../../constants/code';
import {ToastId} from '../../constants/toast_id';
import useStateRef from 'react-usestateref';
import {IApplyDepositOrder} from '../../interfaces/tidebit_defi_background/apply_deposit_order';
import {isCustomError} from '../../lib/custom_error';
import {useRouter} from 'next/router';
import {NotificationContext} from '../../contexts/notification_context';

type TranslateFunction = (s: string) => string;
interface IDepositModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  getTransferData: (props: {asset: string; amount: number}) => void;
}

const DepositModal = ({modalVisible, modalClickHandler, getTransferData}: IDepositModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {t: _t} = useTranslation();
  const {depositCryptocurrencies} = useContext(MarketContext);
  const globalCtx = useGlobal();
  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);
  const {locale} = useRouter();

  const [showCryptoMenu, setShowCryptoMenu] = useStateRef(false);
  const [selectedCrypto, setSelectedCrypto] = useStateRef(
    depositCryptocurrencies[0] ?? defaultCryptocurrency
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

  const submitClickHandler = async () => {
    if (globalCtx.displayedToast(ToastId.DEPOSIT) || globalCtx.visibleLoadingModal) {
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

    const depositOrder: IApplyDepositOrder = {
      orderType: OrderType.DEPOSIT,
      targetAsset: selectedCrypto.symbol,
      targetAmount: amountInput,
      blockchain: '0x8000003c',
      txhash: randomHex(32),
      fee: 0,
    };

    try {
      const result = await userCtx.deposit(depositOrder);

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

        globalCtx.eliminateToasts(ToastId.DEPOSIT);
        globalCtx.visibleSuccessfulModalHandler();
      } else if (
        // Info: cancel (20230413 - Shirley)
        /* Info:(20230524 - Julian) 只有在使用者主動取消交易時，才會跳出 Canceled Modal */
        result.code === Code.REJECTED_SIGNATURE
      ) {
        globalCtx.eliminateAllModals();

        globalCtx.dataCanceledModalHandler({
          modalTitle: t('D_W_MODAL.DEPOSIT'),
          modalContent: `${t('D_W_MODAL.FAILED_REASON_CANCELED')} (${result.code})`,
        });

        globalCtx.eliminateToasts(ToastId.DEPOSIT);
        globalCtx.visibleCanceledModalHandler();
      } else if (
        /* Info:(20230530 - Julian) 連續入金的錯誤屬於合約內容，所以顯示沒有紅框的 Failed Modal */
        result.code === Code.DEPOSIT_INTERVAL_TOO_SHORT
      ) {
        globalCtx.eliminateAllModals();
        globalCtx.dataFailedModalHandler({
          modalTitle: t('D_W_MODAL.DEPOSIT'),
          modalContent: `${t('D_W_MODAL.FAILED_REASON_FAILED_TO_DEPOSIT')}: (${_t(
            Reason[result.code],
            {
              nextAvailableTime: new Date(
                (result.data as {nextAvailableTime: number}).nextAvailableTime * 1000
              ).toLocaleString(locale),
            }
          )})`,
        });

        globalCtx.eliminateToasts(ToastId.DEPOSIT);
        globalCtx.visibleFailedModalHandler();
      } else {
        /* Info:(20230524 - Julian) 其他沒有包含在合約內的錯誤，就顯示 Failed Modal */
        globalCtx.eliminateAllModals();

        globalCtx.dataFailedModalHandler({
          modalTitle: t('D_W_MODAL.DEPOSIT'),
          failedTitle: t('D_W_MODAL.FAILED_TITLE'),
          failedMsg: `${t('D_W_MODAL.FAILED_REASON_FAILED_TO_DEPOSIT')} (${result.code})`,
        });

        globalCtx.eliminateToasts(ToastId.DEPOSIT);
        globalCtx.visibleFailedModalHandler();
      }
    } catch (error) {
      notificationCtx.addException(
        'submitClickHandler deposit_modal',
        error as Error,
        Code.UNKNOWN_ERROR
      );

      globalCtx.eliminateAllModals();

      // ToDo: Report error to backend (20230413 - Shirley)
      // Info: Unknown error
      if (isCustomError(error)) {
        const str = error.toString().split('Error: ')[1];
        const errorCode = findCodeByReason(str);

        globalCtx.dataFailedModalHandler({
          modalTitle: t('D_W_MODAL.DEPOSIT'),
          failedTitle: t('D_W_MODAL.FAILED_TITLE'),
          failedMsg: `${t('D_W_MODAL.FAILED_REASON_FAILED_TO_DEPOSIT')} (${errorCode})`,
        });

        globalCtx.eliminateToasts(ToastId.DEPOSIT);
        globalCtx.visibleFailedModalHandler();
      } else {
        globalCtx.dataFailedModalHandler({
          modalTitle: t('D_W_MODAL.DEPOSIT'),
          failedTitle: t('D_W_MODAL.FAILED_TITLE'),
          failedMsg: `${t('D_W_MODAL.FAILED_REASON_FAILED_TO_DEPOSIT')} (${
            Code.UNKNOWN_ERROR_IN_COMPONENT
          })`,
        });

        globalCtx.eliminateToasts(ToastId.DEPOSIT);
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
        id={`DepositAsset${item.name}`}
        key={item.symbol}
        onClick={() => cryptoItemClickHandler(item)}
      >
        <p className="block rounded px-5 py-2 text-base hover:cursor-pointer hover:bg-darkGray5">
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
    <div className="relative text-lg leading-relaxed text-lightWhite flex-col justify-center text-center">
      {/* Info: (20231204 - Julian) ---------- Asset ---------- */}
      <div className="mx-6 pt-8 text-start">
        <p className="text-sm text-lightGray4">{t('D_W_MODAL.ASSET')}</p>
        <button
          id="DepositAssetMenuButton"
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
            id="DepositAmountInput"
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
            id="DepositMaxButton"
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
            {t('D_W_MODAL.AVAILABLE_IN_WALLET')}:{' '}
            <span className="text-tidebitTheme">{numberFormatted(userAvailableBalance)}</span>{' '}
            {selectedCrypto.symbol}
          </p>
        </div>
      </div>

      {/* Info: (20231204 - Julian) ---------- Deposit button ---------- */}
      <RippleButton
        id="DepositButton"
        // Use the logic directly in the `disabled` attribute instead of `setSubmitDisabled`
        disabled={amountInput === 0 || amountInput === undefined}
        onClick={submitClickHandler}
        buttonType="button"
        className={`absolute -bottom-14 rounded bg-tidebitTheme px-10 py-2 text-base text-white transition-colors duration-300 hover:bg-cyan-600 focus:outline-none disabled:bg-lightGray`}
      >
        {formButton}
      </RippleButton>
    </div>
  );

  const isDisplayedModal = modalVisible ? (
    /* Info: (20231204 - Julian) Blur Mask */
    <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/25 outline-none backdrop-blur-sm focus:outline-none">
      <div
        id="DepositModal"
        className="relative flex h-420px w-296px py-6 flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
      >
        <div className="flex items-center justify-between">
          <h3 className="mt-2 w-full text-center text-xl font-normal text-lightWhite">
            {t('D_W_MODAL.DEPOSIT')}
          </h3>
          <button
            id="DepositModalCloseButton"
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

export default DepositModal;

import {ImCross} from 'react-icons/im';
import {
  DELAYED_HIDDEN_SECONDS,
  TypeOfBorderColor,
  TypeOfPnLColor,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import RippleButton from '../ripple_button/ripple_button';
import Image from 'next/image';
import {locker, timestampToString, wait} from '../../lib/common';
import {useContext, useEffect, useState} from 'react';
import {MarketContext} from '../../contexts/market_context';
import {IUpdatedCFDInputProps, useGlobal} from '../../contexts/global_context';
import {TypeOfPosition} from '../../constants/type_of_position';
import {UserContext} from '../../contexts/user_context';
import {useTranslation} from 'react-i18next';
import {IDisplayApplyCFDOrder} from '../../interfaces/tidebit_defi_background/display_apply_cfd_order';
import {IApplyUpdateCFDOrderData} from '../../interfaces/tidebit_defi_background/apply_update_cfd_order_data';
import {IDisplayAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';

type TranslateFunction = (s: string) => string;
interface IPositionUpdatedModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  openCfdDetails: IDisplayAcceptedCFDOrder;
  updatedProps?: IApplyUpdateCFDOrderData;
}

const PositionUpdatedModal = ({
  modalVisible,
  modalClickHandler,
  openCfdDetails,
  updatedProps,
  ...otherProps
}: IPositionUpdatedModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);
  const marketCtx = useContext(MarketContext);
  const globalCtx = useGlobal();

  const [tpTextStyle, setTpTextStyle] = useState('text-lightWhite');
  const [slTextStyle, setSlTextStyle] = useState('text-lightWhite');
  const [gtslTextStyle, setGtslTextStyle] = useState('text-lightWhite');

  const toApplyUpdateOrder = (position: IDisplayAcceptedCFDOrder): IApplyUpdateCFDOrderData => {
    const request = {
      orderId: position.id,
      ...updatedProps,
      guaranteedStop: updatedProps?.guaranteedStop ?? false,
    };

    return request;
  };

  const submitClickHandler = async () => {
    const [lock, unlock] = locker('position_updated_modal.submitClickHandler');
    if (!lock()) return;
    await wait(DELAYED_HIDDEN_SECONDS / 5);
    modalClickHandler();

    globalCtx.dataLoadingModalHandler({
      modalTitle: 'Update Position',
      modalContent: 'Confirm the transaction',
    });
    globalCtx.visibleLoadingModalHandler();

    // TODO: (20230315 - Shirley) the guaranteedStop should be removed
    const result = await userCtx.updateCFDOrder(toApplyUpdateOrder(openCfdDetails));

    // TODO:  (20230317 - Shirley) for debug
    globalCtx.toast({message: 'update-position result: ' + JSON.stringify(result), type: 'info'});

    globalCtx.dataLoadingModalHandler({
      modalTitle: 'Update Position',
      modalContent: 'Transaction broadcast',
      btnMsg: 'View on Etherscan',
      btnUrl: '#',
    });

    // TODO: (20230317 - Shirley) temporary waiting
    await wait(DELAYED_HIDDEN_SECONDS);

    globalCtx.eliminateAllModals();

    // TODO: (20230317 - Shirley) Revise the `result.reason` to constant by using enum or object
    // TODO: (20230317 - Shirley) the button URL
    if (result.success) {
      globalCtx.dataSuccessfulModalHandler({
        modalTitle: 'Update Position',
        modalContent: 'Transaction succeed',
        btnMsg: 'View on Etherscan',
        btnUrl: '#',
      });

      globalCtx.visibleSuccessfulModalHandler();
      await wait(DELAYED_HIDDEN_SECONDS);

      globalCtx.eliminateAllModals();

      globalCtx.dataUpdateFormModalHandler(openCfdDetails);
      globalCtx.visibleUpdateFormModalHandler();
    } else if (result.reason === 'CANCELED') {
      globalCtx.dataCanceledModalHandler({
        modalTitle: 'Update Position',
        modalContent: 'Transaction canceled',
      });

      globalCtx.visibleCanceledModalHandler();
    } else if (result.reason === 'FAILED') {
      globalCtx.dataFailedModalHandler({
        modalTitle: 'Update Position',
        failedTitle: 'Failed',
        failedMsg: 'Failed to update position',
      });

      globalCtx.visibleFailedModalHandler();
    }

    unlock();

    return;
  };

  // Double check if the value is updated
  const renewDataStyle = () => {
    if (updatedProps === undefined) return;

    updatedProps.guaranteedStop && updatedProps.guaranteedStop !== openCfdDetails.guaranteedStop
      ? setGtslTextStyle('text-lightYellow2')
      : setGtslTextStyle('text-lightWhite');

    //  && updatedProps.takeProfit !== openCfdDetails.takeProfit
    updatedProps.takeProfit !== undefined && updatedProps.takeProfit !== openCfdDetails.takeProfit
      ? setTpTextStyle('text-lightYellow2')
      : setTpTextStyle('text-lightWhite');

    // && updatedProps.stopLoss !== openCfdDetails.stopLoss
    updatedProps.stopLoss !== undefined && updatedProps.stopLoss !== openCfdDetails.stopLoss
      ? setSlTextStyle('text-lightYellow2')
      : setSlTextStyle('text-lightWhite');
  };

  useEffect(() => {
    renewDataStyle();
  }, [globalCtx.visiblePositionUpdatedModal]);

  const displayedGuaranteedStopSetting = updatedProps?.guaranteedStop
    ? 'Yes'
    : openCfdDetails.guaranteedStop
    ? 'Yes'
    : 'No';

  const displayedTakeProfit =
    updatedProps?.takeProfit !== undefined
      ? updatedProps.takeProfit === 0
        ? '-'
        : updatedProps.takeProfit !== 0
        ? `$ ${updatedProps.takeProfit.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
            minimumFractionDigits: 2,
          })}`
        : undefined
      : openCfdDetails.takeProfit
      ? `$ ${openCfdDetails.takeProfit.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
          minimumFractionDigits: 2,
        })}`
      : '-';

  const displayedStopLoss =
    updatedProps?.stopLoss !== undefined
      ? updatedProps.stopLoss === 0
        ? '-'
        : updatedProps.stopLoss !== 0
        ? `$ ${updatedProps.stopLoss.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
            minimumFractionDigits: 2,
          })}`
        : undefined
      : openCfdDetails.stopLoss
      ? `$ ${openCfdDetails.stopLoss.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
          minimumFractionDigits: 2,
        })}`
      : '-';

  // const displayedStopLoss =
  //   updatedProps.stopLoss === 0
  //     ? '-'
  //     : updatedProps.stopLoss !== 0
  //     ? updatedProps.stopLoss
  //     : openCfdDetails.stopLoss
  //     ? openCfdDetails.stopLoss
  //     : '-';

  // const displayedPnLSymbol =
  //   openCfdDetails.pnl.type === 'PROFIT' ? '+' : openCfdDetails.pnl.type === 'LOSS' ? '-' : '';

  const displayedTypeOfPosition =
    openCfdDetails?.typeOfPosition === TypeOfPosition.BUY
      ? t('POSITION_MODAL.TYPE_UP')
      : t('POSITION_MODAL.TYPE_DOWN');

  const displayedBuyOrSell =
    openCfdDetails?.typeOfPosition === TypeOfPosition.BUY
      ? t('POSITION_MODAL.TYPE_BUY')
      : t('POSITION_MODAL.TYPE_SELL');

  // const displayedPnLColor =
  //   updatedCfdRequest?.pnl.type === 'PROFIT'
  //     ? TypeOfPnLColor.PROFIT
  //     : updatedCfdRequest?.pnl.type === 'LOSS'
  //     ? TypeOfPnLColor.LOSS
  //     : TypeOfPnLColor.EQUAL;

  const displayedPositionColor = 'text-tidebitTheme';
  // openCfdDetails.typeOfPosition === TypeOfPosition.BUY
  //   ? TypeOfPnLColor.PROFIT
  //   : TypeOfPnLColor.LOSS;

  const displayedBorderColor = TypeOfBorderColor.NORMAL;

  const layoutInsideBorder = 'mx-5 my-2 flex justify-between';

  const displayedTime = timestampToString(openCfdDetails?.createTimestamp ?? 0);

  const formContent = (
    <div className="mt-8 flex flex-col px-6 pb-2">
      <div className="flex items-center justify-center space-x-2 text-center">
        <Image
          src={marketCtx.selectedTicker?.tokenImg ?? ''}
          width={30}
          height={30}
          alt="ticker icon"
        />
        <div className="text-2xl">{openCfdDetails.ticker}</div>
      </div>

      <div className="relative flex-auto pt-1">
        <div
          className={`${displayedBorderColor} mt-1 border-1px py-4 text-xs leading-relaxed text-lightWhite`}
        >
          <div className="flex flex-col justify-center text-center">
            {/* {displayedDataFormat()} */}

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.TYPE')}</div>
              {/* TODO: color variable */}
              <div className={`${displayedPositionColor}`}>
                {displayedTypeOfPosition}
                <span className="ml-1 text-lightGray">{displayedBuyOrSell}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.OPEN_PRICE')}</div>
              {/* <div className="">
                {openCfdDetails?.amount?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}{' '}
                {openCfdDetails.ticker}
              </div> */}
              <div className={``}>
                {/* TODO: Hardcode USDT */}
                {openCfdDetails?.openPrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE, {
                  minimumFractionDigits: 2,
                }) ?? 0}{' '}
                <span className="ml-1 text-lightGray">USDT</span>
                {/* {openCfdDetails?.price?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0} USDT */}
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.OPEN_TIME')}</div>
              <div className="">
                {displayedTime.date} {displayedTime.time}
              </div>
            </div>
            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.TP_AND_SL')}</div>
              <div className="">
                <span className={`${tpTextStyle}`}>{displayedTakeProfit}</span> /{' '}
                <span className={`${slTextStyle}`}>{displayedStopLoss}</span>
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">{t('POSITION_MODAL.GUARANTEED_STOP')}</div>
              <div className={`${gtslTextStyle}`}>{displayedGuaranteedStopSetting}</div>
            </div>
          </div>
        </div>

        <div className="my-4 text-xxs text-lightGray">{t('POSITION_MODAL.CFD_CONTENT')}</div>

        <RippleButton
          onClick={submitClickHandler}
          buttonType="button"
          className={`mt-0 whitespace-nowrap rounded border-0 bg-tidebitTheme py-2 px-16 text-base text-white transition-colors duration-300 hover:bg-cyan-600 focus:outline-none`}
        >
          {t('POSITION_MODAL.CONFIRM_BUTTON')}
        </RippleButton>
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
            // ref={modalRef}
            className="relative flex h-auto w-300px flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-9">
              <h3 className="w-full text-center text-xl font-normal text-lightWhite">
                {t('POSITION_MODAL.UPDATE_POSITION_TITLE')}
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

export default PositionUpdatedModal;

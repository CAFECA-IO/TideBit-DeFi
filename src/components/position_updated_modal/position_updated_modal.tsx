import {ImCross} from 'react-icons/im';
import {IOpenCFDDetails} from '../../interfaces/tidebit_defi_background/open_cfd_details';
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
import {IPublicCFDOrder} from '../../interfaces/tidebit_defi_background/public_order';
import {IUpdatedCFDInputProps, useGlobal} from '../../contexts/global_context';
import {TypeOfPosition} from '../../constants/type_of_position';
import {UserContext} from '../../contexts/user_context';
import {IDisplayApplyCFDOrder} from '../../interfaces/tidebit_defi_background/display_apply_cfd_order';
import {IApplyUpdateCFDOrderData} from '../../interfaces/tidebit_defi_background/apply_update_cfd_order_data';
import {IDisplayAcceptedCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';

interface IPositionUpdatedModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  openCfdDetails: IDisplayAcceptedCFDOrder;
  updatedProps?: IApplyUpdateCFDOrderData;
}

// TODO: replace all hardcode options with variables
const PositionUpdatedModal = ({
  modalVisible,
  modalClickHandler,
  openCfdDetails,
  updatedProps,
  ...otherProps
}: IPositionUpdatedModal) => {
  const userCtx = useContext(UserContext);
  const marketCtx = useContext(MarketContext);
  const globalCtx = useGlobal();

  // const data = openCfdDetails.data as IApplyUpdateCFDOrderData // Till: (20230314 - Shirley)

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

  /** TODO: (20230314 - Shirley)
    // loading modal -> UserContext.function (負責簽名) ->
    // 猶豫太久的話，單子會過期，就會顯示 failed modal，
    // 用戶沒簽名才是顯示 canceled modal
    // 用戶簽名成功，就會顯示 successful modal
   */
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

    // TODO: temporary waiting
    await wait(DELAYED_HIDDEN_SECONDS);
    globalCtx.dataLoadingModalHandler({
      modalTitle: 'Update Position',
      modalContent: 'Transaction broadcast',
      btnMsg: 'View on Etherscan',
      btnUrl: '#',
    });

    // console.log('result from userCtx in position_closed_modal.tsx: ', result);

    // TODO: temporary waiting
    await wait(DELAYED_HIDDEN_SECONDS);

    // Close loading modal
    globalCtx.eliminateAllModals();

    // TODO: Revise the `result.reason` to constant by using enum or object
    // TODO: the button URL
    if (result.success) {
      globalCtx.dataSuccessfulModalHandler({
        modalTitle: 'Update Position',
        modalContent: 'Transaction succeed',
        btnMsg: 'View on Etherscan',
        btnUrl: '#',
      });

      // globalCtx.dataPositionDetailsModalHandler(userCtx.getOpendCFD(openCfdDetails.id));

      globalCtx.visibleSuccessfulModalHandler();
      await wait(DELAYED_HIDDEN_SECONDS);

      globalCtx.eliminateAllModals();

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

    // console.log('updatedProps ', updatedProps);
    // console.log('openCfdDetails ', openCfdDetails);
    // console.log('text style', tpTextStyle, slTextStyle, gtslTextStyle);
  }, [globalCtx.visiblePositionUpdatedModal]);

  // TODO: typo `guaranteedStop`
  const displayedGuaranteedStopSetting = updatedProps?.guaranteedStop
    ? 'Yes'
    : openCfdDetails.guaranteedStop
    ? 'Yes'
    : 'No';

  // if (updatedProps.takeProfit !== openCfdDetails.takeProfit) {
  //   if (updatedProps.takeProfit === 0) {
  //     return '-';
  //   } else if (updatedProps.takeProfit !== 0) {
  //     return updatedProps.takeProfit;
  //   }
  // } else if (openCfdDetails.takeProfit) {
  //   return openCfdDetails.takeProfit;
  // } else {
  //   return '-';
  // }

  const displayedTakeProfit =
    updatedProps?.takeProfit !== undefined
      ? updatedProps.takeProfit === 0
        ? '-'
        : updatedProps.takeProfit !== 0
        ? `$ ${updatedProps.takeProfit}`
        : undefined
      : openCfdDetails.takeProfit
      ? `$ ${openCfdDetails.takeProfit}`
      : '-';

  // const displayedTakeProfit =
  //   updatedProps.takeProfit === 0
  //     ? '-'
  //     : updatedProps.takeProfit !== 0
  //     ? updatedProps.takeProfit
  //     : openCfdDetails.takeProfit
  //     ? openCfdDetails.takeProfit
  //     : '-';

  const displayedStopLoss =
    updatedProps?.stopLoss !== undefined
      ? updatedProps.stopLoss === 0
        ? '-'
        : updatedProps.stopLoss !== 0
        ? `$ ${updatedProps.stopLoss}`
        : undefined
      : openCfdDetails.stopLoss
      ? `$ ${openCfdDetails.stopLoss}`
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

  // TODO: i18n
  const displayedTypeOfPosition =
    openCfdDetails?.typeOfPosition === TypeOfPosition.BUY ? 'Up (Buy)' : 'Down (Sell)';

  // const displayedPnLColor =
  //   updatedCfdRequest?.pnl.type === 'PROFIT'
  //     ? TypeOfPnLColor.PROFIT
  //     : updatedCfdRequest?.pnl.type === 'LOSS'
  //     ? TypeOfPnLColor.LOSS
  //     : TypeOfPnLColor.EQUAL;

  const displayedPositionColor = 'text-lightWhite';
  // openCfdDetails.typeOfPosition === TypeOfPosition.BUY
  //   ? TypeOfPnLColor.PROFIT
  //   : TypeOfPnLColor.LOSS;

  const displayedBorderColor = TypeOfBorderColor.NORMAL;
  // openCfdDetails?.typeOfPosition === TypeOfPosition.BUY
  //   ? TypeOfBorderColor.LONG
  //   : TypeOfBorderColor.SHORT;

  const layoutInsideBorder = 'mx-5 my-4 flex justify-between';

  const displayedTime = timestampToString(openCfdDetails?.createTimestamp ?? 0);

  const formContent = (
    <div>
      <div className="mt-8 mb-2 flex items-center justify-center space-x-2 text-center">
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
          className={`${displayedBorderColor} mx-6 mt-1 border-1px text-xs leading-relaxed text-lightWhite`}
        >
          <div className="flex-col justify-center text-center">
            {/* {displayedDataFormat()} */}

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Type</div>
              {/* TODO: color variable */}
              <div className={`${displayedPositionColor}`}>{displayedTypeOfPosition}</div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Open Price</div>
              {/* <div className="">
                {openCfdDetails?.amount?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}{' '}
                {openCfdDetails.ticker}
              </div> */}
              <div className={``}>
                {/* TODO: Hardcode USDT */}${' '}
                {openCfdDetails?.openPrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}{' '}
                USDT
                {/* {openCfdDetails?.price?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0} USDT */}
              </div>
            </div>

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Open Time</div>
              <div className="">
                {displayedTime.date} {displayedTime.time}
              </div>
            </div>
            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">TP/ SL</div>
              <div className="">
                <span className={`${tpTextStyle}`}>{displayedTakeProfit}</span> /{' '}
                <span className={`${slTextStyle}`}>{displayedStopLoss}</span>
              </div>
            </div>

            {/* <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Required Margin</div>
              <div className="">$ {openCfdDetails.margin.toFixed(2)} USDT</div>
            </div> */}

            {/* <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Avg. Close Price</div>
              <div className="">
                Market Price ( ${' '}
                {openCfdDetails?.openPrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0} )
              </div>
            </div> */}

            {/* <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">PNL</div>
              <div className={`${displayedPnLColor}`}>
                $ {displayedPnLSymbol}{' '}
                {openCfdDetails.pnl.value.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}
              </div>
            </div> */}

            <div className={`${layoutInsideBorder}`}>
              <div className="text-lightGray">Guaranteed Stop</div>
              <div className={`${gtslTextStyle}`}>{displayedGuaranteedStopSetting}</div>
            </div>

            {/* <div className={`${tableLayout}`}>
              <div className="text-lightGray">Liquidation Price</div>
              <div className="">$ 9.23</div>
            </div> */}
          </div>
        </div>

        <div className="mx-6 my-3 text-xxs text-lightGray">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna
        </div>

        <div className={`flex-col space-y-5 text-base leading-relaxed text-lightWhite`}>
          <RippleButton
            onClick={submitClickHandler}
            buttonType="button"
            className={`mx-22px mt-0 rounded border-0 bg-tidebitTheme py-2 px-16 text-base text-white transition-colors duration-300 hover:bg-cyan-600 focus:outline-none`}
          >
            Confirm the order
          </RippleButton>
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
            // ref={modalRef}
            className="relative flex h-475px w-296px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-9">
              <h3 className="mt-0 w-full text-center text-xl font-normal text-lightWhite">
                Update Position
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

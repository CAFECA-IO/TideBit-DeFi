import {ImCross} from 'react-icons/im';
import {IOpenCFDDetails} from '../../interfaces/tidebit_defi_background/open_cfd_details';
import {
  TypeOfBorderColor,
  TypeOfPnLColor,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import RippleButton from '../ripple_button/ripple_button';
import Image from 'next/image';
import {timestampToString} from '../../lib/common';
import {useContext, useState} from 'react';
import {MarketContext} from '../../contexts/market_context';
import {IPublicCFDOrder} from '../../interfaces/tidebit_defi_background/public_order';

interface IPositionUpdatedModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  openCfdDetails: IOpenCFDDetails;

  // updatedProps
}

// TODO: replace all hardcode options with variables
const PositionUpdatedModal = ({
  modalVisible,
  modalClickHandler,
  openCfdDetails: openCfdDetails,
  ...otherProps
}: IPositionUpdatedModal) => {
  const marketCtx = useContext(MarketContext);

  const [dataRenewedStyle, setDataRenewedStyle] = useState('text-lightWhite');

  // TODO: create order function
  const submitClickHandler = () => {
    modalClickHandler();
    return;
  };

  // TODO: typo `guaranteedStop`
  const displayedGuaranteedStopSetting = !!openCfdDetails.guaranteedStop ? 'Yes' : 'No';

  // const displayedPnLSymbol =
  //   openCfdDetails.pnl.type === 'PROFIT' ? '+' : openCfdDetails.pnl.type === 'LOSS' ? '-' : '';

  const displayedTypeOfPosition =
    openCfdDetails?.typeOfPosition === 'BUY' ? 'Up (Buy)' : 'Down (Sell)';

  // const displayedPnLColor =
  //   updatedCfdRequest?.pnl.type === 'PROFIT'
  //     ? TypeOfPnLColor.PROFIT
  //     : updatedCfdRequest?.pnl.type === 'LOSS'
  //     ? TypeOfPnLColor.LOSS
  //     : TypeOfPnLColor.EQUAL;

  const displayedPositionColor =
    openCfdDetails.typeOfPosition === 'BUY' ? TypeOfPnLColor.PROFIT : TypeOfPnLColor.LOSS;

  const displayedBorderColor =
    openCfdDetails?.typeOfPosition === 'BUY' ? TypeOfBorderColor.LONG : TypeOfBorderColor.SHORT;

  const layoutInsideBorder = 'mx-5 my-4 flex justify-between';

  const displayedTime = timestampToString(openCfdDetails?.openTimestamp ?? 0);

  const formContent = (
    <div>
      <div className="mt-2 mb-2 flex items-center justify-center space-x-2 text-center">
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
              <div className={`${dataRenewedStyle}`}>
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
              <div className="">$20/ $10.5</div>
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
              <div className={``}>{displayedGuaranteedStopSetting}</div>
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

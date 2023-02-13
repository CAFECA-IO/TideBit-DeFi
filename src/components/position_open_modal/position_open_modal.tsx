import {ImCross} from 'react-icons/im';
import {IOpenCFDDetails} from '../../interfaces/tidebit_defi_background/open_cfd_details';
import {
  BORDER_COLOR_TYPE,
  PNL_COLOR_TYPE,
  UNIVERSAL_NUMBER_FORMAT_LOCALE,
} from '../../constants/display';
import RippleButton from '../ripple_button/ripple_button';
import Image from 'next/image';

interface IPositionOpenModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  openCfdDetails: IOpenCFDDetails;
}

const timestampToString = (timestamp: number) => {
  if (timestamp === 0) return ['-', '-'];

  const date = new Date(timestamp * 1000);
  // const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');

  const dateString = `${year}-${month}-${day}`;
  const timeString = `${hour}:${minute}:${second}`;

  return [dateString, timeString];
};

const PositionOpenModal = ({
  modalVisible,
  modalClickHandler,
  openCfdDetails,
  ...otherProps
}: IPositionOpenModal) => {
  const displayedTypeOfPosition =
    openCfdDetails?.typeOfPosition === 'BUY' ? 'Up (Buy)' : 'Down (Sell)';

  const displayedPnLColor =
    openCfdDetails?.pnl.type === 'UP'
      ? PNL_COLOR_TYPE.profit
      : openCfdDetails?.pnl.type === 'DOWN'
      ? PNL_COLOR_TYPE.loss
      : PNL_COLOR_TYPE.equal;

  const displayedBorderColor =
    openCfdDetails?.typeOfPosition === 'BUY' ? BORDER_COLOR_TYPE.long : BORDER_COLOR_TYPE.short;

  const formContent = (
    <div>
      <div className="mt-1 flex items-center justify-center space-x-5 text-center">
        <Image src={`/elements/group_2371.svg`} width={30} height={30} alt="ticker icon" />
        <div className="text-2xl">ETH</div>
      </div>

      <div className="relative flex-auto pt-1">
        <div
          className={`${displayedBorderColor} mx-6 mt-1 border-1px text-xs leading-relaxed text-lightWhite`}
        >
          <div className="flex-col justify-center text-center">
            {/* {displayedDataFormat()} */}

            <div className="mx-6 my-4 flex justify-between">
              <div className="text-lightGray">Type</div>
              {/* TODO: color variable */}
              <div className={`text-lightGreen5`}>{displayedTypeOfPosition}</div>
            </div>

            <div className="mx-6 my-4 flex justify-between">
              <div className="text-lightGray">Amount</div>
              <div className="">
                {openCfdDetails?.amount?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}
              </div>
            </div>

            <div className="mx-6 my-4 flex justify-between">
              <div className="text-lightGray">Required Margin</div>
              <div className="">$ {((openCfdDetails?.openPrice * 1.8) / 5).toFixed(2)} USDT</div>
            </div>

            <div className="mx-6 my-4 flex justify-between">
              <div className="text-lightGray">Limit/ Stop</div>
              <div className="">$20/ $10.5</div>
            </div>

            {/* <div className="mx-6 my-4 flex justify-between">
            <div className="text-lightGray">PNL</div>
            <div className="">
              $ {openCfdDetails?.pnl?.symbol}{' '}
              {openCfdDetails?.pnl.value?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)}
            </div>
          </div> */}

            {/* <div className="mx-6 my-4 flex justify-between">
            <div className="text-lightGray">Open Value</div>
            <div className="">
              $ {openCfdDetails?.openValue?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}
            </div>
          </div> */}

            <div className="mx-6 my-4 flex justify-between">
              <div className="text-lightGray">Average Fill Price</div>
              <div className="">
                $ {openCfdDetails?.openPrice?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? 0}
              </div>
            </div>

            <div className="mx-6 my-4 flex justify-between">
              <div className="text-lightGray">Open Time</div>
              <div className="">
                {timestampToString(openCfdDetails?.openTimestamp ?? 0)[0]}{' '}
                {timestampToString(openCfdDetails?.openTimestamp ?? 0)[1]}
              </div>
            </div>

            {/* <div className="mx-6 my-4 flex justify-between">
            <div className="text-lightGray">Limit/ Stop</div>
            <div className="">
              <span className={`text-lightWhite`}>
                {openCfdDetails?.takeProfit?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? '-'}
              </span>{' '}
              /{' '}
              <span className={`text-lightWhite`}>
                {openCfdDetails?.stopLoss?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE) ?? '-'}
              </span>
            </div>
          </div> */}

            <div className="mx-6 my-4 flex justify-between">
              <div className="text-lightGray">Liquidation Price</div>
              <div className="">$ 9.23</div>
            </div>

            {/* <div className="mx-6 my-4 flex justify-between">
            <div className="text-lightGray">State</div>
            <div className="">
              Open
              <button type="button" className="ml-2 text-tidebitTheme underline underline-offset-2">
                Close
              </button>
            </div>
          </div> */}
          </div>
        </div>

        <div className="mx-6 my-2 text-xxs text-lightGray">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna
        </div>

        <div className={`flex-col space-y-5 text-base leading-relaxed text-lightWhite`}>
          <RippleButton
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
            id="PositionOpenModal"
            // ref={modalRef}
            className="relative flex h-475px w-296px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-9">
              <h3 className="-mt-0 w-full text-center text-xl font-normal text-lightWhite">
                Open Position
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

export default PositionOpenModal;

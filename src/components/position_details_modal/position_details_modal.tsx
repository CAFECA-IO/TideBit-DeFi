import Image from 'next/image';
import {ImCross} from 'react-icons/im';
import {IOpenCFDDetails} from '../../interfaces/tidebit_defi_background/open_cfd_details';
import {BORDER_COLOR_TYPE, PNL_COLOR_TYPE} from '../../constants/display';
import Toggle from '../toggle/toggle';
import {useState} from 'react';
import TradingInput from '../trading_input/trading_input';
import {AiOutlineQuestionCircle} from 'react-icons/ai';
import TideButton from '../tide_button/tide_button';
import RippleButton from '../ripple_button/ripple_button';

interface IPositionDetailsModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
  openCfdDetails?: IOpenCFDDetails;
}

const timestampToString = (timestamp: number) => {
  if (timestamp === 0) return ['-', '-'];

  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  // const month = ('' + (date.getMonth() + 1)).slice(-2);
  // const day = ('0' + date.getDate()).slice(-2);
  // const hour = ('0' + date.getHours()).slice(-2);
  // const minute = ('0' + date.getMinutes()).slice(-2);
  // const second = ('0' + date.getSeconds()).slice(-2);

  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');

  const dateString = `${year}-${month}-${day}`;
  const timeString = `${hour}:${minute}:${second}`;

  return [dateString, timeString];
};

const PositionDetailsModal = ({
  // openCfdDetails,
  modalVisible,
  modalClickHandler,
  openCfdDetails,
}: IPositionDetailsModal) => {
  const dateString = timestampToString(openCfdDetails?.openTimestamp ?? 0);

  // console.log('in position, timestamp from open cfd details:', dateString);
  // console.log('in position, open cfd details:', openCfdDetails?.margin ?? 0);

  const [takeProfitValue, setTakeProfitValue] = useState(1246.5);
  const [stopLossValue, setStopLossValue] = useState(1320.5);
  const [takeProfitToggle, setTakeProfitToggle] = useState(false);
  const [stopLossToggle, setStopLossToggle] = useState(false);
  const [guaranteedTooltipStatus, setGuaranteedTooltipStatus] = useState(0);

  const [guaranteedChecked, setGuaranteedChecked] = useState(false);
  const [slLowerLimit, setSlLowerLimit] = useState(0);
  const [slUpperLimit, setSlUpperLimit] = useState(2023);

  const getToggledTpSetting = (bool: boolean) => {
    setTakeProfitToggle(bool);
  };

  const getToggledSlSetting = (bool: boolean) => {
    setStopLossToggle(bool);
  };

  // const getSlToggleFunction = (slToggleFunction: () => void) => {
  //   slToggleFunction();
  // };

  // TODO: i18n
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

  const isDisplayedTakeProfitSetting = takeProfitToggle ? 'flex' : 'invisible';
  const isDisplayedStopLossSetting = stopLossToggle || guaranteedChecked ? 'flex' : 'invisible';

  const displayedTakeProfitSetting = (
    <div className={`${isDisplayedTakeProfitSetting}`}>
      <TradingInput
        lowerLimit={0}
        upperLimit={1000000}
        inputInitialValue={takeProfitValue}
        inputValueFromParent={takeProfitValue}
        inputPlaceholder="take-profit setting"
        inputName="tpInput"
        inputSize="h-25px w-70px text-sm"
        decrementBtnSize="25"
        incrementBtnSize="25"
      />
    </div>
  );

  const displayedStopLossSetting = (
    <div className={`${isDisplayedStopLossSetting}`}>
      <TradingInput
        lowerLimit={slLowerLimit}
        upperLimit={slUpperLimit}
        inputInitialValue={stopLossValue}
        setInputValueFromParent={setStopLossValue}
        inputValueFromParent={stopLossValue}
        inputPlaceholder="stop-loss setting"
        inputName="slInput"
        inputSize="h-25px w-70px text-sm"
        decrementBtnSize="25"
        incrementBtnSize="25"
      />
    </div>
  );
  const guaranteedCheckedChangeHandler = () => {
    if (!guaranteedChecked) {
      setGuaranteedChecked(!guaranteedChecked);
    }
    setSlLowerLimit(1320.5);
    setSlUpperLimit(1320.5);
    setStopLossValue(1320.5);

    // console.log('toggle state in position details modal:', guaranteedChecked);
  };

  const guaranteedStopLoss = (
    <div className="">
      <div className="flex">
        <input
          type="checkbox"
          value=""
          checked={guaranteedChecked}
          onChange={guaranteedCheckedChangeHandler}
          className="h-5 w-5 rounded text-lightWhite accent-lightGray4"
        />
        <label className="ml-2 flex text-sm font-medium text-lightGray">
          Guaranteed stop &nbsp;
          <span className="text-lightWhite"> (Fee: 0.77 USDT)</span>
          {/* <span className="">
          <AiOutlineQuestionCircle size={20} />
        </span> */}
          {/* tooltip */}
          <div className="ml-1">
            <div
              className="relative"
              onMouseEnter={() => setGuaranteedTooltipStatus(3)}
              onMouseLeave={() => setGuaranteedTooltipStatus(0)}
            >
              <div className="cursor-pointer">
                <AiOutlineQuestionCircle size={20} />
              </div>
              {guaranteedTooltipStatus == 3 && (
                <div
                  role="tooltip"
                  className="absolute -top-120px -left-52 z-20 mr-8 w-56 rounded bg-darkGray8 p-4 shadow-lg shadow-black/80 transition duration-150 ease-in-out"
                >
                  <p className="pb-0 text-sm font-medium text-white">
                    Guaranteed stop will force the position to close at your chosen rate (price)
                    even if the market price surpasses it.
                  </p>
                </div>
              )}
            </div>
          </div>
        </label>
      </div>
    </div>
  );

  const dataFormat = {
    type: 'UP (Buy)',
    amount: '0.1',
    PNL: '34.9',
    openValue: '656.9',
    openPrice: '131.8',
    openTime: '2022-05-30 13:04:57', // date + time
    takeProfit: '-',
    stopLoss: '-',
    liquidationPrice: '1183.6',
    state: 'Open',
  };

  // const displayedDataFormat = () => {
  //   const elements = [];
  //   for (const [key, value] of Object.entries(dataFormat)) {
  //     elements.push(
  //       <div className="mx-6 my-5 flex justify-between">
  //         <div className="text-lightGray">{key}</div>
  //         <div className="">{value}</div>
  //       </div>
  //     );
  //   }
  //   return elements;
  // };

  const isDisplayedDetailedPositionModal = modalVisible ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {/*content & panel*/}
          <div className="relative flex h-726px w-450px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-6">
              <div className="ml-10 mr-8 mt-6 flex w-450px justify-between">
                <div className="flex items-center space-x-3 text-center text-4xl text-lightWhite">
                  <Image src="/elements/group_2371.svg" width={40} height={40} alt="icon" />
                  <h3 className="">{openCfdDetails?.ticker} </h3>
                </div>

                <div className="text-end text-base text-lightGray">
                  <p className="">{timestampToString(openCfdDetails?.openTimestamp ?? 0)[0]}</p>
                  <p className="">{timestampToString(openCfdDetails?.openTimestamp ?? 0)[1]}</p>
                </div>
              </div>

              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                  <ImCross onClick={modalClickHandler} />
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative flex-auto pt-1">
              {/* TODO: border color */}
              <div
                className={`${displayedBorderColor} mx-10 mt-3 border-1px text-base leading-relaxed text-lightWhite`}
              >
                <div className="flex-col justify-center text-center">
                  {/* {displayedDataFormat()} */}

                  <div className="mx-6 my-4 flex justify-between">
                    <div className="text-lightGray">Type</div>
                    {/* <div className="">{openCfdDetails.typeOfPosition}</div> */}
                    {/* TODO: i18n */}
                    <div className="">{displayedTypeOfPosition}</div>
                  </div>

                  <div className="mx-6 my-4 flex justify-between">
                    <div className="text-lightGray">Amount</div>
                    <div className="">{openCfdDetails?.amount ?? 0}</div>
                  </div>

                  <div className="mx-6 my-4 flex justify-between">
                    <div className="text-lightGray">PNL</div>
                    <div className={`${displayedPnLColor}`}>$ {openCfdDetails?.pnl.value}</div>
                  </div>

                  <div className="mx-6 my-4 flex justify-between">
                    <div className="text-lightGray">Open Value</div>
                    <div className="">$ {openCfdDetails?.openValue ?? 0}</div>
                  </div>

                  <div className="mx-6 my-4 flex justify-between">
                    <div className="text-lightGray">Open Price</div>
                    <div className="">$ {openCfdDetails?.openPrice ?? 0}</div>
                  </div>

                  <div className="mx-6 my-4 flex justify-between">
                    <div className="text-lightGray">Open Time</div>
                    <div className="">
                      {timestampToString(openCfdDetails?.openTimestamp ?? 0)[0]}{' '}
                      {timestampToString(openCfdDetails?.openTimestamp ?? 0)[1]}
                    </div>
                  </div>

                  <div className="mx-6 my-4 flex justify-between">
                    <div className="text-lightGray">Limit/ Stop</div>
                    <div className="">
                      <span className={`text-lightWhite`}>{openCfdDetails?.takeProfit}</span> /{' '}
                      <span className={`text-lightWhite`}>{openCfdDetails?.stopLoss}</span>
                    </div>
                  </div>

                  <div className="mx-6 my-4 flex justify-between">
                    <div className="text-lightGray">Liquidation Price</div>
                    <div className="">$ {openCfdDetails?.liquidationPrice}</div>
                  </div>

                  <div className="mx-6 my-4 flex justify-between">
                    <div className="text-lightGray">State</div>
                    <div className="">
                      Open
                      <button
                        type="button"
                        className="ml-2 text-tidebitTheme underline underline-offset-2"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`mx-10 mt-3 flex-col space-y-5 text-base leading-relaxed text-lightWhite`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-lightGray">Close at profit</div>
                  <div className="-mr-10">{displayedTakeProfitSetting}</div>
                  <Toggle getToggledState={getToggledTpSetting} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lightGray">Close at loss</div>
                  <div className="-mr-50px">{displayedStopLossSetting}</div>
                  <Toggle
                    getToggledState={getToggledSlSetting}
                    lockedToOpen={guaranteedChecked}
                    initialToggleState={guaranteedChecked}
                    toggleStateFromParent={guaranteedChecked}
                    setToggleStateFromParent={setGuaranteedChecked}
                    // getToggleFunction={getSlToggleFunction}
                  />
                </div>

                {guaranteedStopLoss}

                <RippleButton
                  buttonType="button"
                  className="mt-5 rounded border-0 bg-tidebitTheme px-32 py-2 text-base text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none md:mt-0"
                >
                  Update Position
                </RippleButton>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b p-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  ) : null;

  return <>{isDisplayedDetailedPositionModal}</>;
};

export default PositionDetailsModal;

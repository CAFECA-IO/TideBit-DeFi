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
  // ticker: string;
  // date: string;
  // time: string;
  // typeOfPosition: string;
  // entryPrice: string;
  // exitPrice: string;
  openCfdDetails?: IOpenCFDDetails;
}

const PositionDetailsModal = ({
  // openCfdDetails,
  modalVisible,
  modalClickHandler,
  openCfdDetails,
}: IPositionDetailsModal) => {
  const [takeProfitValue, setTakeProfitValue] = useState(1246.5);
  const [stopLossValue, setStopLossValue] = useState(1320.5);
  const [takeProfitToggle, setTakeProfitToggle] = useState(false);
  const [stopLossToggle, setStopLossToggle] = useState(false);
  const [guaranteedTooltipStatus, setGuaranteedTooltipStatus] = useState(0);

  const [disabledSlToggle, setDisabledSlToggle] = useState(false);
  // const [slToggleState, setSlToggleState] = useState(false);
  const [guaranteedChecked, setGuaranteedChecked] = useState(false);

  const getToggledTpSetting = (bool: boolean) => {
    setTakeProfitToggle(bool);
  };

  const getToggledSlSetting = (bool: boolean) => {
    setStopLossToggle(bool);
  };

  const getSlToggleFunction = (slToggleFunction: () => void) => {
    slToggleFunction();
  };

  const isDisplayedTakeProfitSetting = takeProfitToggle ? 'flex' : 'invisible';
  const isDisplayedStopLossSetting = stopLossToggle || disabledSlToggle ? 'flex' : 'invisible';

  const displayedTakeProfitSetting = (
    <div className={`${isDisplayedTakeProfitSetting}`}>
      <TradingInput
        lowerLimit={0}
        upperLimit={1000000}
        inputInitialValue={takeProfitValue}
        inputValue={takeProfitValue}
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
        lowerLimit={0}
        upperLimit={1000000}
        inputInitialValue={stopLossValue}
        inputValue={stopLossValue}
        inputPlaceholder="stop-loss setting"
        inputName="slInput"
        inputSize="h-25px w-70px text-sm"
        decrementBtnSize="25"
        incrementBtnSize="25"
      />
    </div>
  );
  const guaranteedCheckedChangeHandler = () => {
    setGuaranteedChecked(!guaranteedChecked);
    // console.log(guaranteedChecked);
    // slToggleDisabledDetector();
    if (!guaranteedChecked) {
      setDisabledSlToggle(true);
    } else {
      setDisabledSlToggle(false);
    }
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

  const displayedDataFormat = () => {
    const elements = [];
    for (const [key, value] of Object.entries(dataFormat)) {
      elements.push(
        <div className="mx-6 my-5 flex justify-between">
          <div className="text-lightGray">{key}</div>
          <div className="">{value}</div>
        </div>
      );
    }
    return elements;
  };

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
                  <h3 className="">ETH </h3>
                </div>

                <div className="text-end text-base text-lightGray">
                  <p className="">2022-05-30</p>
                  <p className="">13:04:57</p>
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
              <div
                className={`${BORDER_COLOR_TYPE.profit} mx-10 mt-3 border-1px text-base leading-relaxed text-lightWhite`}
              >
                <div className="flex-col justify-center text-center">
                  {/* {displayedDataFormat()} */}

                  <div className="mx-6 my-4 flex justify-between">
                    <div className="text-lightGray">Type</div>
                    {/* <div className="">{openCfdDetails.typeOfPosition}</div> */}
                    <div className="">Up (Buy)</div>
                  </div>

                  <div className="mx-6 my-4 flex justify-between">
                    <div className="text-lightGray">Amount</div>
                    <div className="">0.1</div>
                  </div>

                  <div className="mx-6 my-4 flex justify-between">
                    <div className="text-lightGray">PNL</div>
                    <div className={`${PNL_COLOR_TYPE.profit}`}>$ +34.9</div>
                  </div>

                  <div className="mx-6 my-4 flex justify-between">
                    <div className="text-lightGray">Open Value</div>
                    <div className="">$ 656.9</div>
                  </div>

                  <div className="mx-6 my-4 flex justify-between">
                    <div className="text-lightGray">Open Price</div>
                    <div className="">$ 131.8</div>
                  </div>

                  <div className="mx-6 my-4 flex justify-between">
                    <div className="text-lightGray">Open Time</div>
                    <div className="">2022-05-30 13:04:57</div>
                  </div>

                  <div className="mx-6 my-4 flex justify-between">
                    <div className="text-lightGray">Limit/ Stop</div>
                    <div className="">- / -</div>
                  </div>

                  <div className="mx-6 my-4 flex justify-between">
                    <div className="text-lightGray">Liquidation Price</div>
                    <div className="">$ 1182.5</div>
                  </div>

                  <div className="mx-6 my-4 flex justify-between">
                    <div className="text-lightGray">State</div>
                    <div className="">
                      Open{' '}
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
                    disabled={disabledSlToggle}
                    // initialToggleState={slToggleState}
                    // toggleStateFromParent={slToggleState}
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

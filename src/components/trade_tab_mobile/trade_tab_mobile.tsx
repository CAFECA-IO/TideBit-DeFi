import React, {useState, useContext} from 'react';
import {UserContext} from '../../lib/contexts/user_context';
import {ImCross} from 'react-icons/im';
import Toggle from '../toggle/toggle';
import TradingInput from '../trading_input/trading_input';
import UserOverview from '../user_overview/user_overview';
import {AiOutlineQuestionCircle} from 'react-icons/ai';
import RippleButton from '../ripple_button/ripple_button';

const TradeTabMobile = () => {
  const [longTooltipStatus, setLongTooltipStatus] = useState(0);
  const [shortTooltipStatus, setShortTooltipStatus] = useState(0);

  const [inputValue, setInputValue] = useState(0.02);

  const [activeTab, setActiveTab] = useState('');
  const [openSubMenu, setOpenSubMenu] = useState(false);

  const [longTpValue, setLongTpValue] = useState(1388.1);
  const [longSlValue, setLongSlValue] = useState(1328.2);
  const [longTpToggle, setLongTpToggle] = useState(false);
  const [longSlToggle, setLongSlToggle] = useState(false);

  const [shortTpValue, setShortTpValue] = useState(1329.3);
  const [shortSlValue, setShortSlValue] = useState(1388.4);
  const [shortTpToggle, setShortTpToggle] = useState(false);
  const [shortSlToggle, setShortSlToggle] = useState(false);

  const {user} = useContext(UserContext);

  const isDisplayedLongSlSetting = longSlToggle ? 'flex' : 'invisible';
  const isDisplayedShortSlSetting = shortSlToggle ? 'flex' : 'invisible';

  const isDisplayedLongTpSetting = longTpToggle ? 'flex' : 'invisible';
  const isDisplayedShortTpSetting = shortTpToggle ? 'flex' : 'invisible';

  const getToggledLongTpSetting = (bool: boolean) => {
    // console.log('getToggledLongTpSetting', bool);
    setLongTpToggle(bool);
  };

  const getToggledLongSlSetting = (bool: boolean) => {
    // console.log('getToggledLongSlSetting', bool);
    setLongSlToggle(bool);
  };

  const getToggledShortTpSetting = (bool: boolean) => {
    // console.log('getToggledShortTpSetting', bool);
    setShortTpToggle(bool);
  };

  const getToggledShortSlSetting = (bool: boolean) => {
    // console.log('getToggledShortSlSetting', bool);
    setShortSlToggle(bool);
  };

  const longSectionClickHandler = () => {
    setActiveTab('Long');
    setOpenSubMenu(true);
    setShortTpToggle(false);
    setShortSlToggle(false);
  };

  const shortSectionClickHandler = () => {
    setActiveTab('Short');
    setOpenSubMenu(true);
    setLongTpToggle(false);
    setLongSlToggle(false);
  };

  const longButtonStyles =
    activeTab === 'Long' && openSubMenu ? 'z-50 w-320px -translate-x-16 absolute' : 'w-120px'; //z-50 w-320px -translate-x-16 absolute

  const shortButtonStyles =
    activeTab === 'Short' && openSubMenu ? 'z-50 w-320px -translate-x-16 absolute' : 'ml-4 w-120px'; //z-50 w-320px -translate-x-16 absolute

  // ----------short area----------
  const displayedShortTpSetting = (
    <div className={isDisplayedShortTpSetting}>
      <TradingInput
        lowerLimit={0}
        upperLimit={1000000}
        inputInitialValue={shortTpValue}
        inputPlaceholder="profit-taking setting"
        inputName="shortTpInput"
        inputSize="h-25px w-70px text-sm"
        decrementBtnSize="25"
        incrementBtnSize="25"
      />
    </div>
  );

  const displayedShortSlSetting = (
    <div className={isDisplayedShortSlSetting}>
      <TradingInput
        lowerLimit={0}
        upperLimit={1000000}
        inputInitialValue={shortSlValue}
        inputValue={shortSlValue}
        inputPlaceholder="stop-loss setting"
        inputName="shortSlInput"
        inputSize="h-25px w-70px text-sm"
        decrementBtnSize="25"
        incrementBtnSize="25"
      />
    </div>
  );

  const shortGuaranteedStop = (
    <div className={isDisplayedShortSlSetting}>
      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          value=""
          className="h-5 w-5 rounded text-lightWhite accent-tidebitTheme"
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
              onMouseEnter={() => setShortTooltipStatus(3)}
              onMouseLeave={() => setShortTooltipStatus(0)}
            >
              <div className="cursor-pointer">
                <AiOutlineQuestionCircle size={20} />
              </div>
              {shortTooltipStatus == 3 && (
                <div
                  role="tooltip"
                  className="absolute -top-120px -left-52 z-20 mr-8 w-56 rounded bg-darkGray8 p-4 shadow-lg transition duration-150 ease-in-out"
                >
                  <p className="pb-1 text-sm font-medium text-white">
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

  // ----------long area----------
  const displayedLongTpSetting = (
    <div className={isDisplayedLongTpSetting}>
      <TradingInput
        lowerLimit={0}
        upperLimit={1000000}
        inputInitialValue={longTpValue}
        inputPlaceholder="profit-taking setting"
        inputName="longTpInput" //?
        inputSize="h-25px w-70px text-sm"
        decrementBtnSize="25"
        incrementBtnSize="25"
      />
    </div>
  );

  const displayedLongSlSetting = (
    <div className={isDisplayedLongSlSetting}>
      <TradingInput
        lowerLimit={0}
        upperLimit={1000000}
        inputPlaceholder="stop-loss setting"
        inputInitialValue={longSlValue}
        inputName="shortlInput"
        inputSize="h-25px w-70px text-sm"
        decrementBtnSize="25"
        incrementBtnSize="25"
      />
    </div>
  );

  const longGuaranteedStop = (
    <div className={`${isDisplayedLongSlSetting} mt-4 items-center`}>
      <input
        type="checkbox"
        value=""
        className="h-5 w-5 rounded text-lightWhite accent-tidebitTheme"
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
            onMouseEnter={() => setLongTooltipStatus(3)}
            onMouseLeave={() => setLongTooltipStatus(0)}
          >
            <div className="cursor-pointer">
              <AiOutlineQuestionCircle size={20} />
            </div>
            {longTooltipStatus == 3 && (
              <div
                role="tooltip"
                className="absolute -top-120px -left-52 z-20 mr-8 w-56 rounded bg-darkGray8 p-4 shadow-lg transition duration-150 ease-in-out"
              >
                <p className="pb-1 text-sm font-medium text-white">
                  Guaranteed stop will force the position to close at your chosen rate (price) even
                  if the market price surpasses it.
                </p>
              </div>
            )}
          </div>
        </div>
      </label>
    </div>
  );

  const longSetting = (
    <>
      {/* Take Profit Setting */}
      <div className="flex w-full items-center justify-between px-1">
        <div className="text-sm text-lightGray">Close at profit</div>
        {displayedLongTpSetting}
        <Toggle initialToggleState={longTpToggle} getToggledState={getToggledLongTpSetting} />
      </div>

      {/* Stop Loss Setting */}
      <div className="flex w-full flex-col items-center justify-between px-1">
        <div className="flex w-full items-center justify-between">
          <div className="text-sm text-lightGray">Clost at loss</div>
          <div className="w-105px">{displayedLongSlSetting}</div>
          <Toggle initialToggleState={longSlToggle} getToggledState={getToggledLongSlSetting} />
        </div>
        {/* Guaranteed stop */}
        {longGuaranteedStop}
      </div>
    </>
  );

  const shortSetting = (
    <>
      {/* Take Profit Setting */}
      <div className="flex w-full items-center justify-between px-1">
        <div className="text-sm text-lightGray">Close at profit</div>
        {displayedShortTpSetting}
        <Toggle initialToggleState={shortTpToggle} getToggledState={getToggledShortTpSetting} />
      </div>

      {/* Stop Loss Setting */}
      <div className="flex w-full flex-col items-center justify-between px-1">
        <div className="flex w-full items-center justify-between">
          <div className="text-sm text-lightGray">Clost at loss</div>
          <div className="w-105px">{displayedShortSlSetting}</div>
          <Toggle initialToggleState={shortSlToggle} getToggledState={getToggledShortSlSetting} />
        </div>
        {/* Guaranteed stop */}
        {shortGuaranteedStop}
      </div>
    </>
  );

  const currentSubMenu = (
    <div className="h-auto w-screen px-8 sm:w-1/2">
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="flex w-full items-center justify-center">
          <UserOverview
            depositAvailable={user?.balance?.available ?? 0}
            marginLocked={user?.balance?.locked ?? 0}
            profitOrLossAmount={user?.balance?.PNL ?? 0}
          />
        </div>
        <div className="flex w-full items-center justify-center">
          <TradingInput
            lowerLimit={0}
            upperLimit={1000000}
            inputInitialValue={inputValue}
            inputPlaceholder="margin input"
            inputName="marginInput"
            inputSize="h-44px w-full text-xl"
            decrementBtnSize="44"
            incrementBtnSize="44"
          />
        </div>

        {/* ---universal trading info area--- */}
        <div className="flex w-full flex-col items-center justify-center text-lightGray">
          <div className="flex justify-center text-sm">ETH</div>
          <div className="mt-2 flex flex-col items-center justify-center">
            <div className="text-sm">Leverage</div>
            <div className="text-base text-lightWhite">1:5</div>
          </div>
        </div>

        {/* ---custom trading info area--- */}
        <div className="flex w-full items-center justify-center text-center text-base tracking-wide">
          <div className="w-full space-y-1">
            <div className="text-sm text-lightGray">Required Margin</div>
            <div className="text-base text-lightWhite">$ 13.14 USDT</div>
          </div>

          <div>
            {/* ml-1 mr-5  */}
            <span className="mx-5 inline-block h-14 w-px rounded bg-lightGray/50"></span>
          </div>

          <div className="w-full space-y-1">
            <div className="text-sm text-lightGray">Value</div>
            <div className="text-base text-lightWhite">$ 65.69 USDT</div>
          </div>
        </div>
        {/* Take Profit & Stop Loss Setting */}
        {activeTab === 'Long' ? longSetting : shortSetting}
      </div>
    </div>
  );

  const subMenu = (
    <div
      className={`flex h-screen w-screen flex-col items-center bg-darkGray ${
        openSubMenu ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-full opacity-0'
      } absolute left-0 ${'bottom-76px'} overflow-hidden pt-40 transition-all duration-150`}
    >
      <div className="mb-3 mr-30px flex self-end sm:pr-30px">
        <ImCross onClick={() => setOpenSubMenu(false)} className="cursor-pointer" />
      </div>
      {currentSubMenu}
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between">
        {/* Long Button */}
        <div className={`bg-black/100 transition-all duration-300 ease-in-out ${longButtonStyles}`}>
          <RippleButton
            buttonType="button"
            className={`w-full rounded-md bg-lightGreen5 py-2 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightGreen5/80`}
            onClick={longSectionClickHandler}
          >
            <b>UP</b> <br />
            <p className="text-xs">Above $ 1545.0</p>
          </RippleButton>
        </div>

        {/* Short Button */}
        <div
          className={`bg-black/100 transition-all duration-300 ease-in-out ${shortButtonStyles}`}
        >
          <RippleButton
            buttonType="button"
            className={`w-full rounded-md bg-lightRed py-2 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-lightRed/80`}
            onClick={shortSectionClickHandler}
          >
            <b>Down</b> <br />
            <p className="text-xs">Below $ 1030.0</p>
          </RippleButton>
        </div>
      </div>
      {subMenu}
    </>
  );
};

export default TradeTabMobile;

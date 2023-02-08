import React, {useState, useContext} from 'react';
import {UserContext} from '../../lib/contexts/user_context';
import {ImCross} from 'react-icons/im';
import Toggle from '../toggle/toggle';
import TradingInput from '../trading_input/trading_input';
import UserOverview from '../user_overview/user_overview';
import {AiOutlineQuestionCircle} from 'react-icons/ai';
import RippleButton from '../ripple_button/ripple_button';
import {UNIVERSAL_NUMBER_FORMAT_LOCALE} from '../../constants/display';
import {MARGIN_LIMIT_DIGITS} from '../../constants/config';

const TradeTabMobile = () => {
  // TODO: Use Stop loss limit and other data from Market context
  // TODO: USER_BALANCE from userContext
  const MARKET_PRICE = 6290.41;
  const LIQUIDATION_PRICE = 7548;
  const USER_BALANCE = 1000;
  const LEVERAGE = 5;
  const guranteedStopFee = 0.97;
  const longPrice = (MARKET_PRICE * 1.008).toFixed(2); // market price * (1+spread)
  const shortPrice = (MARKET_PRICE * 0.992).toFixed(2); // market price * (1-spread)
  const longRecommendedTp = Number((MARKET_PRICE * 1.15).toFixed(2)); // recommendedTp // MARKET_PRICE * 1.15
  const longRecommendedSl = Number((MARKET_PRICE * 0.85).toFixed(2)); // recommendedSl // MARKET_PRICE * 0.85

  const roundToDecimalPlaces = (val: number, precision: number): number => {
    const roundedNumber = Number(val.toFixed(precision));
    return roundedNumber;
  };

  const [longTooltipStatus, setLongTooltipStatus] = useState(0);
  const [shortTooltipStatus, setShortTooltipStatus] = useState(0);

  const [margingInputValue, setMarginInputValue] = useState(0.02);

  const [longTpValue, setLongTpValue] = useState(longRecommendedTp);
  const [longSlValue, setLongSlValue] = useState(longRecommendedSl);
  const [longTpToggle, setLongTpToggle] = useState(false);
  const [longSlToggle, setLongSlToggle] = useState(false);

  const [shortTpValue, setShortTpValue] = useState(longRecommendedSl);
  const [shortSlValue, setShortSlValue] = useState(longRecommendedTp);
  const [shortTpToggle, setShortTpToggle] = useState(false);
  const [shortSlToggle, setShortSlToggle] = useState(false);

  const [activeTab, setActiveTab] = useState('Long');
  const [openSubMenu, setOpenSubMenu] = useState(false);

  const [requiredMargin, setRequiredMargin] = useState(
    roundToDecimalPlaces((margingInputValue * MARKET_PRICE) / LEVERAGE, 2)
  );
  const [valueOfPosition, setValueOfPosition] = useState(
    roundToDecimalPlaces(margingInputValue * MARKET_PRICE, 2)
  );
  const [marginWarning, setMarginWarning] = useState(false);

  const [marginLength, setMarginLength] = useState(
    roundToDecimalPlaces((margingInputValue * MARKET_PRICE) / LEVERAGE, 2).toString().length
  );
  const [valueOfPositionLength, setValueOfPositionLength] = useState(
    roundToDecimalPlaces(margingInputValue * MARKET_PRICE, 2).toString().length
  );

  const getMarginInputValue = (value: number) => {
    setMarginInputValue(value);
    marginDetection(value);
  };
  const getLongTpValue = (value: number) => {
    setLongTpValue(value);
  };

  const getLongSlValue = (value: number) => {
    setLongSlValue(value);
  };

  const getShortTpValue = (value: number) => {
    setShortTpValue(value);
  };

  const getShortSlValue = (value: number) => {
    setShortSlValue(value);
  };

  const marginDetection = (value: number) => {
    const newValueOfPosition = value * MARKET_PRICE;
    const roundedValueOfPosition = roundToDecimalPlaces(newValueOfPosition, 2);
    setValueOfPosition(roundedValueOfPosition);

    const margin = newValueOfPosition / 5;
    const roundedMargin = roundToDecimalPlaces(margin, 2);
    setRequiredMargin(roundedMargin);

    setMarginWarning(margin > USER_BALANCE);

    setMarginLength(roundedMargin.toString().length);
    setValueOfPositionLength(roundedValueOfPosition.toString().length);
  };

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

  const isDisplayedLongSlSetting = longSlToggle ? 'flex' : 'invisible';
  const isDisplayedShortSlSetting = shortSlToggle ? 'flex' : 'invisible';

  const isDisplayedLongTpSetting = longTpToggle ? 'flex' : 'invisible';
  const isDisplayedShortTpSetting = shortTpToggle ? 'flex' : 'invisible';

  const isDisplayedMarginStyle = marginWarning ? 'text-lightGray' : 'text-lightWhite';
  const isDisplayedMarginWarning = marginWarning ? 'flex' : 'invisible';
  const isDisplayedMarginSize = marginLength > 7 ? 'text-sm' : 'text-base';
  const isDisplayedValueSize = valueOfPositionLength > 7 ? 'text-sm' : 'text-base';
  const isDisplayedDividerSpacing =
    valueOfPositionLength > 10 || marginLength > 10 ? 'top-430px' : 'top-420px';

  // ----------margin area----------
  const displayedMarginSetting = (
    <TradingInput
      lowerLimit={0}
      upperLimit={MARGIN_LIMIT_DIGITS}
      getInputValue={getMarginInputValue}
      inputInitialValue={margingInputValue}
      inputValueFromParent={margingInputValue}
      setInputValueFromParent={setMarginInputValue}
      inputPlaceholder="margin input"
      inputName="marginInput"
      inputSize="h-44px w-160px text-xl"
      decrementBtnSize="44"
      incrementBtnSize="44"
    />
  );

  const displayedRequiredMarginStyle = (
    <>
      {/* <div className="mt-1 text-base text-lightWhite">$ 13.14 USDT</div> */}
      <div className={`${isDisplayedMarginStyle} ${isDisplayedMarginSize} mt-1 text-base`}>
        $ {requiredMargin?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)} USDT
      </div>
      <div className={`${isDisplayedMarginWarning} ml-3 text-xs text-lightRed`}>
        * Not enough margin
      </div>
    </>
  );

  // ----------long area----------
  const displayedLongTpSetting = (
    <div className={isDisplayedLongTpSetting}>
      <TradingInput
        lowerLimit={0}
        inputInitialValue={longTpValue}
        inputValueFromParent={longTpValue}
        setInputValueFromParent={setLongTpValue}
        getInputValue={getLongTpValue}
        inputPlaceholder="profit-taking setting"
        inputName="longTpInput"
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
        inputInitialValue={longSlValue}
        inputValueFromParent={longSlValue}
        setInputValueFromParent={setLongSlValue}
        getInputValue={getLongSlValue}
        inputPlaceholder="stop-loss setting"
        inputName="longSlInput"
        inputSize="h-25px w-70px text-sm"
        decrementBtnSize="25"
        incrementBtnSize="25"
      />
    </div>
  );

  const longGuaranteedStop = (
    <div className={`${isDisplayedLongSlSetting}`}>
      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          value=""
          className="h-5 w-5 rounded text-lightWhite accent-tidebitTheme"
        />
        <label className="ml-2 flex text-sm font-medium text-lightGray">
          Guaranteed stop &nbsp;
          <span className="text-lightWhite"> (Fee: {guranteedStopFee})</span>
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

  const longSetting = (
    <div
      className={`${activeTab === 'Long' ? 'flex' : 'hidden'} flex-col items-center justify-center`}
    >
      {/* Take Profit Setting */}
      <div className="flex w-full items-center justify-between p-2">
        <div className="text-sm text-lightGray">Close at profit</div>
        {displayedLongTpSetting}
        <Toggle initialToggleState={longTpToggle} getToggledState={getToggledLongTpSetting} />
      </div>

      {/* Stop Loss Setting */}
      <div className="flex w-full flex-col items-center justify-between p-2">
        <div className="flex w-full items-center justify-between">
          <div className="text-sm text-lightGray">Clost at loss</div>
          <div className="w-105px">{displayedLongSlSetting}</div>
          <Toggle initialToggleState={longSlToggle} getToggledState={getToggledLongSlSetting} />
        </div>
        {/* Guaranteed stop */}
        {longGuaranteedStop}
      </div>
    </div>
  );

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

  const shortSetting = (
    <div
      className={`${
        activeTab === 'Short' ? 'flex' : 'hidden'
      } flex-col items-center justify-center`}
    >
      {/* Take Profit Setting */}
      <div className="flex w-full items-center justify-between p-2">
        <div className="text-sm text-lightGray">Close at profit</div>
        {displayedShortTpSetting}
        <Toggle initialToggleState={shortTpToggle} getToggledState={getToggledShortTpSetting} />
      </div>

      {/* Stop Loss Setting */}
      <div className="flex w-full flex-col items-center justify-between p-2">
        <div className="flex w-full items-center justify-between">
          <div className="text-sm text-lightGray">Clost at loss</div>
          <div className="w-105px">{displayedShortSlSetting}</div>
          <Toggle initialToggleState={shortSlToggle} getToggledState={getToggledShortSlSetting} />
        </div>
        {/* Guaranteed stop */}
        {shortGuaranteedStop}
      </div>
    </div>
  );

  const longSectionClickHandler = () => {
    setActiveTab('Long');
    setOpenSubMenu(true);
  };

  const shortSectionClickHandler = () => {
    setActiveTab('Short');
    setOpenSubMenu(true);
  };

  const longButtonStyles =
    activeTab === 'Long' && openSubMenu ? 'z-50 w-320px -translate-x-16 absolute' : 'w-120px'; //z-50 w-320px -translate-x-16 absolute

  const shortButtonStyles =
    activeTab === 'Short' && openSubMenu ? 'z-50 w-320px -translate-x-16 absolute' : 'ml-4 w-120px'; //z-50 w-320px -translate-x-16 absolute

  const {user} = useContext(UserContext);

  const subMenu = (
    <div
      className={`flex h-screen w-screen flex-col items-center bg-darkGray ${
        openSubMenu ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-full opacity-0'
      } absolute left-0 ${'bottom-76px'} overflow-hidden pt-40 transition-all duration-150`}
    >
      <div className="mb-3 mr-30px flex self-end sm:pr-30px">
        <ImCross onClick={() => setOpenSubMenu(false)} className="cursor-pointer" />
      </div>

      {/* ---------- margin setting ---------- */}
      <div className="w-screen px-8 sm:w-1/2">
        <div className="flex flex-col items-center justify-between space-y-3">
          <div className="flex w-full items-center justify-center">
            <UserOverview
              depositAvailable={user?.balance?.available ?? 0}
              marginLocked={user?.balance?.locked ?? 0}
              profitOrLossAmount={user?.balance?.PNL ?? 0}
            />
          </div>
          <div className="flex w-full items-center justify-center">{displayedMarginSetting}</div>

          {/* ---universal trading info area--- */}
          <div className="flex w-full flex-col items-center justify-center text-lightGray">
            <div className="flex justify-center text-sm">ETH</div>
            <div className="mt-2 flex flex-col items-center justify-center">
              <div className="text-sm">Leverage</div>
              <div className="text-base text-lightWhite">1:5</div>
            </div>
          </div>

          {/* ---custom trading info area--- */}
          <div className="flex w-full justify-center text-center text-base tracking-wide">
            <div className="w-1/2">
              <div className="text-sm text-lightGray">Required Margin</div>
              {displayedRequiredMarginStyle}
            </div>

            <div>
              {/* ml-1 mr-5  */}
              <span className="mx-5 inline-block h-14 w-px rounded bg-lightGray/50"></span>
            </div>

            <div className="w-1/2">
              <div className="text-sm text-lightGray">Value</div>${' '}
              {valueOfPosition?.toLocaleString(UNIVERSAL_NUMBER_FORMAT_LOCALE)} USDT
            </div>
          </div>
          {/* Take Profit & Stop Loss Setting */}
          {longSetting}
          {shortSetting}
          {/* activeTab === 'Long' ? longSetting : shortSetting */}
        </div>
      </div>
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
            <p className="text-xs">Above $ {longPrice}</p>
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
            <p className="text-xs">Below $ {shortPrice}</p>
          </RippleButton>
        </div>
      </div>
      {subMenu}
    </>
  );
};

export default TradeTabMobile;

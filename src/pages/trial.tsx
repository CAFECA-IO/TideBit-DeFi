import CryptoCard from '../components/card/crypto_card';
import OpenPositionItem from '../components/open_position_item/open_position_item';
import TrialComponent from '../components/trial_component/trial_component';
import TickerSelectorBox from '../components/ticker_selector_box/ticker_selector_box';
import useOuterClick from '../lib/hooks/use_outer_click';
// import HorizontalRelativeLineGraph from '../components/horizontal_relative_line_graph/horizontal_relative_line_graph';
import PositionLineGraph from '../components/position_line_graph/position_line_graph';
import RippleButton from '../components/ripple_button/ripple_button';

const Trial = () => {
  const {
    targetRef: tickerBoxRef,
    componentVisible: tickerBoxVisible,
    setComponentVisible: setTickerBoxVisible,
  } = useOuterClick<HTMLDivElement>(true);

  const tickerBoxClickHandler = () => {
    setTickerBoxVisible(!tickerBoxVisible);
  };

  const flowTest = (
    <>
      <button
        data-tooltip-target="tooltip-top"
        data-tooltip-placement="top"
        type="button"
        className="mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:mb-0"
      >
        Tooltip top
      </button>
      <div
        id="tooltip-top"
        role="tooltip"
        className="invisible absolute z-10 inline-block rounded-lg bg-gray-900 py-2 px-3 text-sm font-medium text-white opacity-0 shadow-sm dark:bg-gray-700"
      >
        Tooltip on top
        <div className="" data-popper-arrow></div>
      </div>
    </>
  );

  const rippleEffect = (
    <div className="flex justify-center space-x-2">
      <button
        type="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        className="inline-block rounded bg-blue-600 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
      >
        Button
      </button>
    </div>
  );

  return (
    <>
      {/* flex h-screen w-full items-center justify-center */}
      <div className="w-full space-y-10 p-10">
        <TrialComponent />
        {/* <TestReserveRatio />
        {rippleEffect} */}
        {/* -------------Open position trial------------- */}
        {/* <OpenPositionItem
          profitOrLoss="profit"
          longOrShort="short"
          value={1234567.8}
          ticker="BTC"
          passedHour={23}
          profitOrLossAmount={1234.5}
          tickerTrendArray={[90, 72, 60, 65, 42, 25, 32, 20, 15, 32, 48, 20]}
          horizontalValueLine={80}
        />{' '} */}
        {/*  dataArray={[1230, 1272, 1120, 1265, 1342, 1299]} */}
        {/* <div className="relative">
          <div className="">
            <PositionLineGraph
              strokeColor={[`#1AE2A0`]}
              dataArray={[90, 72, 60, 65, 42, 25]}
              lineGraphWidth="180"
              annotatedValue={50}
            />
          </div>

          <div className="absolute -top-5">
            <HorizontalRelativeLineGraph
              strokeColor={[`#A5C4F3`]}
              dataArray={[90, 72, 60, 65, 42, 25]}
              lineGraphWidth="250"
              annotatedValue={50}
            />
          </div>
        </div> */}

        {/* Divider */}
        <div className="my-auto h-px w-full rounded bg-white/50"></div>
        {/* -------------Open position trial------------- */}
        {/* <CryptoCard
          star={true}
          className="mt-4 ml-4"
          chain="Ethereum"
          currency="ETH"
          price={1288.4}
          fluctuating={1.14}
          gradientColor="border-bluePurple/50 bg-black from-bluePurple/50 to-black"
          tokenComponent={<img src="/elements/group_2371.svg" alt="eth" width={40} height={40} />}
        />{' '} */}
        {/* <TickerSelectorModal
          tickerSelectorModalRef={tickerBoxRef}
          tickerSelectorModalVisible={tickerBoxVisible}
          tickerSelectorModalClickHandler={tickerBoxClickHandler}
        />{' '} */}
        {/* <RippleButton className="bg-blue-400">Ripple</RippleButton> */}
      </div>
    </>
  );
};

export default Trial;

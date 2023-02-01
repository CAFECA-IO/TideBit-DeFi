import CryptoCard from '../components/card/crypto_card';
import OpenPositionItem from '../components/open_position_item/open_position_item';
import TrialComponent from '../components/trial_component/trial_component';
import TickerSelectorBox from '../components/ticker_selector_box/ticker_selector_box';
import useOuterClick from '../lib/hooks/use_outer_click';
// import HorizontalRelativeLineGraph from '../components/horizontal_relative_line_graph/horizontal_relative_line_graph';
import PositionLineGraph from '../components/position_line_graph/position_line_graph';
import RippleButton from '../components/ripple_button/ripple_button';
import TradingLineGraphChart from '../components/trading_line_graph_chart/trading_line_graph_chart';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {CRYPTO_CARD_COLORS} from '../constants/display';
import {useContext, useState} from 'react';
import {MarketContext} from '../lib/contexts/market_context';
import TransferProcessModal, {
  TRANSFER_PROCESS_MODAL_STEP_CLASSES,
} from '../components/transfer_process_modal/transfer_process_modal';
import CfdPositionModal from '../components/cfd_position_modal/cfd_position_modal';
import PositionDetailsModal from '../components/position_details_modal/position_details_modal';

const Trial = () => {
  const {
    targetRef: tickerBoxRef,
    componentVisible: tickerBoxVisible,
    setComponentVisible: setTickerBoxVisible,
  } = useOuterClick<HTMLDivElement>(true);

  const [modalVisible, setModalVisible] = useState(true);

  const modalClickHandler = () => {
    setModalVisible(!modalVisible);
  };

  const getSubmissionState = (state: 'success' | 'cancellation' | 'fail') => {
    // console.log('result boolean: ', state);
  };

  // const tickerBoxClickHandler = () => {
  //   setTickerBoxVisible(!tickerBoxVisible);
  // };

  const notifyFunction = () => {
    const text = `Hello World`;
    return toast.info(`${text}`, {
      position: 'bottom-left',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: 'dark',
    });
  };

  const dataFormat = {
    id: '202301300005',
    ticker: 'ETH',
    typeOfPosition: 'BUY',
    amount: '0.1',
    PNL: '34.9',
    openValue: '656.9',
    openPrice: '131.8',
    openTime: '2022-05-30 13:04:57', // date + time
    takeProfit: '-',
    stopLoss: '-',
    liquidationPrice: '1183.6',
    state: 'Open',
    guranteedStop: false,
    fee: 0,
    scheduledClosingTimestamp: 123456,
    leverage: 5,
    margin: 200,
  };

  // const []

  // console.log('cryptoCardsData', cryptoCardsData);

  return (
    <>
      {/* flex h-screen w-full items-center justify-center */}
      <div className="w-full space-y-10 bg-cuteBlue">
        <PositionDetailsModal
          // openCfdDetails={dataFormat}
          modalVisible={modalVisible}
          modalClickHandler={modalClickHandler}
        />
        {/* <CfdPositionModal /> */}
        {/* {forCryptoCard} */}
        {/* <TrialComponent /> */}
        {/* Divider */}
        {/* <div className="my-auto h-px w-full rounded bg-white/50"></div> */}
        {/* Toast and gradient */}
        {/* <button
          onClick={notifyFunction}
          className="h-120px w-200px rounded border-0.5px border-lightWhite/50 bg-lightWhite bg-gradient-to-b from-lightWhite/50 to-black p-0 px-5 text-lightWhite opacity-90 shadow-lg"
        >
          Notify!
        </button>

        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme="dark"
          limit={10}
        /> */}
        {/* 
        <RippleButton
          buttonType="button"
          className="mt-4 rounded border-0 bg-cuteBlue py-2 px-5 text-base text-black transition-colors duration-300 hover:cursor-pointer hover:bg-cuteBlue/80 focus:outline-none md:mt-0"
        >
          Show the modal
        </RippleButton> */}
        {/* <TransferProcessModal
          transferOptions={[
            {label: 'USDT', content: 'Tether'},
            {label: 'ETH', content: 'ETH'},
            {label: 'BTC', content: 'BTC'},
            {label: 'USDC', content: 'USD Coin'},
            {label: 'DAI', content: 'DAI'},
            {label: 'BNB', content: 'BNB'},
            {label: 'BCH', content: 'BCH'},
            {label: 'LTC', content: 'LTC'},
            {label: 'ETC', content: 'ETC'},
            {label: 'USX', content: 'USX'},
            {label: 'NEO', content: 'NEO'},
            {label: 'EOS', content: 'EOS'},
          ]}
          getSubmissionState={getSubmissionState}
          transferType="withdraw"
          transferStep="form"
          userAvailableBalance={314.15}
          modalVisible={modalVisible}
          modalClickHandler={modalClickHandler}
        /> */}
      </div>
    </>
  );
};

export default Trial;

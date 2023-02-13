import useOuterClick from '../lib/hooks/use_outer_click';
// import HorizontalRelativeLineGraph from '../components/horizontal_relative_line_graph/horizontal_relative_line_graph';
import PositionLineGraph from '../components/position_line_graph/position_line_graph';
import RippleButton from '../components/ripple_button/ripple_button';
import TradingLineGraphChart from '../components/trading_line_graph_chart/trading_line_graph_chart';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {CRYPTO_CARD_COLORS} from '../constants/display';
import {useContext, useEffect, useState} from 'react';
import {MarketContext} from '../contexts/market_context';
import PositionOpenModal from '../components/position_open_modal/position_open_modal';
import PositionDetailsModal from '../components/position_details_modal/position_details_modal';
import LoadingModal from '../components/loading_modal/loading_modal';
import FailedModal from '../components/failed_modal/failed_modal';
import CanceledModal from '../components/canceled_modal/canceled_modal';
import SuccessfulModal from '../components/successful_modal/successful_modal';
import DepositModal from '../components/deposit_modal/deposit_modal';
import WithdrawalModal from '../components/withdrawal_modal/withdrawal_modal';
import {useGlobal} from '../contexts/global_context';
import {dummyOpenCFDDetails} from '../interfaces/tidebit_defi_background/open_cfd_details';

const Trial = () => {
  const globalCtx = useGlobal();
  const {
    targetRef: tickerBoxRef,
    componentVisible: tickerBoxVisible,
    setComponentVisible: setTickerBoxVisible,
  } = useOuterClick<HTMLDivElement>(true);

  const [mounted, setMounted] = useState(false);

  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    /**
     * @dev `setMounted` to solve `Text content does not match server-rendered HTML.`
     */
    setMounted(true);
    // globalCtx.visibleWithdrawalModalHandler();
    // globalCtx.visibleDepositModalHandler();
    // globalCtx.dataFailedModalHandler({
    //   modalTitle: 'Deposit',
    //   failedTitle: 'Transaction Failed',
    //   failedMsg:
    //     'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et',
    //   btnMsg: 'Try again',
    // });
    // globalCtx.visibleFailedModalHandler();
    // globalCtx.dataSuccessfulModalHandler({
    //   modalTitle: 'Deposit',
    //   // modalContent: 'Deposit Successful',
    //   // btnMsg: 'Go to Wallet',
    // });
    // globalCtx.visibleSuccessfulModalHandler();

    // globalCtx.dataCanceledModalHandler({
    //   modalTitle: 'Withdraw',
    //   modalContent: 'Transaction Canceled',
    // });
    // globalCtx.visibleCanceledModalHandler();

    globalCtx.visibleDepositModalHandler();
  }, []);

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
    guaranteedStop: false,
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
      <div className="w-full space-y-10 bg-transparent">
        {/* {mounted && (
          <PositionOpenModal
            openCfdDetails={dummyOpenCFDDetails}
            modalVisible={modalVisible}
            modalClickHandler={modalClickHandler}
          />
        )} */}

        {/* <LoadingModal
          modalTitle="Wallet Connect"
          modalContent="Connecting..."
          modalVisible={modalVisible}
          modalClickHandler={modalClickHandler}
          // btnMsg="View on Etherscan"
          // btnUrl="https://etherscan.io/"
        /> */}
        {/* <FailedModal
          modalTitle="Deposit"
          modalContent="Transaction failed"
          modalVisible={modalVisible}
          modalClickHandler={modalClickHandler}
          btnMsg="View on Etherscan"
          failedMsg="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et"
        /> */}
        {/* <CanceledModal
          modalTitle="Withdraw"
          modalContent="Transaction failed"
          modalVisible={modalVisible}
          modalClickHandler={modalClickHandler}
          // btnMsg="View on Etherscan"
        /> */}
        {/* <SuccessfulModal
          modalTitle="Withdraw"
          // modalContent="Transaction succeeded"
          modalVisible={modalVisible}
          modalClickHandler={modalClickHandler}
          btnMsg="Done"
        /> */}
      </div>
    </>
  );
};

export default Trial;

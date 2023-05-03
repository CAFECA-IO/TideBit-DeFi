import useOuterClick from '../lib/hooks/use_outer_click';
// import HorizontalRelativeLineGraph from '../components/horizontal_relative_line_graph/horizontal_relative_line_graph';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {useGlobal} from '../contexts/global_context';
import PositionClosedModal from '../components/position_closed_modal/position_closed_modal';
import PositionUpdatedModal from '../components/position_updated_modal/position_updated_modal';
import HistoryPositionModal from '../components/history_position_modal/history_position_modal';
import {AppContext} from '../contexts/app_context';
import RecordSharingBox from '../components/record_sharing_box/record_sharing_box';
import {OrderStatusUnion} from '../constants/order_status_union';
import {getDummyAcceptedCloseCFDOrder} from '../interfaces/tidebit_defi_background/accepted_cfd_order';
import {Currency} from '../constants/currency';
import {toDisplayCFDOrder} from '../lib/common';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale} from '../interfaces/tidebit_defi_background/locale';
import {MarketContext} from '../contexts/market_context';
import {toPng} from 'html-to-image';

const Trial = () => {
  const appCtx = useContext(AppContext);
  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);
  const {
    targetRef: tickerBoxRef,
    componentVisible: tickerBoxVisible,
    setComponentVisible: setTickerBoxVisible,
  } = useOuterClick<HTMLDivElement>(true);
  const recordSharingBoxRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    // convertHTMLToImage()
    // console.log('useEffect', recordSharingBoxRef);

    if (recordSharingBoxRef.current === null) {
      return;
    }

    const png = toPng(recordSharingBoxRef.current, {cacheBust: true})
      .then(dataUrl => {
        const link = document.createElement('a');
        link.download = 'TideBit_DeFi_Record.png';
        link.href = dataUrl;
        link.click();
      })
      .catch(err => {
        // console.log(err);
      });
    // console.log('png', png);
  }, [mounted]);

  const modalClickHandler = () => {
    setModalVisible(!modalVisible);
  };

  const order = toDisplayCFDOrder(
    getDummyAcceptedCloseCFDOrder(Currency.BTC, OrderStatusUnion.SUCCESS)[1].receipt.order,
    []
  );

  // const handleDownloadClick = async () => {
  //   if (recordSharingBoxRef.current) {
  //     // await convertHTMLToImage(recordSharingBoxRef.current, 'record-sharing-box.jpeg');
  //   }
  // };

  const handleDownloadClick = useCallback(() => {
    if (recordSharingBoxRef.current === null) {
      return;
    }

    const png = toPng(recordSharingBoxRef.current, {cacheBust: true})
      .then(dataUrl => {
        const link = document.createElement('a');
        link.download = 'my-image-name.png';
        link.href = dataUrl;
        link.click();
      })
      .catch(err => {
        // console.log(err);
      });

    // console.log('png', png);
  }, [recordSharingBoxRef.current]);

  return (
    <>
      {appCtx.isInit ? (
        <div className="w-full space-y-10 bg-transparent">
          <RecordSharingBox
            // order={order}
            innerRef={recordSharingBoxRef}
            order={marketCtx.sharingOrder}
            // qrcodeUrl="https://tidebit-defi.com/trial"
            boxRef={tickerBoxRef}
            boxVisible={tickerBoxVisible}
            boxClickHandler={modalClickHandler}
          />
          <button onClick={handleDownloadClick}>Download as JPEG</button>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'footer'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default Trial;

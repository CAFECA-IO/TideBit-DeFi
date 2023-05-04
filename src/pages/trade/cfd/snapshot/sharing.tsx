import useOuterClick from '../../../../lib/hooks/use_outer_click';
// import HorizontalRelativeLineGraph from '../components/horizontal_relative_line_graph/horizontal_relative_line_graph';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {useGlobal} from '../../../../contexts/global_context';
import PositionClosedModal from '../../../../components/position_closed_modal/position_closed_modal';
import PositionUpdatedModal from '../../../../components/position_updated_modal/position_updated_modal';
import HistoryPositionModal from '../../../../components/history_position_modal/history_position_modal';
import {AppContext} from '../../../../contexts/app_context';
import RecordSharingBox from '../../../../components/record_sharing_box/record_sharing_box';
import {OrderStatusUnion} from '../../../../constants/order_status_union';
import {getDummyAcceptedCloseCFDOrder} from '../../../../interfaces/tidebit_defi_background/accepted_cfd_order';
import {Currency} from '../../../../constants/currency';
import {toDisplayCFDOrder} from '../../../../lib/common';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale} from '../../../../interfaces/tidebit_defi_background/locale';
import {MarketContext} from '../../../../contexts/market_context';
import {toPng} from 'html-to-image';
import useStateRef from 'react-usestateref';
import {
  ISharingOrder,
  getDummySharingCFDOrder,
} from '../../../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import Image from 'next/image';
import Head from 'next/head';

const Sharing = () => {
  const appCtx = useContext(AppContext);
  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);
  const {
    targetRef: tickerBoxRef,
    componentVisible: tickerBoxVisible,
    setComponentVisible: setTickerBoxVisible,
  } = useOuterClick<HTMLDivElement>(true);
  const [order, setOrder, orderRef] = useStateRef<ISharingOrder>(
    getDummySharingCFDOrder(Currency.BTC)
  );
  const [img, setImg, imgRef] = useStateRef<string>('');

  const recordSharingBoxRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  const fetchSharingOrder = async (cfdId: string) => {
    const sharingOrder = await marketCtx.getSharingOrder(cfdId);
    return sharingOrder;
  };

  const convertToImg = async () => {
    try {
      if (recordSharingBoxRef.current === null) return;
      const img = await toPng(recordSharingBoxRef.current, {cacheBust: true});
      // TODO: 產生一頁圖片
      setImg(img);
    } catch (e) {
      // TODO: Error handling (20230504 - Shirley)
      // eslint-disable-next-line no-console
      console.log(`convertToImg error: ${e}`);
    }
  };

  // TODO: Download png test (20230503 - Shirley)
  useEffect(() => {
    setMounted(true);

    (async () => {
      const result = await fetchSharingOrder('123');
      const data = result.data as ISharingOrder;
      setOrder(data);
      // eslint-disable-next-line no-console
      console.log('orderRef in function', orderRef.current);

      await convertToImg();
      // eslint-disable-next-line no-console
      console.log('in function img', imgRef.current);
      if (!!imgRef.current) {
        setModalVisible(false);
      }
    })();

    // eslint-disable-next-line no-console
    console.log('orderRef', orderRef.current);
  }, [mounted, recordSharingBoxRef.current]);

  const modalClickHandler = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <>
      <Image src="/elements/sharing_example.png" width={500} height={500} alt="record" />
      {/* <div className="w-full space-y-10 bg-transparent">
            <RecordSharingBox
              innerRef={recordSharingBoxRef}
              // order={marketCtx.sharingOrder}
              order={orderRef.current}
              // boxRef={tickerBoxRef}
              boxVisible={modalVisible}
              boxClickHandler={modalClickHandler}
            />
          </div>

          <div>
            {imgRef.current && (
              <Image src={imgRef.current} alt={`TideBit CFD record`} width={500} height={500} />
            )}
          </div> */}
    </>
  );
};

const getStaticPropsFunction = async ({locale}: ILocale) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'footer'])),
  },
});

export const getStaticProps = getStaticPropsFunction;

export default Sharing;

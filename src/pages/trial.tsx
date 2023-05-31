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
import {OrderStatusUnion} from '../constants/order_status_union';
import {getDummyAcceptedCloseCFDOrder} from '../interfaces/tidebit_defi_background/accepted_cfd_order';
import {Currency} from '../constants/currency';
import {toDisplayCFDOrder} from '../lib/common';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {ILocale} from '../interfaces/tidebit_defi_background/locale';
import {MarketContext} from '../contexts/market_context';
import useStateRef from 'react-usestateref';
import Image from 'next/image';
import Head from 'next/head';
import useShareProcess from '../lib/hooks/use_share_process';
import {ShareType} from '../constants/share_type';
import {ShareSettings} from '../constants/social_media';

const Trial = () => {
  const appCtx = useContext(AppContext);
  const globalCtx = useGlobal();
  const marketCtx = useContext(MarketContext);
  const {
    targetRef: tickerBoxRef,
    componentVisible: tickerBoxVisible,
    setComponentVisible: setTickerBoxVisible,
  } = useOuterClick<HTMLDivElement>(true);

  const [img, setImg, imgRef] = useStateRef<string>('');

  const recordSharingBoxRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  const modalClickHandler = () => {
    setModalVisible(!modalVisible);
  };

  const {shareTo} = useShareProcess({
    lockerName: 'trial.testShare',
    shareType: ShareType.RANK,
    shareId: '20230531',
  });

  return (
    <>
      {appCtx.isInit ? (
        <>
          <Head>
            <meta property="og:image" content="https://erikkarlsson.dev/assets/prev.png" />
          </Head>
          <button
            className="rounded-md bg-blue-300 p-2"
            onClick={() =>
              shareTo({
                url: ShareSettings.FACEBOOK.URL,
                appUrl: ShareSettings.FACEBOOK.APP_URL,
                type: ShareSettings.FACEBOOK.TYPE,
                // text: ShareSettings.FACEBOOK.TEXT,
                size: ShareSettings.FACEBOOK.SIZE,
              })
            }
          >
            Share test
          </button>
        </>
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

import useOuterClick from '../lib/hooks/use_outer_click';
// import HorizontalRelativeLineGraph from '../components/horizontal_relative_line_graph/horizontal_relative_line_graph';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {useContext, useEffect, useState} from 'react';

import {useGlobal} from '../contexts/global_context';
import PositionClosedModal from '../components/position_closed_modal/position_closed_modal';
import PositionUpdatedModal from '../components/position_updated_modal/position_updated_modal';
import HistoryPositionModal from '../components/history_position_modal/history_position_modal';
import {AppContext} from '../contexts/app_context';
import RecordSharingBox from '../components/record_sharing_box/record_sharing_box';

const Trial = () => {
  const appCtx = useContext(AppContext);
  const globalCtx = useGlobal();
  const {
    targetRef: tickerBoxRef,
    componentVisible: tickerBoxVisible,
    setComponentVisible: setTickerBoxVisible,
  } = useOuterClick<HTMLDivElement>(true);

  const [mounted, setMounted] = useState(false);

  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    if (!appCtx.isInit) {
      appCtx.init();
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modalClickHandler = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <>
      <div className="w-full space-y-10 bg-transparent">
        <RecordSharingBox
          boxRef={tickerBoxRef}
          boxVisible={tickerBoxVisible}
          boxClickHandler={modalClickHandler}
        />
      </div>
    </>
  );
};

export default Trial;

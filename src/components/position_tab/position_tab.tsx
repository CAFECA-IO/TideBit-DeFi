import React, {useState} from 'react';
import OpenSubTab from '../open_sub_tab/open_sub_tab';
import HistorySubTab from '../history_sub_tab/history_sub_tab';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;
const PositionTab = () => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const [activeTab, setActiveTab] = useState('Open');

  const tabBodyWidth = 'w-320px';

  const openTabClickHandler = () => {
    setActiveTab('Open');
  };

  const historyTabClickHandler = () => {
    setActiveTab('History');
  };

  const currentSubTab = activeTab === 'Open' ? <OpenSubTab /> : <HistorySubTab />;

  const activeOpenTabStyle =
    activeTab == 'Open' ? 'bg-darkGray8 text-lightWhite' : 'bg-darkGray6 text-lightGray';
  const activeHistoryTabStyle =
    activeTab == 'History' ? 'bg-darkGray8 text-lightWhite' : 'bg-darkGray6 text-lightGray';

  const tabPart = (
    <>
      <ul className="mb-2 flex flex-wrap justify-center text-center text-sm font-medium">
        <li className="">
          <button
            onClick={openTabClickHandler}
            className={`${activeOpenTabStyle} inline-block py-1 px-11`}
          >
            {t('TRADE_PAGE.POSITION_TAB_OPEN')}
          </button>
        </li>
        <li className="">
          <button
            onClick={historyTabClickHandler}
            className={`${activeHistoryTabStyle} inline-block py-1 px-11`}
          >
            {t('TRADE_PAGE.POSITION_TAB_HISTORY')}
          </button>
        </li>
      </ul>
    </>
  );
  return (
    <div>
      <div
        className={`pointer-events-none fixed top-82px right-0 z-10 flex overflow-x-hidden overflow-y-hidden outline-none focus:outline-none`}
      >
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {' '}
          <div className={`relative`}>
            {/* sidebar self */}
            <div
              className={`pointer-events-auto ${tabBodyWidth} h-screen bg-darkGray p-5 text-white transition-all duration-300`}
            >
              {tabPart}
              {currentSubTab}
              {/* <h1 className="pl-5 text-2xl font-bold">Order information</h1> */}

              {/* <div className="mt-20">
            <NotificationItem />
          </div>
          <div className="mt-5">
            <NotificationItem />
          </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionTab;

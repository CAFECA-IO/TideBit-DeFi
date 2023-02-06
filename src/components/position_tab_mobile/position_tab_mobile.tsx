import React, {useState} from 'react';
import Image from 'next/image';
import OpenSubTabMobile from '../open_sub_tab_mobile/open_sub_tab_mobile';
import HistorySubTabMobile from '../history_sub_tab_mobile/history_sub_tab_mobile';

const PositionTabMobile = () => {
  const [activeTab, setActiveTab] = useState('Open');
  const [openSubMenu, setOpenSubMenu] = useState(false);

  const subMenuHandler = () => {
    setOpenSubMenu(!openSubMenu);
  };

  const openTabClickHandler = () => {
    setActiveTab('Open');
  };

  const historyTabClickHandler = () => {
    setActiveTab('History');
  };

  const currentSubTab = activeTab === 'Open' ? <OpenSubTabMobile /> : <HistorySubTabMobile />;

  const activeOpenTabStyle =
    activeTab == 'Open' ? 'bg-darkGray8 text-lightWhite' : 'bg-darkGray6 text-lightGray';
  const activeHistoryTabStyle =
    activeTab == 'History' ? 'bg-darkGray8 text-lightWhite' : 'bg-darkGray6 text-lightGray';

  const tabPart = (
    <div
      className={`flex items-center justify-center ${
        openSubMenu ? 'visible opacity-100' : 'invisible opacity-0'
      } absolute left-3 bottom-0 h-70px w-3/4 bg-darkGray transition-all duration-300`}
    >
      <ul className="flex basis-full flex-wrap justify-between text-center text-sm font-medium">
        <li className="">
          <button
            onClick={openTabClickHandler}
            className={`${activeOpenTabStyle} inline-block rounded-md py-3 px-12`}
          >
            Open
          </button>
        </li>
        <li className="">
          <button
            onClick={historyTabClickHandler}
            className={`${activeHistoryTabStyle} inline-block rounded-md py-3 px-12`}
          >
            History
          </button>
        </li>
      </ul>
    </div>
  );

  const subMenu = (
    <div
      className={`flex h-screen w-screen justify-center bg-darkGray pt-150px ${
        openSubMenu ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-full opacity-0'
      } absolute left-0 bottom-16 overflow-hidden transition-all duration-150`}
    >
      {currentSubTab}
    </div>
  );

  return (
    <div className="ml-4 rounded-md bg-darkGray5 p-3">
      {tabPart}
      <button onClick={subMenuHandler} className="m-auto block">
        <Image src="/elements/position_tab_icon.svg" alt="position_icon" width={25} height={25} />
      </button>

      {subMenu}
    </div>
  );
};

export default PositionTabMobile;

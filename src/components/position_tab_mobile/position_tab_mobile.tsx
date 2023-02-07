import React, {useState} from 'react';
import Image from 'next/image';
import {ImCross} from 'react-icons/im';
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
      className={`flex items-center ${
        openSubMenu ? 'visible opacity-100' : 'invisible opacity-0'
      } absolute bottom-0 left-2 xs:left-24 ${'h-76px'} w-3/4 bg-darkGray transition-all duration-300 xs:w-1/2`}
    >
      <ul className="ml-5 flex basis-full items-center text-center text-sm font-medium">
        <li className="w-full">
          <button
            onClick={openTabClickHandler}
            className={`${activeOpenTabStyle} inline-block w-full rounded-md py-3 px-7`}
          >
            Open
          </button>
        </li>
        <li className="ml-1 w-full">
          <button
            onClick={historyTabClickHandler}
            className={`${activeHistoryTabStyle} inline-block w-full rounded-md py-3 px-7`}
          >
            History
          </button>
        </li>
      </ul>
    </div>
  );

  const subMenu = (
    <div
      className={`flex h-screen w-screen flex-col items-center justify-center bg-darkGray ${
        openSubMenu ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-full opacity-0'
      } absolute left-0 ${'bottom-76px'} overflow-hidden pt-40 transition-all duration-150`}
    >
      <div className="mb-3 mr-30px flex self-end sm:pr-30px">
        <ImCross onClick={subMenuHandler} className="cursor-pointer" />
      </div>
      {currentSubTab}
    </div>
  );

  return (
    <div className="ml-4 rounded-md bg-darkGray5 p-3">
      <button onClick={subMenuHandler} className="m-auto block">
        <Image src="/elements/position_tab_icon.svg" alt="position_icon" width={25} height={25} />
      </button>
      {tabPart}

      {subMenu}
    </div>
  );
};

export default PositionTabMobile;

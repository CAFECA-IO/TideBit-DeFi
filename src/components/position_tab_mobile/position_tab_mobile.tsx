import React, {Dispatch, SetStateAction} from 'react';
import Image from 'next/image';
import {ImCross} from 'react-icons/im';
import OpenSubTabMobile from '../open_sub_tab_mobile/open_sub_tab_mobile';
import HistorySubTabMobile from '../history_sub_tab_mobile/history_sub_tab_mobile';

interface PositionTabMobileProps {
  showSubMenu: boolean;
  setShowSubMenu: Dispatch<SetStateAction<boolean>>;
  activeTab: string;
}

const PositionTabMobile = ({showSubMenu, setShowSubMenu, activeTab}: PositionTabMobileProps) => {
  const subMenuHandler = () => {
    setShowSubMenu(!showSubMenu);
  };

  const currentSubTab = activeTab === 'Open' ? <OpenSubTabMobile /> : <HistorySubTabMobile />;

  const subMenu = (
    <div
      className={`flex h-screen w-screen flex-col items-center justify-center bg-darkGray ${
        showSubMenu ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-full opacity-0'
      } absolute left-0 ${'bottom-76px'} overflow-hidden pt-40 transition-all duration-150`}
    >
      <div className="mb-3 mr-30px flex self-end sm:pr-30px">
        <ImCross onClick={subMenuHandler} className="cursor-pointer" />
      </div>
      {currentSubTab}
    </div>
  );

  return (
    <div className="rounded-md bg-darkGray5 p-3">
      <button onClick={subMenuHandler} className="m-auto block">
        <Image src="/elements/position_tab_icon.svg" alt="position_icon" width={25} height={25} />
      </button>

      {subMenu}
    </div>
  );
};

export default PositionTabMobile;

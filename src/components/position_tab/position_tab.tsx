import OpenSubTab from '../open_sub_tab/open_sub_tab';
import HistorySubTab from '../history_sub_tab/history_sub_tab';
import {useTranslation} from 'next-i18next';
import {useGlobal} from '../../contexts/global_context';
import {LayoutAssertion} from '../../constants/layout_assertion';
import {POSITION_TAB} from '../order_section/order_section';
import {ImCross} from 'react-icons/im';
import Image from 'next/image';
import React from 'react';

interface PositionTabProps {
  showSubMenu: boolean;
  subMenuClickHandler: () => void;
  activePositionTabMobile: string;
  openTabClickHandler: () => void;
  historyTabClickHandler: () => void;
  hideOpenLineGraph?: boolean;
  rightPosition: string;
}

type TranslateFunction = (s: string) => string;

const PositionTab = ({
  showSubMenu,
  subMenuClickHandler,
  activePositionTabMobile,
  openTabClickHandler,
  historyTabClickHandler,
  hideOpenLineGraph,
  rightPosition,
}: PositionTabProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const globalCtx = useGlobal();

  const tabBodyWidth = 'w-320px';

  const currentSubTab =
    activePositionTabMobile === POSITION_TAB.OPEN ? (
      <OpenSubTab hideOpenLineGraph={hideOpenLineGraph} />
    ) : (
      <HistorySubTab />
    );

  const activeOpenTabStyle =
    activePositionTabMobile == POSITION_TAB.OPEN
      ? 'bg-darkGray8 text-lightWhite'
      : 'bg-darkGray6 text-lightGray';

  const activeHistoryTabStyle =
    activePositionTabMobile == POSITION_TAB.HISTORY
      ? 'bg-darkGray8 text-lightWhite'
      : 'bg-darkGray6 text-lightGray';

  const tabPart = (
    <>
      <ul className="mb-2 flex flex-wrap justify-center text-center text-sm font-medium">
        <li className="">
          <button
            id="OpenTabButton"
            onClick={openTabClickHandler}
            className={`${activeOpenTabStyle} inline-block px-11 py-1 focus:outline-none outline-none`}
          >
            {t('TRADE_PAGE.POSITION_TAB_OPEN')}
          </button>
        </li>
        <li className="">
          <button
            id="HistoryTabButton"
            onClick={historyTabClickHandler}
            className={`${activeHistoryTabStyle} inline-block px-11 py-1 focus:outline-none outline-none`}
          >
            {t('TRADE_PAGE.POSITION_TAB_HISTORY')}
          </button>
        </li>
      </ul>
    </>
  );

  const subMenu = (
    <div
      className={`flex h-screen w-screen flex-col items-center justify-center bg-darkGray ${
        showSubMenu ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-full opacity-0'
      } absolute left-0 ${'bottom-76px'} overflow-hidden pt-40 transition-all duration-150`}
    >
      <div className="mb-3 mr-30px flex self-end sm:pr-30px">
        <ImCross
          id="PositionMenuMobileCloseButton"
          onClick={subMenuClickHandler}
          className="cursor-pointer"
        />
      </div>
      {currentSubTab}
    </div>
  );

  const desktopLayout = (
    <div
      className={`pointer-events-none fixed right-0 top-82px z-10 flex overflow-x-hidden overflow-y-hidden outline-none focus:outline-none`}
      style={{right: rightPosition}}
    >
      <div className="relative mx-auto my-6 w-auto max-w-xl">
        {' '}
        <div className={`relative`}>
          {/* Info: sidebar self (20230808 - Shirley) */}
          <div
            className={`pointer-events-auto ${tabBodyWidth} h-screen bg-darkGray p-5 text-white transition-all duration-300`}
          >
            {tabPart}
            {currentSubTab}
          </div>
        </div>
      </div>
    </div>
  );

  const mobileLayout = (
    <div className="rounded-md bg-darkGray5 p-3">
      <button id="PositionMenuMobile" onClick={subMenuClickHandler} className="m-auto block">
        <Image src="/elements/position_tab_icon.svg" alt="position_icon" width={25} height={25} />
      </button>

      {subMenu}
    </div>
  );

  const displayedLayout =
    globalCtx.layoutAssertion === LayoutAssertion.MOBILE ? mobileLayout : desktopLayout;

  return <>{displayedLayout}</>;
};

export default PositionTab;

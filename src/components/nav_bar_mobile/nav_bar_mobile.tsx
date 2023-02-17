import React, {useContext, useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import I18n from '../i18n/i18n';
import WalletPanel from '../wallet_panel/wallet_panel';
import Notification from '../notification/notification';
import useOuterClick from '../../lib/hooks/use_outer_click';
import {UserContext} from '../../contexts/user_context';
import {useTranslation} from 'next-i18next';
import UserMobile from '../user_mobile/user_mobile';
import {useGlobal} from '../../contexts/global_context';
import TideButton from '../tide_button/tide_button';
import User from '../user/user';

type TranslateFunction = (s: string) => string;

const NavBarMobile = ({notificationNumber = 1}) => {
  const userCtx = useContext(UserContext);
  const globalCtx = useGlobal();

  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [navOpen, setNavOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [userOverview, setUserOverview] = useState(false);

  //lang sub menu
  const [langIsOpen, setLangIsOpen] = useState(false);

  //menu text
  const MENU_TEXT = langIsOpen ? 'Language' : 'Menu';

  const {
    targetRef: notifyRef,
    componentVisible,
    setComponentVisible,
  } = useOuterClick<HTMLDivElement>(false);

  // // TODO: move to Global COntext
  // const [panelVisible, setPanelVisible] = useState(false);

  // const panelClickHandler = () => {
  //   setPanelVisible(!panelVisible);
  // };

  const wallectConnectBtnClickHandler = () => {
    // setNavOpen(!navOpen);
    globalCtx.visibleWalletPanelHandler();
  };

  const clickHanlder = () => {
    if (langIsOpen) {
      setLangIsOpen(false);
    } else {
      setNavOpen(!navOpen);
    }
  };

  const sidebarOpenHandler = () => {
    setSidebarOpen(!sidebarOpen);
    setComponentVisible(!componentVisible);
    //console.log('sidebarOpenHandler clicked, componentVisible: ', componentVisible);
  };

  const getUserLoginHandler = (bool: boolean) => {
    setUserOverview(bool);
  };

  const hamburgerStyles =
    'block bg-lightWhite h-3px rounded-12px opacity-100 left-0 w-full rotate-0 ease-in duration-300';

  const menuItemStyles =
    'block rounded-md px-3 py-2 font-medium hover:cursor-pointer hover:text-tidebitTheme';

  // hamburger animation
  const displayedMobileNavBarLine1 = !navOpen
    ? 'translate-y-0'
    : 'translate-y-1.5 origin-left w-3/4 -rotate-35';
  const displayedMobileNavBarLine2 = !navOpen ? 'translate-y-1.5' : 'w-0 opacity-0';
  const displayedMobileNavBarLine3 = !navOpen
    ? 'translate-y-3'
    : 'translate-y-0 origin-left w-3/4 rotate-35';

  const isDisplayedMobileNavBar = navOpen ? 'top-14 min-h-screen inset-0 bg-darkGray/100' : '';
  // componentVisible ? 'animate-fadeIn' : 'animate-fadeOut';

  const isDisplayedNotificationSidebarMobileCover = (
    <div
      className={`${
        navOpen ? 'visible opacity-100' : 'invisible opacity-0'
      } fixed top-3 left-20 z-50 flex h-10 w-250px items-center overflow-x-hidden overflow-y-hidden bg-black/100 outline-none`}
    >
      <p className="pl-5">{MENU_TEXT}</p>
    </div>
  );

  const isDisplayedUserOverview = userCtx.enableServiceTerm ? (
    <UserMobile />
  ) : (
    navOpen && (
      <TideButton
        onClick={wallectConnectBtnClickHandler} // show wallet panel
        className={`mt-4 rounded border-0 bg-tidebitTheme py-2 px-5 text-base text-white transition-all hover:opacity-90 md:mt-0`}
      >
        {/* Wallet Connect */}
        {t('nav_bar.WalletConnect')}
      </TideButton>
    )
  );

  const isDisplayedUser = userCtx.enableServiceTerm ? (
    <UserMobile />
  ) : (
    <TideButton
      onClick={wallectConnectBtnClickHandler} // show wallet panel
      className={`rounded border-0 bg-tidebitTheme py-2 px-3 text-sm text-white transition-all hover:opacity-90`}
    >
      {/* Wallet Connect */}
      {t('nav_bar.WalletConnect')}
    </TideButton>
  );

  const dividerInsideMobileNavBar = navOpen && `inline-block h-px w-11/12 rounded bg-lightGray`;

  const userOverviewDividerDesktop = userCtx.enableServiceTerm ? (
    <span className="mx-2 inline-block h-10 w-px rounded bg-lightGray1/50"></span>
  ) : null;

  return (
    <>
      <div className="container fixed inset-x-0 z-40 mx-auto inline-flex max-w-full items-end justify-center bg-black/100 pb-1 text-white lg:hidden">
        <div className="flex w-full items-center justify-between px-5 pb-2">
          <div className="flex basis-full items-end">
            <div className="mr-0 mt-3 flex lg:hidden">
              <button
                onClick={clickHanlder}
                className="z-50 inline-flex items-center justify-center rounded-md p-2"
              >
                <div className="relative h-20px w-30px cursor-pointer">
                  <span className={`${hamburgerStyles} ${displayedMobileNavBarLine1}`}></span>
                  <span className={`${hamburgerStyles} ${displayedMobileNavBarLine2}`}></span>
                  <span className={`${hamburgerStyles} ${displayedMobileNavBarLine3}`}></span>
                </div>
              </button>
            </div>

            <span className="z-50 mx-2 inline-block h-10 w-px rounded bg-lightGray1"></span>

            <div className="flex">
              <button onClick={sidebarOpenHandler} className="relative hover:cursor-pointer">
                <span className="absolute top-0 right-0 z-20 inline-block h-3 w-3 rounded-xl bg-tidebitTheme">
                  <p className="text-center text-3xs hover:text-white">{notificationNumber}</p>
                </span>

                <Image
                  src="/elements/notifications_outline.svg"
                  width={25}
                  height={25}
                  className="mb-1 hover:cursor-pointer hover:text-cyan-300"
                  alt="icon"
                />
              </button>
            </div>

            <div className="invisible ml-auto lg:visible">
              {/* <WalletPanel
                panelVisible={panelVisible}
                panelClickHandler={panelClickHandler}
                // getUserLoginState={getUserLoginHandler}
                className="flex:auto"
              /> */}
            </div>
          </div>
        </div>

        <div
          ref={notifyRef}
          className={`absolute transition-all duration-300 lg:hidden ${isDisplayedMobileNavBar}`}
        >
          {/* Cover for mobile bell icon */}
          {isDisplayedNotificationSidebarMobileCover}

          {/* Mobile menu section */}
          <div className="flex h-screen flex-col items-center justify-start px-2 pt-8 pb-24 text-base sm:px-3">
            <div className="flex h-full w-screen flex-col items-center justify-between">
              <div className="flex items-center justify-start px-3 pt-3">
                <Link className="shrink-0" href="/">
                  <div className="inline-flex items-center hover:cursor-pointer hover:text-cyan-300 hover:opacity-100">
                    <div className="relative h-55px w-150px flex-col justify-center hover:cursor-pointer hover:opacity-80">
                      <Image
                        className=""
                        src={'/elements/nav_logo.svg'}
                        height={50}
                        width={150}
                        alt={'logo'}
                      />
                    </div>
                  </div>
                </Link>
              </div>
              <div className="flex items-center justify-start px-3">
                <Link href="/trade/cfd/cfd" className={menuItemStyles}>
                  {t('nav_bar.Trade')}
                </Link>
              </div>
              <div className="flex items-center justify-start px-3">
                <Link href="#" className={menuItemStyles}>
                  {t('nav_bar.Leaderboard')}
                </Link>
              </div>
              <div className="flex items-center justify-start px-3">
                <Link href="#" className={menuItemStyles}>
                  {t('nav_bar.Support')}
                </Link>
              </div>
              <div className="flex items-center justify-start px-3">
                <div className="px-3 py-2">
                  <I18n langIsOpen={langIsOpen} setLangIsOpen={setLangIsOpen} />
                </div>
                <span className="inline-block h-px w-11/12 rounded bg-cuteBlue"></span>
                {/* <TbMinusVertical size={30} className="" /> */}
              </div>
              {/* <div className="border-b border-cuteBlue"></div> */}
              <span className={`${dividerInsideMobileNavBar}`}></span>
              <div className="flex items-center justify-start px-3 pb-3">
                {isDisplayedUserOverview}
              </div>

              {/* <WalletPanel
                className="ml-2"
                panelVisible={panelVisible}
                panelClickHandler={panelClickHandler}
                // getUserLoginState={getUserLoginHandler}
              />{' '} */}
            </div>
          </div>
          <div className="mb-2 flex w-full justify-end pr-10">{isDisplayedUser}</div>
        </div>
      </div>

      <Notification notifyRef={notifyRef} componentVisible={componentVisible} />
    </>
  );
};

export default NavBarMobile;

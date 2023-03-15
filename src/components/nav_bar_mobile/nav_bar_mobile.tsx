import React, {useContext, useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import I18n from '../i18n/i18n';
import Notification from '../notification/notification';
import useOuterClick from '../../lib/hooks/use_outer_click';
import {UserContext} from '../../contexts/user_context';
import {useTranslation} from 'next-i18next';
import UserMobile from '../user_mobile/user_mobile';
import {useGlobal} from '../../contexts/global_context';
import TideButton from '../tide_button/tide_button';
import UserOverview from '../user_overview/user_overview';
import {NotificationContext} from '../../contexts/notification_context';

type TranslateFunction = (s: string) => string;

const NavBarMobile = () => {
  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);
  const globalCtx = useGlobal();

  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [navOpen, setNavOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  //lang sub menu
  const [langIsOpen, setLangIsOpen] = useState(false);

  //menu text
  const menuText = langIsOpen ? t('NAV_BAR.LANGUAGE') : t('NAV_BAR.MENU');

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

  const hamburgerStyles = 'block bg-lightWhite h-3px rounded-12px w-full ease-in duration-300';

  const menuItemStyles =
    'block rounded-md px-3 py-5 font-medium hover:cursor-pointer hover:text-tidebitTheme';

  // hamburger animation
  const displayedMobileNavBarLine1 = !navOpen
    ? 'translate-y-0 rotate-0'
    : 'translate-y-1.5 origin-left w-3/4 -rotate-35';
  const displayedMobileNavBarLine2 = !navOpen
    ? 'translate-y-1.5 w-full opacity-100'
    : 'w-0 opacity-0';
  const displayedMobileNavBarLine3 = !navOpen
    ? 'translate-y-3 rotate-0'
    : 'translate-y-0 origin-left w-3/4 rotate-35';

  const isDisplayedMobileNavBar = navOpen ? 'top-14 min-h-screen inset-0 bg-darkGray/100' : '';
  // componentVisible ? 'animate-fadeIn' : 'animate-fadeOut';

  const isDisplayedNotificationSidebarMobileCover = (
    <div
      className={`${
        navOpen ? 'visible opacity-100' : 'invisible opacity-0'
      } fixed top-0 left-20 z-50 flex h-14 w-screen items-center overflow-x-hidden overflow-y-hidden bg-black/100 outline-none`}
    >
      <p className="pl-5">{menuText}</p>
    </div>
  );

  const isDisplayedUserOverview = userCtx.enableServiceTerm ? (
    <UserOverview
      depositAvailable={userCtx.balance?.available ?? 0}
      marginLocked={userCtx.balance?.locked ?? 0}
      profitOrLossAmount={userCtx.balance?.PNL ?? 0}
    />
  ) : null;

  const isDisplayedUser = userCtx.enableServiceTerm ? (
    <UserMobile />
  ) : (
    <TideButton
      onClick={wallectConnectBtnClickHandler} // show wallet panel
      className={`rounded border-0 bg-tidebitTheme py-2 px-3 text-sm text-white transition-all duration-300 hover:bg-cyan-600`}
    >
      {/* Wallet Connect */}
      {t('NAV_BAR.WALLET_CONNECT')}
    </TideButton>
  );

  const dividerInsideMobileNavBar = navOpen && `inline-block h-px w-11/12 rounded bg-lightGray`;

  return (
    <>
      <div className="container fixed inset-x-0 z-40 mx-auto inline-flex max-w-full items-end justify-center bg-black/100 pb-1 text-white lg:hidden">
        <div className="flex w-full items-center justify-between px-5 pb-2">
          <div className="flex basis-full items-baseline">
            <div className="mr-0 mt-3 flex border-r border-lightGray1 lg:hidden">
              <button
                onClick={clickHanlder}
                className="z-50 inline-flex items-center justify-center rounded-md p-2"
              >
                <div className="relative h-20px w-30px cursor-pointer">
                  <span
                    className={`${hamburgerStyles} ${displayedMobileNavBarLine1} opacity-100`}
                  ></span>
                  <span className={`${hamburgerStyles} ${displayedMobileNavBarLine2}`}></span>
                  <span
                    className={`${hamburgerStyles} ${displayedMobileNavBarLine3} opacity-100`}
                  ></span>
                </div>
              </button>
            </div>

            <div className="z-50 ml-4 flex">
              <button onClick={sidebarOpenHandler} className="relative hover:cursor-pointer">
                <span className="absolute top-0 right-0 z-20 inline-block h-3 w-3 rounded-xl bg-tidebitTheme">
                  <p className="text-center text-3xs hover:text-white">
                    {notificationCtx.unreadNotifications.length}
                  </p>
                </span>

                <Image
                  src="/elements/notifications_outline.svg"
                  width={25}
                  height={25}
                  className="hover:cursor-pointer hover:text-cyan-300"
                  alt="icon"
                />
              </button>
            </div>

            <div className="z-50 flex grow justify-end">{isDisplayedUser}</div>

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
            <div className="flex h-full w-screen flex-col items-center justify-start">
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
                <Link href="/trade/cfd/ethusdt" className={menuItemStyles}>
                  {t('NAV_BAR.TRADE')}
                </Link>
              </div>
              <div className="flex items-center justify-start px-3">
                <Link href="#" className={menuItemStyles}>
                  {t('NAV_BAR.LEADERBOARD')}
                </Link>
              </div>
              <div className="flex items-center justify-start px-3">
                <Link href="#" className={menuItemStyles}>
                  {t('NAV_BAR.SUPPORT')}
                </Link>
              </div>
              <div className="flex items-center justify-start px-3">
                <div className="px-3 py-5">
                  <I18n langIsOpen={langIsOpen} setLangIsOpen={setLangIsOpen} />
                </div>

                {/* <TbMinusVertical size={30} className="" /> */}
              </div>
              {/* <div className="border-b border-cuteBlue"></div> */}
              <span className={`${dividerInsideMobileNavBar}`}></span>
              {isDisplayedUserOverview}
              {/* <WalletPanel
                className="ml-2"
                panelVisible={panelVisible}
                panelClickHandler={panelClickHandler}
                // getUserLoginState={getUserLoginHandler}
              />{' '} */}
            </div>
          </div>
          {/* <div className="mb-2 flex w-full justify-end pr-10">{isDisplayedUser}</div> */}
        </div>
      </div>

      <Notification notifyRef={notifyRef} componentVisible={componentVisible} />
    </>
  );
};

export default NavBarMobile;

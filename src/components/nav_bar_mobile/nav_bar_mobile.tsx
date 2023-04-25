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
import {NotificationContext} from '../../contexts/notification_context';
import {TBDURL} from '../../constants/api_request';
import {WalletConnectButton} from '../wallet_connect_button/wallet_connect_button';

type TranslateFunction = (s: string) => string;

const NavBarMobile = () => {
  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);
  const globalCtx = useGlobal();

  const {t}: {t: TranslateFunction} = useTranslation('common');

  const [navOpen, setNavOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [langIsOpen, setLangIsOpen] = useState(false);

  /* Info: (20230327 - Julian) Menu Text */
  const menuText = langIsOpen ? t('NAV_BAR.LANGUAGE') : t('NAV_BAR.MENU');

  const {
    targetRef: notifyRef,
    componentVisible,
    setComponentVisible,
  } = useOuterClick<HTMLDivElement>(false);

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
  };

  const hamburgerStyles = 'opacity-100 block bg-lightWhite h-3px rounded-12px ease-in duration-300';

  const menuItemStyles =
    'block rounded-md px-3 py-5 font-medium hover:cursor-pointer hover:text-tidebitTheme';

  /* Info: (20230327 - Julian) Hamburger Animation */
  const displayedMobileNavBarLine1 = !navOpen
    ? 'translate-y-0 rotate-0'
    : 'translate-y-1.5 origin-left w-3/4 -rotate-35';
  const displayedMobileNavBarLine2 = !navOpen ? 'translate-y-1.5 w-full' : 'w-0';
  const displayedMobileNavBarLine3 = !navOpen
    ? 'translate-y-3 rotate-0'
    : 'translate-y-0 origin-left w-3/4 rotate-35';

  const dividerInsideMobileNavBar = navOpen && `inline-block h-px w-11/12 rounded bg-lightGray`;

  const isDisplayedMobileNavBar = navOpen ? 'top-14 min-h-screen inset-0 bg-darkGray/100' : '';

  /* Info: (20230424 - Julian) 如果用戶為登入狀態， cover width 改為 7/10 讓頭貼可以被看到 */
  const isDisplayedNotificationSidebarMobileCover = (
    <div
      className={`${userCtx.enableServiceTerm ? 'w-5/10' : 'w-screen'} ${
        navOpen ? 'visible opacity-100' : 'invisible opacity-0'
      } fixed top-0 left-20 z-50 flex h-14 w-screen items-center overflow-x-hidden overflow-y-hidden bg-black/100 outline-none`}
    >
      <p className="pl-5">{menuText}</p>
    </div>
  );

  const isDisplayedUser = userCtx.enableServiceTerm ? (
    <UserMobile />
  ) : (
    /* Info: (20230327 - Julian) Show Wallet Connect */
    <WalletConnectButton className="py-2 px-3 text-sm" />
  );

  const isDisplayedSubNavWalletConnect = userCtx.enableServiceTerm ? null : (
    /* Info: (20230327 - Julian) Show Wallet Connect */
    <WalletConnectButton className="py-2 px-3 text-sm" />
  );

  const isDisplayedUnreadnumber =
    notificationCtx.unreadNotifications.length > 0 ? (
      <span className="absolute top-0 right-0 z-20 inline-flex h-3 w-3 items-center justify-center rounded-xl bg-tidebitTheme">
        <p className="text-center text-3xs">{notificationCtx.unreadNotifications.length}</p>
      </span>
    ) : null;

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
                  <span className={`${hamburgerStyles} ${displayedMobileNavBarLine1}`}></span>
                  <span className={`${hamburgerStyles} ${displayedMobileNavBarLine2}`}></span>
                  <span className={`${hamburgerStyles} ${displayedMobileNavBarLine3}`}></span>
                </div>
              </button>
            </div>

            <div className="z-50 ml-4 flex">
              <button onClick={sidebarOpenHandler} className="relative hover:cursor-pointer">
                {isDisplayedUnreadnumber}

                <Image
                  src="/elements/notifications_outline.svg"
                  width={25}
                  height={25}
                  className="hover:cursor-pointer hover:text-cyan-300"
                  alt="notification icon"
                />
              </button>
            </div>

            <div className="z-50 flex grow justify-end">{isDisplayedUser}</div>

            <div className="invisible ml-auto lg:visible"></div>
          </div>
        </div>

        <div
          ref={notifyRef}
          className={`absolute transition-all duration-300 lg:hidden ${isDisplayedMobileNavBar}`}
        >
          {/* Info: (20230327 - Julian) Cover for mobile bell icon */}
          {isDisplayedNotificationSidebarMobileCover}

          {/* Info: (20230327 - Julian) Mobile menu section */}
          <div className="flex h-screen flex-col items-center justify-start px-2 pt-8 pb-24 text-base sm:px-3">
            <div className="flex h-full w-screen flex-col items-center justify-start">
              <div className="flex items-center justify-start px-3 pt-3">
                <Link className="shrink-0" href="/">
                  <div className="inline-flex items-center hover:cursor-pointer hover:text-cyan-300 hover:opacity-100">
                    <div className="relative h-55px w-150px flex-col justify-center hover:cursor-pointer hover:opacity-80">
                      <Image
                        src="/elements/nav_logo.svg"
                        height={50}
                        width={150}
                        alt="TideBit_logo"
                      />
                    </div>
                  </div>
                </Link>
              </div>
              <div className="flex items-center justify-start px-3">
                <Link href={TBDURL.TRADE} className={menuItemStyles}>
                  {t('NAV_BAR.TRADE')}
                </Link>
              </div>
              <div className="flex items-center justify-start px-3">
                <Link href={TBDURL.COMING_SOON} className={menuItemStyles}>
                  {t('NAV_BAR.LEADERBOARD')}
                </Link>
              </div>
              <div className="flex items-center justify-start px-3">
                <Link href={TBDURL.COMING_SOON} className={menuItemStyles}>
                  {t('NAV_BAR.SUPPORT')}
                </Link>
              </div>
              <div className="flex items-center justify-start px-3">
                <div className="px-3 py-5">
                  <I18n langIsOpen={langIsOpen} setLangIsOpen={setLangIsOpen} />
                </div>
              </div>
              <span className={`${dividerInsideMobileNavBar}`}></span>
              <div className="p-5">{isDisplayedSubNavWalletConnect}</div>
            </div>
          </div>
        </div>
      </div>

      <Notification notifyRef={notifyRef} componentVisible={componentVisible} />
    </>
  );
};

export default NavBarMobile;

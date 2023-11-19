import {useTranslation} from 'next-i18next';
import Link from 'next/link';
import React, {useContext, useState} from 'react';
import Image from 'next/image';
import version from '../../lib/version';
import useOuterClick from '../../lib/hooks/use_outer_click';
import Notification from '../notification/notification';
import I18n from '../i18n/i18n';
import UserOverview from '../user_overview/user_overview';
import {UserContext} from '../../contexts/user_context';
import User from '../user/user';
import {NotificationContext} from '../../contexts/notification_context';
import {TBDURL} from '../../constants/api_request';
import {WalletConnectButton} from '../wallet_connect_button/wallet_connect_button';
import {useRouter} from 'next/router';
import {isValidTradeURL} from '../../lib/common';
import useStateRef from 'react-usestateref';
import {LayoutAssertion} from '../../constants/layout_assertion';
import {useGlobal} from '../../contexts/global_context';

type TranslateFunction = (s: string) => string;

const NavBar = () => {
  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);
  const router = useRouter();
  const globalCtx = useGlobal();
  const tradeLink = isValidTradeURL(router.asPath) ? router.asPath : TBDURL.TRADE;
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const {
    targetRef: sidebarRef,
    componentVisible: sidebarVisible,
    setComponentVisible: setSidebarVisible,
  } = useOuterClick<HTMLDivElement>(false);

  const [navOpen, setNavOpen] = useState(false);
  const [notifyOpen, setNotifyOpen, notifyOpenRef] = useStateRef(false);
  const [langIsOpen, setLangIsOpen] = useState(false);

  /* Info: (20230327 - Julian) Menu Text */
  const menuText = notifyOpenRef.current
    ? t('NAV_BAR.NOTIFICATION_TITLE')
    : langIsOpen
    ? t('NAV_BAR.LANGUAGE')
    : t('NAV_BAR.MENU');

  const burgerClickHandler = () => {
    if (notifyOpenRef.current) setNotifyOpen(false);
    else if (langIsOpen) setLangIsOpen(false);
    else setNavOpen(!navOpen);
  };

  const logoClickHandler = () => {
    // Info: (20231019 - Julian) Close all menu
    setNavOpen(false);
    setNotifyOpen(false);
    setLangIsOpen(false);
  };
  const sidebarOpenHandler = () => {
    setSidebarVisible(!sidebarVisible);
  };
  const sidebarOpenHandlerMobile = () => setNotifyOpen(!notifyOpen);

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

  const isDisplayedMobileNavBar = navOpen ? 'visible opacity-100' : 'invisible opacity-0';

  const isDisplayedUserOverview = userCtx.enableServiceTerm ? (
    <div className="w-350px">
      <UserOverview
        depositAvailable={userCtx.userAssets?.balance?.available ?? 0}
        marginLocked={userCtx.userAssets?.balance?.locked ?? 0}
        profitOrLossAmount={userCtx.userAssets?.pnl?.cumulative?.amount?.value ?? 0}
      />
    </div>
  ) : null;

  const isDisplayedUser = userCtx.enableServiceTerm ? (
    <User />
  ) : (
    /* Info: (20230327 - Julian) show wallet panel */
    <WalletConnectButton className="mt-4 px-5 py-2 md:mt-0" />
  );

  const isDisplayedUnreadNumber =
    notificationCtx.unreadNotifications.length > 0 ? (
      <span className="absolute bottom-4 left-3 z-20 inline-flex h-4 w-4 items-center justify-center rounded-xl bg-tidebitTheme">
        <p className="text-center text-xs">{notificationCtx.unreadNotifications.length}</p>
      </span>
    ) : null;

  const userOverviewDividerDesktop = userCtx.enableServiceTerm ? (
    <span className="mx-2 inline-block h-10 w-px rounded bg-lightGray1/50"></span>
  ) : null;

  // Info: (20231019 - Julian) 選單打開時，顯示 menuText ，否則顯示 testnet 圖示
  const menuTextBar = navOpen ? (
    <div
      /* Info: (20230424 - Julian) 如果用戶為登入狀態， cover width 改為 5/10 讓頭貼可以被看到 */
      className={`${
        userCtx.enableServiceTerm ? 'w-5/10' : 'w-screen'
      } fixed left-20 top-0 z-50 flex h-14 items-center bg-black`}
    >
      <p className="ml-5">{menuText}</p>
    </div>
  ) : (
    <Image src="/elements/testnet_mobile@2x.png" width={33} height={33} alt="testnet" />
  );

  const isDisplayedUserMobile = userCtx.enableServiceTerm ? (
    <User notifyOpen={notifyOpen} setNotifyOpen={setNotifyOpen} />
  ) : (
    /* Info: (20230327 - Julian) Show Wallet Connect */
    <WalletConnectButton className="px-3 py-2 text-sm" />
  );

  const isDisplayedSubNavWalletConnect = userCtx.enableServiceTerm ? null : (
    /* Info: (20230327 - Julian) Show Wallet Connect */
    <WalletConnectButton className="px-3 py-2 text-sm" />
  );

  const desktopLayout = (
    <>
      {/* Info: 背景色條橫跨整個螢幕寬度 (20231115 -  Shirley) */}
      <div className="fixed inset-x-0 top-0 z-40 bg-black">
        <nav className="container mx-auto px-5 text-white max-w-1920px">
          {/* Info: 將 NavBar 內容限制在 1920px 的寬度範圍內 (20231115 -  Shirley) */}
          <div className="mx-auto max-w-full px-5">
            <div className="flex h-16 items-center justify-between bg-black">
              <div className="flex items-center">
                {/* Info: (20230327 - Julian) logo */}
                <Link className="shrink-0 pt-5" href="/">
                  <div className="inline-flex items-center hover:cursor-pointer hover:text-cyan-300 hover:opacity-100">
                    <div className="relative h-55px w-150px flex-col justify-center hover:cursor-pointer hover:opacity-80">
                      <Image
                        src="/elements/nav_logo.svg"
                        height={50}
                        width={150}
                        alt="TideBit_logo"
                      />

                      <Image
                        className="absolute bottom-1 right-60px"
                        src="/elements/beta@2x.png"
                        width={30}
                        height={13}
                        alt="beta"
                      />

                      <p className="absolute bottom-1 right-0 text-end text-xs leading-tight tracking-tighter text-lightGray">
                        v{version}
                      </p>
                    </div>
                  </div>
                </Link>
                {/* Info: (20230327 - Julian) Desktop menu */}
                <div className={`hidden pb-5 text-base text-lightGray1 lg:block`}>
                  <div className="ml-4 mt-8 flex flex-1 items-center space-x-4">
                    <Image src="/elements/testnet@2x.png" width={65} height={25} alt="testnet" />

                    <Link href={tradeLink} className="hover:cursor-pointer hover:text-tidebitTheme">
                      {t('NAV_BAR.TRADE')}
                    </Link>
                    <Link
                      href={TBDURL.LEADERBOARD}
                      className="mr-5 hover:cursor-pointer hover:text-tidebitTheme"
                    >
                      {t('NAV_BAR.LEADERBOARD')}
                    </Link>
                    <Link
                      href={TBDURL.COMING_SOON}
                      className="mr-5 hover:cursor-pointer hover:text-tidebitTheme"
                    >
                      {t('NAV_BAR.SUPPORT')}
                    </Link>

                    {/* Info: (20230327 - Julian) User overview */}
                    {userOverviewDividerDesktop}
                    {isDisplayedUserOverview}
                  </div>
                </div>
              </div>
              <div className="hidden pt-3 lg:flex">
                <div className="flex items-center justify-center px-5">
                  <div
                    className={`${sidebarVisible ? `pointer-events-none` : `pointer-events-auto`}`}
                  >
                    <I18n />
                  </div>
                  <span className="mx-2 inline-block h-10 w-px rounded bg-lightGray1"></span>

                  <button
                    onClick={sidebarOpenHandler}
                    className={`w-10 relative hover:cursor-pointer ${
                      sidebarVisible ? `pointer-events-none` : `pointer-events-auto`
                    }`}
                  >
                    {isDisplayedUnreadNumber}

                    <Image
                      src="/elements/notifications_outline.svg"
                      width={25}
                      height={25}
                      className="hover:cursor-pointer hover:text-cyan-300"
                      alt="notification bell icon"
                    />
                  </button>
                </div>
                <div className="mr-5 inline-flex">{isDisplayedUser}</div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Info: (20230327 - Julian) Notification Sidebar */}
      <Notification notifyRef={sidebarRef} componentVisible={sidebarVisible} />
    </>
  );

  const mobileLayout = (
    <>
      <div className="container fixed inset-x-0 z-40 mx-auto inline-flex max-w-full items-end justify-center bg-black/100 pb-1 text-white lg:hidden">
        <div className="flex w-full items-center justify-between px-5 py-3">
          <div className="flex basis-full items-center">
            <div className="flex border-r border-lightGray1 lg:hidden">
              <button
                onClick={burgerClickHandler}
                className="z-50 inline-flex items-center justify-center rounded-md px-3 py-2"
              >
                <div className="relative h-20px w-30px cursor-pointer">
                  <span className={`${hamburgerStyles} ${displayedMobileNavBarLine1}`}></span>
                  <span className={`${hamburgerStyles} ${displayedMobileNavBarLine2}`}></span>
                  <span className={`${hamburgerStyles} ${displayedMobileNavBarLine3}`}></span>
                </div>
              </button>
            </div>
            {/* Info: (20231019 - Julian) Menu Text */}
            <div className="z-50 ml-4">{menuTextBar}</div>
            <div className="z-50 flex grow justify-end">{isDisplayedUserMobile}</div>
          </div>
        </div>

        <div
          className={`absolute inset-0 top-14 min-h-screen bg-darkGray/100 transition-all duration-300 lg:hidden ${isDisplayedMobileNavBar}`}
        >
          {/* Info: (20230327 - Julian) Mobile menu section */}
          <div className="flex h-screen flex-col items-center justify-start px-2 pb-24 pt-8 text-base sm:px-3">
            <div className="flex h-full w-screen flex-col items-center justify-start">
              <div className="flex w-full items-center justify-around space-x-5 px-3 pt-3">
                <Link className="shrink-0" href="/" onClick={logoClickHandler}>
                  <div className="inline-flex items-center hover:cursor-pointer hover:text-cyan-300 hover:opacity-100">
                    <div className="relative h-55px w-150px flex-col justify-center hover:cursor-pointer hover:opacity-80">
                      <Image
                        src="/elements/nav_logo.svg"
                        height={50}
                        width={150}
                        alt="TideBit_logo"
                      />
                      <Image
                        className="absolute bottom-1 right-60px"
                        src="/elements/beta@2x.png"
                        width={30}
                        height={13}
                        alt="beta"
                      />
                      <p className="absolute bottom-1 right-0 text-end text-xs leading-tight tracking-tighter text-lightGray">
                        v{version}
                      </p>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={sidebarOpenHandlerMobile}
                  className="relative hover:cursor-pointer"
                >
                  {isDisplayedUnreadNumber}

                  <Image
                    src="/elements/notifications_outline.svg"
                    width={25}
                    height={25}
                    className="hover:cursor-pointer hover:text-cyan-300"
                    alt="notification bell icon"
                  />
                </button>
              </div>

              <div className="flex items-center justify-start px-3">
                <Link href={tradeLink} className={menuItemStyles}>
                  {t('NAV_BAR.TRADE')}
                </Link>
              </div>
              <div className="flex items-center justify-start px-3">
                <Link href={TBDURL.LEADERBOARD} className={menuItemStyles}>
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

      <Notification componentVisible={notifyOpenRef.current} />
    </>
  );

  const displayedLayout =
    globalCtx.layoutAssertion === LayoutAssertion.MOBILE ? mobileLayout : desktopLayout;

  return <>{displayedLayout}</>;
};

export default NavBar;

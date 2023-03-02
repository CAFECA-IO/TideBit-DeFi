import {useTranslation} from 'next-i18next';
import Link from 'next/link';
import TideButton from '../tide_button/tide_button';
import {useContext, useState} from 'react';
import {FiMenu} from 'react-icons/fi';
// import TideLink from '../tide_link/tide_link';
import Image from 'next/image';
import version from '../../lib/version';
import useOuterClick from '../../lib/hooks/use_outer_click';
import Notification from '../notification/notification';
import {useRouter} from 'next/router';
import I18n from '../i18n/i18n';
import {IoIosArrowBack} from 'react-icons/io';
import UserOverview from '../user_overview/user_overview';
import {UserContext} from '../../contexts/user_context';
import User from '../user/user';
import {useGlobal} from '../../contexts/global_context';
import {NotificationContext} from '../../contexts/notification_context';

// interface INavBarProps {
//   notifyRef: HTMLDivElement extends HTMLElement ? React.RefObject<HTMLDivElement> : null;
//   componentVisible: boolean;
// }
type TranslateFunction = (s: string) => string;

const NavBar = () => {
  const userCtx = useContext(UserContext);
  const notificationCtx = useContext(NotificationContext);
  const globalCtx = useGlobal();

  const {t}: {t: TranslateFunction} = useTranslation('common');
  // TODO: i18n
  const {locale, locales, defaultLocale, asPath} = useRouter();
  const [navOpen, setNavOpen] = useState(false);

  // const [userOverview, setUserOverview] = useState(false);

  const {
    targetRef: notifyRef,
    componentVisible: notifyVisible,
    setComponentVisible: setNotifyVisible,
  } = useOuterClick<HTMLDivElement>(false);

  const navBarMobileClickHandler = () => setNavOpen(!navOpen);

  const sidebarOpenHandler = () => {
    // setSidebarOpen(!sidebarOpen);
    setNotifyVisible(!notifyVisible);
    // console.log('sidebarOpenHandler clicked, componentVisible: ', componentVisible);
  };

  // const getUserLoginHandler = (bool: boolean) => {
  //   setUserOverview(bool);
  // };

  // TODO: move to Global COntext
  const [panelVisible, setPanelVisible] = useState(false);

  const panelClickHandler = () => {
    setPanelVisible(!panelVisible);
  };

  const wallectConnectBtnClickHandler = () => {
    globalCtx.visibleWalletPanelHandler();
  };

  const displayedMobileNavBar = !navOpen ? (
    <FiMenu size={25} className="" />
  ) : (
    <IoIosArrowBack size={25} />
  );

  const isDisplayedMobileNavBar = navOpen ? '' : 'hidden';
  // componentVisible ? 'animate-fadeIn' : 'animate-fadeOut';

  const isDisplayedNotificationSidebarMobileCover = (
    <div
      className={`${
        notifyVisible ? 'visible' : 'invisible'
      } fixed top-52 left-24 z-50 flex h-10 w-8 items-center justify-center overflow-x-hidden overflow-y-hidden bg-transparent outline-none hover:cursor-pointer focus:outline-none`}
    >
      {' '}
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
    <User />
  ) : (
    <TideButton
      onClick={wallectConnectBtnClickHandler} // show wallet panel
      className={`mt-4 rounded border-0 bg-tidebitTheme py-2 px-5 text-base text-white transition-all duration-300 hover:bg-cyan-600 md:mt-0`}
    >
      {/* Wallet Connect */}
      {t('nav_bar.WalletConnect')}
    </TideButton>
  );

  const userOverviewDividerDesktop = userCtx.enableServiceTerm ? (
    <span className="mx-2 inline-block h-10 w-px rounded bg-lightGray1/50"></span>
  ) : null;

  return (
    <>
      <div className="w-full text-center lg:text-start">
        {/* No bg blur in NavBar `backdrop-blur-sm` because wallet panel's limited to navbar when it shows up */}
        <nav className="container fixed inset-x-0 z-40 mx-auto max-w-full bg-black/100 pb-1 text-white">
          <div className="mx-auto max-w-full px-5">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                {/* logo */}
                <Link className="shrink-0  pt-5" href="/">
                  <div className="inline-flex items-center hover:cursor-pointer hover:text-cyan-300 hover:opacity-100">
                    <div className="relative h-55px w-150px flex-col justify-center hover:cursor-pointer hover:opacity-80">
                      <Image
                        className=""
                        src={'/elements/nav_logo.svg'}
                        height={50}
                        width={150}
                        alt={'logo'}
                      />

                      <p className="absolute bottom-1 right-0 text-end text-xxs text-lightGray">
                        v {version}
                      </p>
                    </div>
                  </div>
                </Link>
                {/* Desktop menu */}
                <div className={`hidden pb-5 text-base text-lightGray1 lg:block`}>
                  <div className="ml-10 mt-5 flex flex-1 items-center space-x-4 xl:ml-10">
                    <Link
                      href="/trade/cfd/ethusdt"
                      className="hover:cursor-pointer hover:text-tidebitTheme"
                    >
                      {t('nav_bar.Trade')}
                    </Link>
                    <Link href="#" className="mr-5 hover:cursor-pointer hover:text-tidebitTheme">
                      {t('nav_bar.Leaderboard')}
                    </Link>
                    {/* <Link
                      href={asPath}
                      locale="tw"
                      className="hover:cursor-pointer hover:text-tidebitTheme"
                    >
                      Test
                    </Link> */}
                    <Link href="#" className="mr-5 hover:cursor-pointer hover:text-tidebitTheme">
                      {t('nav_bar.Support')}
                    </Link>

                    {/* User overview */}
                    {userOverviewDividerDesktop}
                    {isDisplayedUserOverview}

                    {/* <div className="max-w-2xl mx-auto"></div> */}
                  </div>
                </div>
              </div>
              <div className="hidden pt-3 lg:flex">
                <div className="flex items-center justify-center px-5">
                  <div>
                    <I18n />
                  </div>
                  {/* <TbMinusVertical size={30} className="" /> */}
                  <span className="mx-2 inline-block h-10 w-px rounded bg-lightGray1"></span>

                  <button onClick={sidebarOpenHandler} className="relative hover:cursor-pointer">
                    <span className="absolute bottom-4 left-3 z-20 inline-block h-3 w-3 rounded-xl bg-tidebitTheme">
                      <p className="text-center text-3xs">
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
                <div className="mr-5 inline-flex">
                  {isDisplayedUser}
                  {/* <WalletPanel
                    panelVisible={panelVisible}
                    panelClickHandler={panelClickHandler}
                    // getUserLoginState={getUserLoginHandler}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Notification Sidebar */}
      <Notification notifyRef={notifyRef} componentVisible={notifyVisible} />
    </>
  );
};

export default NavBar;

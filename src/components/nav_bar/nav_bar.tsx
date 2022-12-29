import {useTranslation} from 'next-i18next';
import Link from 'next/link';
import TideButton from '../tide_button/tide_button';
import {useState} from 'react';
import {AiOutlineGlobal} from 'react-icons/ai';
import {BsFillBellFill, BsBell} from 'react-icons/bs';
import {TbMinusVertical} from 'react-icons/tb';
import {FiMenu} from 'react-icons/fi';
import {TfiBell} from 'react-icons/tfi';
// import TideLink from '../tide_link/tide_link';
import Image from 'next/image';
import version from '../../lib/version';
import WalletPanel from '../wallet/wallet_panel';
import useOuterClick from '../../lib/hooks/use_outer_click';
import Notification from '../notification/notification';
import NotificationItem from '../notification_item/notification_item';
import {useRouter} from 'next/router';
import I18n from '../i18n/i18n';
import {IoIosArrowBack} from 'react-icons/io';
import UserOverview from '../user_overview/user_overview';

// interface INavBarProps {
//   notifyRef: HTMLDivElement extends HTMLElement ? React.RefObject<HTMLDivElement> : null;
//   componentVisible: boolean;
// }
type TranslateFunction = (s: string) => string;

const NavBar = ({notificationNumber = 1}) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  // TODO: i18n
  const {locale, locales, defaultLocale, asPath} = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [userOverview, setUserOverview] = useState(false);

  const {
    targetRef: notifyRef,
    componentVisible,
    setComponentVisible,
  } = useOuterClick<HTMLDivElement>(false);

  const clickHanlder = () => setNavOpen(!navOpen);

  const sidebarOpenHandler = () => {
    // setSidebarOpen(!sidebarOpen);
    setComponentVisible(!componentVisible);
    // console.log('sidebarOpenHandler clicked, componentVisible: ', componentVisible);
  };

  const getUserLoginHandler = (bool: boolean) => {
    setUserOverview(bool);
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
        componentVisible ? 'visible' : 'invisible'
      } fixed top-52 left-24 z-50 flex h-10 w-8 items-center justify-center overflow-x-hidden overflow-y-hidden bg-transparent outline-none hover:cursor-pointer focus:outline-none`}
    >
      {' '}
    </div>
  );

  const isDisplayedUserOverview = userOverview ? (
    <UserOverview
      depositAvailable={100.34}
      marginLocked={100.34}
      profitOrLoss={'profit'}
      profitOrLossAmount={100.96}
    />
  ) : null;

  return (
    <>
      <div className="w-full bg-black">
        {/* No bg blur in NavBar `backdrop-blur-sm` because wallet panel's limited to navbar when it show up */}
        <nav className="container fixed inset-x-0 z-40 mx-auto max-w-full bg-black/100 pb-1 text-white">
          <div className="mx-auto max-w-full px-8">
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
                  <div className="ml-10 mt-5 flex flex-1 items-center space-x-4">
                    <Link href="/trading" className="hover:cursor-pointer hover:text-tidebitTheme">
                      {t('nav_bar.Trading')}
                    </Link>
                    <Link href="#" className="mr-5 hover:cursor-pointer hover:text-tidebitTheme">
                      {t('nav_bar.TideBitUniversity')}
                    </Link>
                    {/* <Link
                      href={asPath}
                      locale="tw"
                      className="hover:cursor-pointer hover:text-tidebitTheme"
                    >
                      Test
                    </Link> */}
                    <Link href="#" className="mr-5 hover:cursor-pointer hover:text-tidebitTheme">
                      {t('nav_bar.HelpCenter')}
                    </Link>
                    <span className="mx-2 inline-block h-10 w-px rounded bg-lightGray1/50"></span>

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
                    <span className="absolute bottom-3 left-3 z-20 inline-block h-3 w-3 rounded-xl bg-tidebitTheme">
                      <p className="text-center text-3xs">{notificationNumber}</p>
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
                  <WalletPanel getUserLoginState={getUserLoginHandler} />
                </div>
              </div>

              {/* ---Mobile menu section--- */}
              {/* Mobile menu toggle */}
              <div className="inline-flex items-end justify-center lg:hidden">
                <div className="mr-0 mt-3 flex lg:hidden">
                  <button
                    onClick={clickHanlder}
                    className="inline-flex items-center justify-center rounded-md p-2 hover:text-cyan-300 focus:outline-none"
                  >
                    {displayedMobileNavBar}
                  </button>
                </div>

                <span className="mx-2 inline-block h-10 w-px rounded bg-lightGray1"></span>
                <button onClick={sidebarOpenHandler} className="relative hover:cursor-pointer">
                  <span className="absolute bottom-4 left-3 z-20 inline-block h-3 w-3 rounded-xl bg-cyan-300">
                    <p className="text-center text-3xs hover:text-white">{notificationNumber}</p>
                  </span>

                  <Image
                    src="/elements/notifications_outline.svg"
                    width={25}
                    height={25}
                    className="mb-2 hover:cursor-pointer hover:text-cyan-300"
                    alt="icon"
                  />
                </button>
              </div>
            </div>
          </div>
          {/* Mobile menu */}
          <div ref={notifyRef} className={`lg:hidden ${isDisplayedMobileNavBar}`}>
            {/* Cover for mobile bell icon */}
            {isDisplayedNotificationSidebarMobileCover}

            {/* Mobile menu section */}
            <div className="ml-10 inline-block items-center px-2 pt-2 pb-3 sm:px-3">
              <div className="space-y-1">
                <Link
                  href="/trading"
                  className="block rounded-md px-3 py-2 font-medium hover:cursor-pointer hover:text-tidebitTheme"
                >
                  {t('nav_bar.Trading')}
                </Link>
                <Link
                  href="#"
                  className="block rounded-md px-3 py-2 font-medium hover:cursor-pointer hover:text-tidebitTheme"
                >
                  {t('nav_bar.TideBitUniversity')}
                </Link>{' '}
                <Link
                  href="#"
                  className="block rounded-md px-3 py-2 font-medium hover:cursor-pointer hover:text-tidebitTheme"
                >
                  {' '}
                  {t('nav_bar.HelpCenter')}
                </Link>{' '}
              </div>

              <div className="pt-3">
                <div className="flex items-center justify-start px-3">
                  <div>
                    <I18n />
                  </div>
                  {/* <TbMinusVertical size={30} className="" /> */}
                </div>
              </div>
              <div className="mt-5">
                {/* <ConnectButton className="ml-2" /> */}
                <WalletPanel className="ml-2" getUserLoginState={getUserLoginHandler} />
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Notification Sidebar */}
      <Notification notifyRef={notifyRef} componentVisible={componentVisible} />
    </>
  );
};

export default NavBar;

import Link from 'next/link';
import TideButton from '../shared/button/tide_button';
import {useState} from 'react';
import {AiOutlineGlobal} from 'react-icons/ai';
import {BsFillBellFill} from 'react-icons/bs';
import {TbMinusVertical} from 'react-icons/tb';
import {FiMenu} from 'react-icons/fi';
import {TfiBell} from 'react-icons/tfi';
import {BsBell} from 'react-icons/bs';
import TideLink from '../shared/link/tide_link';
import ConnectButton from '../wallet/connect_button';
import Image from 'next/image';
import version from '../../lib/version';
import WalletPanel from '../wallet/wallet_panel';
import useOuterClick from '../../hooks/lib/useOuterClick';

const NavBar = ({notificationNumber = 1}) => {
  const [navOpen, setNavOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {ref, componentVisible, setComponentVisible} = useOuterClick(false);

  const clickHanlder = () => setNavOpen(!navOpen);

  const sidebarOpenHandler = () => {
    // setSidebarOpen(!sidebarOpen);
    setComponentVisible(!componentVisible);
    // console.log('sidebarOpenHandler clicked, componentVisible: ', componentVisible);
  };

  const displayedMobileNavBar = !navOpen ? (
    <FiMenu size={30} className="" />
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-white hover:text-cyan-300"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );

  const isDisplayedMobileNavBar = navOpen ? '' : 'hidden';
  // componentVisible ? 'animate-fadeIn' : 'animate-fadeOut';

  const isDisplayedNotificationSidebarSection = (
    <>
      {/* sidebar section */}
      <div
        className={`fixed right-1 top-[44px] z-30 flex overflow-x-hidden overflow-y-hidden outline-none focus:outline-none`}
      >
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {' '}
          <div className={`relative`}>
            {/* sidebar self */}
            <div
              ref={ref}
              className={`${'w-[479px]'} h-screen ${
                componentVisible ? 'translate-x-0' : 'translate-x-full'
              } bg-darkGray/90 p-5 pt-8 text-white transition-all duration-300`}
            >
              <h1 className="pl-5 text-[25px] font-bold">Notification</h1>
              <div className="fixed right-[30px] text-[14px] text-tidebitTheme underline hover:cursor-pointer">
                Clear All
              </div>
              <div className="mt-[83px] -mb-[28px] flex">
                <span className="mx-2 inline-block h-[158px] w-[5px] flex-shrink-0 bg-tidebitTheme"></span>
                <div className="-mt-[130px] flex items-center">
                  <Image
                    className="ml-[8px] -mt-[10px] flex flex-shrink-0"
                    src="/elements/megaphone.svg"
                    width={30}
                    height={26}
                    alt="icon"
                  />
                  <div className="relative mt-[88px] ml-3 text-start">
                    <div className="">
                      <div className="absolute top-[40px] text-[25px] text-lightWhite">
                        Happy Birthday to TideBit
                      </div>
                      <div className="right-[20px] pt-[42px] pl-[300px] pb-[50px] text-end text-[12px] text-lightGray">
                        <div>2022-10-05</div>
                        <div>14:28:38</div>
                      </div>
                    </div>

                    <div className="mb-[23px] -mt-[30px] flex flex-wrap text-[12px] text-lightGray">
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                      eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
                      voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita
                      kasd gubergren, no sea takimata sanctus est Lorem
                    </div>
                  </div>
                </div>
              </div>
              <span className="ml-2 inline-block h-[1px] w-[438px] flex-shrink-0 bg-lightGray"></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const isDisplayedNotificationSidebarCover = componentVisible ? (
    <>
      {/* cover for NavBar ***Bell Icon*** */}
      <div
        className={`${
          componentVisible ? 'visible animate-fade duration-700 ease-in-out' : 'invisible'
        } invisible fixed z-50 flex h-16 items-center justify-center overflow-x-hidden overflow-y-hidden bg-transparent outline-none hover:cursor-pointer focus:outline-none lg:visible lg:right-52 lg:top-6 lg:h-8 lg:w-8`}
      >
        {' '}
      </div>

      {/* cover for Main, Footer */}
      <div
        className={`${
          componentVisible ? 'transition-opacity duration-700 ease-in-out' : 'invisible'
        } fixed inset-0 z-30 flex items-center justify-center overflow-x-hidden overflow-y-hidden bg-darkGray/10 outline-none backdrop-blur-sm focus:outline-none`}
      >
        {' '}
      </div>
    </>
  ) : null;

  return (
    <>
      <div className="w-full bg-black">
        <nav className="container fixed inset-x-0 z-40 mx-auto max-w-full bg-black/100 pb-1 text-white">
          <div className="mx-auto max-w-full px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                {/* logo */}
                <Link className="flex-shrink-0" href="/">
                  <div className="inline-flex items-center pt-5 hover:cursor-pointer hover:text-cyan-300 hover:opacity-100">
                    <div className="relative mb-2 h-[55px] w-[150px] flex-col justify-center hover:cursor-pointer hover:opacity-80">
                      <Image
                        className=""
                        src={'/elements/nav_logo.svg'}
                        height={50}
                        width={150}
                        alt={'logo'}
                      />
                      <p className="container mx-auto -mt-1 ml-3 pr-[10px] text-end text-[10px] text-lightGray">
                        V {version}
                      </p>
                    </div>
                    {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-10 h-10 text-white p-2 bg-cyan-600 rounded-full"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                  <span className="ml-3 text-xl">TideBit</span> */}
                  </div>
                </Link>
                {/* Desktop menu */}
                <div className={`hidden pb-5 text-[16px] text-lightGray1 lg:block`}>
                  <div className="ml-10 mt-5 flex flex-1 items-center space-x-4">
                    <TideLink href="#" className="animate-fade" content={'Trading'} />
                    <TideLink href="#" className="mr-5" content={'TideBit University'} />
                    <TideLink href="#" className="mr-5" content={'Help Center'} />

                    {/* <div className="max-w-2xl mx-auto"></div> */}
                  </div>
                </div>
              </div>
              <div className="hidden pt-3 lg:flex">
                <div className="flex items-center justify-center px-5">
                  <div>
                    <Image
                      src="/elements/globe.svg"
                      width={20}
                      height={20}
                      className="hover:cursor-pointer hover:text-cyan-300"
                      alt="icon"
                    />
                  </div>
                  {/* <TbMinusVertical size={30} className="" /> */}
                  <span className="mx-2 inline-block h-10 w-px rounded bg-lightGray1"></span>

                  <button onClick={sidebarOpenHandler} className="relative hover:cursor-pointer">
                    <span className="absolute bottom-3 left-3 z-20 inline-block h-3 w-3 rounded-xl bg-cyan-300">
                      <p className="text-center text-[8px] hover:text-white">
                        {notificationNumber}
                      </p>
                    </span>

                    <Image
                      src="/elements/notifications_outline.svg"
                      width={20}
                      height={20}
                      className="hover:cursor-pointer hover:text-cyan-300"
                      alt="icon"
                    />
                  </button>
                </div>
                <div className="mr-5 inline-flex">
                  {/* <ConnectButton /> */}
                  <WalletPanel />
                </div>
              </div>

              {/* Mobile menu toggle */}
              <div className="-mr-2 flex pt-3 lg:hidden">
                <button
                  onClick={clickHanlder}
                  className="inline-flex items-center justify-center rounded-md p-2 hover:text-cyan-300 focus:outline-none"
                >
                  {displayedMobileNavBar}
                </button>
              </div>
            </div>
          </div>
          {/* Mobile menu */}
          <div className={`lg:hidden ${isDisplayedMobileNavBar}`}>
            {/* Cover for mobile bell icon */}
            <div
              className={`${
                componentVisible ? 'visible' : 'invisible'
              } fixed top-52 left-24 z-50 flex h-10 w-8 items-center justify-center overflow-x-hidden overflow-y-hidden bg-transparent outline-none hover:cursor-pointer focus:outline-none`}
            >
              {' '}
            </div>
            {/* Mobile menu section */}
            <div className=" ml-10 inline-block items-center px-2 pt-2 pb-3 sm:px-3">
              <div className="space-y-1">
                <TideLink
                  href="#"
                  className="block rounded-md px-3 py-2 text-base font-medium"
                  content={'Trading'}
                />

                <TideLink
                  href="#"
                  className="block rounded-md px-3 py-2 text-base font-medium"
                  content={'TideBit University'}
                />
                <TideLink
                  href="#"
                  className="block rounded-md px-3 py-2 text-base font-medium"
                  content={'Help Center'}
                />
              </div>
              <div className="pt-3">
                <div className="flex items-center justify-start px-3">
                  <div>
                    <Image
                      src="/elements/globe.svg"
                      width={20}
                      height={20}
                      className="hover:cursor-pointer hover:text-cyan-300"
                      alt="icon"
                    />
                  </div>
                  {/* <TbMinusVertical size={30} className="" /> */}
                  <span className="mx-2 inline-block h-10 w-px rounded bg-lightGray1"></span>
                  <button onClick={sidebarOpenHandler} className="relative hover:cursor-pointer">
                    <span className="absolute bottom-3 left-3 z-20 inline-block h-3 w-3 rounded-xl bg-cyan-300">
                      <p className="text-center text-[8px] hover:text-white">
                        {notificationNumber}
                      </p>
                    </span>

                    <Image
                      src="/elements/notifications_outline.svg"
                      width={20}
                      height={20}
                      className="hover:cursor-pointer hover:text-cyan-300"
                      alt="icon"
                    />
                  </button>
                </div>
              </div>
              <div className="mt-5">
                {/* <ConnectButton className="ml-2" /> */}
                <WalletPanel className="ml-2" />
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Notification Sidebar */}
      {isDisplayedNotificationSidebarCover}
      {isDisplayedNotificationSidebarSection}
    </>
  );
};

export default NavBar;

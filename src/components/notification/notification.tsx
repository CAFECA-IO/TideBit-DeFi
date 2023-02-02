import useOuterClick from '../../lib/hooks/use_outer_click';
import Image from 'next/image';
import {forwardRef} from 'react';
import NotificationItem from '../notification_item/notification_item';

interface INotificationProps {
  notifyRef: HTMLDivElement extends HTMLElement ? React.RefObject<HTMLDivElement> : null;
  componentVisible: boolean;
}
// <HTMLDivElement extends HTMLElement>
export default function Notification({
  notifyRef,
  componentVisible,
}: INotificationProps): JSX.Element {
  // const {notifyRef, componentVisible} = props;
  // const refP = forwardRef(props?.forwardedRef);
  // const {componentVisible, setComponentVisible} = useOuterClick(false, refP);

  // const sidebarOpenHandler = () => {
  //   setComponentVisible(!componentVisible);
  // };

  const MAX_NOTIFICATION_WIDTH = 479;

  const hamburgerStyles =
    'block bg-lightWhite h-3px rounded-12px opacity-100 left-0 w-full rotate-0 ease-in duration-300';
  // hamburger animation
  const displayedMobileNavBarLine1 = !componentVisible
    ? 'translate-y-0'
    : 'translate-y-1.5 origin-left w-3/4 rotate-m35';
  const displayedMobileNavBarLine2 = !componentVisible ? 'translate-y-1.5' : 'w-0 opacity-0';
  const displayedMobileNavBarLine3 = !componentVisible
    ? 'translate-y-3'
    : 'translate-y-0 origin-left w-3/4 rotate-35';

  const DUMMY_DATA = [
    {
      id: 'n1',
    },
    {
      id: 'n2',
    },
    {
      id: 'n3',
    },
    {
      id: 'n4',
    },
  ];

  const NotificationList = DUMMY_DATA.map(v => {
    return (
      <div key={v.id}>
        <NotificationItem />
      </div>
    );
  });

  // Desktop notification drawer
  const isDisplayedNotificationSidebarSection = (
    <>
      {/* sidebar section */}
      <div
        className={`pointer-events-none fixed right-1 top-44px ${
          componentVisible ? 'z-30' : 'z-30'
        } flex overflow-x-hidden overflow-y-hidden outline-none focus:outline-none`}
      >
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {' '}
          <div className={`relative`}>
            {/* sidebar self */}
            <div
              ref={notifyRef}
              className={`pointer-events-auto h-screen w-screen ${`sm:w-479px`} ${
                componentVisible ? 'opacity-100 sm:translate-x-0' : 'opacity-0 sm:translate-x-full'
              } flex flex-col bg-darkGray/90 p-5 pt-8 pb-20 text-white transition-all duration-300`}
            >
              <div className="mb-10 flex flex-col justify-center">
                <h1 className="hidden pl-5 text-2xl font-bold sm:block">Notification</h1>
                <div className="fixed right-30px text-sm text-tidebitTheme underline hover:cursor-pointer">
                  Clear All
                </div>
              </div>

              {/* Notification List*/}
              <div className="flex basis-full flex-col space-y-10 overflow-y-auto overflow-x-hidden">
                {NotificationList}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Cover for Desktop notification drawer
  // FIXME: Detect if user signed in or not (avator showing) and change the cover's position accordingly
  const isDisplayedNotificationSidebarCover = componentVisible ? (
    <>
      {/* cover for NavBar ***Bell Icon*** */}
      <div
        className={`${
          componentVisible ? 'visible duration-700 ease-in-out' : 'invisible'
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

  // Cover for Mobile notification drawer
  const isDisplayedNotificationSidebarMobileCover = (
    <div
      className={`sm:hidden ${
        componentVisible ? 'visible opacity-100' : 'invisible opacity-0'
      } fixed z-50 flex h-16 w-screen items-center justify-center overflow-x-hidden overflow-y-hidden bg-black/100 px-5 outline-none transition-all delay-150 duration-300 hover:cursor-pointer focus:outline-none`}
    >
      <div className="flex basis-full items-end">
        <div className="mr-0 mt-3 flex lg:hidden">
          <button
            //onClick={clickHanlder}
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

        <p className="self-center pl-3">Notification</p>
      </div>
    </div>
  );

  // TODO: Mobile notification drawer [Not yet implemented]

  return (
    <div>
      {/* Notification Sidebar */}
      {isDisplayedNotificationSidebarCover}
      {isDisplayedNotificationSidebarMobileCover}
      {isDisplayedNotificationSidebarSection}
    </div>
  );
}

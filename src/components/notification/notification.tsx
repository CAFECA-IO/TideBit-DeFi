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
              className={`pointer-events-auto ${'w-479px'} h-screen ${
                componentVisible ? 'translate-x-0' : 'translate-x-full'
              } flex flex-col bg-darkGray/90 p-5 pt-8 text-white transition-all duration-300`}
            >
              <div className="mb-10 flex flex-col justify-center">
                <h1 className="pl-5 text-2xl font-bold">Notification</h1>
                <div className="fixed right-30px text-sm text-tidebitTheme underline hover:cursor-pointer">
                  Clear All
                </div>
              </div>

              {/* Notification List*/}
              <div className="flex basis-full flex-col space-y-10 overflow-y-auto overflow-x-hidden">
                <div>
                  <NotificationItem />
                </div>
                <div>
                  <NotificationItem />
                </div>
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
      className={`${
        componentVisible ? 'visible' : 'invisible'
      } fixed top-52 left-24 z-50 flex h-10 w-8 items-center justify-center overflow-x-hidden overflow-y-hidden bg-transparent outline-none hover:cursor-pointer focus:outline-none`}
    >
      {' '}
    </div>
  );

  // TODO: Mobile notification drawer [Not yet implemented]

  return (
    <div>
      {/* Notification Sidebar */}
      {isDisplayedNotificationSidebarCover}
      {isDisplayedNotificationSidebarSection}
    </div>
  );
}

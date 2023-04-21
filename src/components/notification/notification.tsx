import {useContext} from 'react';
import NotificationItem from '../notification_item/notification_item';
import {NotificationContext} from '../../contexts/notification_context';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;

interface INotificationProps {
  notifyRef: HTMLDivElement extends HTMLElement ? React.RefObject<HTMLDivElement> : null;
  componentVisible: boolean;
}

export default function Notification({
  notifyRef,
  componentVisible,
}: INotificationProps): JSX.Element {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const notificationCtx = useContext(NotificationContext);

  const hamburgerStyles =
    'block bg-lightWhite h-3px opacity-100 rounded-12px opacity-100 ease-in duration-300';

  /* Info: (20230327 - Julian) Hamburger Animation */
  const displayedMobileNavBarLine1 = !componentVisible
    ? 'translate-y-0 rotate-0'
    : 'translate-y-1.5 origin-left w-3/4 -rotate-35';
  const displayedMobileNavBarLine2 = !componentVisible ? 'translate-y-1.5 w-full' : 'w-0';
  const displayedMobileNavBarLine3 = !componentVisible
    ? 'translate-y-3 rotate-0'
    : 'translate-y-0 origin-left w-3/4 rotate-35';

  const notificationList = notificationCtx.unreadNotifications;

  const displayedNotificationList = notificationList.map(v => {
    return (
      <div key={v.id}>
        <NotificationItem
          id={v.id}
          title={v.title}
          timestamp={v.timestamp}
          duration={v.duration}
          notificationLevel={v.notificationLevel}
          isRead={v.isRead}
          content={v.content}
          public={v.public}
        />
      </div>
    );
  });

  /* Info: (20230420 - Julian) Desktop notification drawer */
  const isDisplayedNotificationSidebarSection = (
    <>
      {/* Info: (20230420 - Julian) sidebar section */}
      <div
        className={`pointer-events-none fixed right-1 top-44px ${
          componentVisible ? 'z-30' : 'z-30'
        } flex overflow-x-hidden overflow-y-hidden outline-none focus:outline-none`}
      >
        <div className="relative my-3 mx-auto w-auto max-w-xl">
          {' '}
          <div className={`relative`}>
            {/* Info: (20230420 - Julian) sidebar self */}
            <div
              ref={notifyRef}
              className={`pointer-events-auto min-h-screen w-screen ${`sm:w-479px`} ${
                componentVisible
                  ? 'visible opacity-100 sm:translate-x-0'
                  : 'invisible opacity-0 sm:translate-x-full'
              } flex flex-col bg-darkGray/90 pt-8 pb-20 text-white transition-all duration-300 sm:p-5`}
            >
              <div className="mb-10 flex flex items-center">
                <h1 className="hidden pl-5 text-2xl font-bold sm:block">
                  {t('NAV_BAR.NOTIFICATION_TITLE')}
                </h1>
                <div
                  className="ml-auto pr-30px text-sm text-tidebitTheme underline hover:cursor-pointer"
                  onClick={notificationCtx.readAll}
                >
                  {t('NAV_BAR.NOTIFICATION_READ_ALL')}
                </div>
              </div>

              {/* Info: (20230420 - Julian) Notification List*/}
              <div className="flex h-80vh flex-col space-y-10 overflow-y-auto overflow-x-hidden pb-40 sm:pb-10">
                {displayedNotificationList}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  /* Info: (20230420 - Julian) Cover for Desktop notification drawer */
  // FIXME: Detect if user signed in or not (avator showing) and change the cover's position accordingly
  const isDisplayedNotificationSidebarCover = componentVisible ? (
    <>
      {/* Info: (20230420 - Julian) cover for NavBar ***Bell Icon*** */}
      <div
        className={`${
          componentVisible ? 'visible duration-700 ease-in-out' : 'invisible'
        } invisible fixed z-50 flex h-16 items-center justify-center overflow-x-hidden overflow-y-hidden bg-transparent outline-none hover:cursor-pointer focus:outline-none lg:visible lg:right-52 lg:top-6 lg:h-8 lg:w-8`}
      >
        {' '}
      </div>

      {/* Info: (20230420 - Julian) cover for Main, Footer */}
      <div
        className={`${
          componentVisible ? 'transition-opacity duration-700 ease-in-out' : 'invisible'
        } fixed inset-0 z-30 flex items-center justify-center overflow-x-hidden overflow-y-hidden bg-darkGray/10 outline-none backdrop-blur-sm focus:outline-none`}
      >
        {' '}
      </div>
    </>
  ) : null;

  /* Info: (20230420 - Julian) Cover for Mobile notification drawer */
  const isDisplayedNotificationSidebarMobileCover = (
    <div
      className={`sm:hidden ${
        componentVisible ? 'visible opacity-100' : 'invisible opacity-0'
      } fixed z-50 flex h-14 w-screen items-center justify-center overflow-x-hidden overflow-y-hidden bg-black/100 px-5 pt-1 outline-none transition-all delay-150 duration-300 hover:cursor-pointer focus:outline-none`}
    >
      <div className="flex basis-full items-end">
        <div className="mr-0 flex border-r border-lightGray1 lg:hidden">
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

        <p className="self-center pl-5">{t('NAV_BAR.NOTIFICATION_TITLE')}</p>
      </div>
    </div>
  );

  return (
    <div>
      {/* Info: (20230420 - Julian) Notification Sidebar */}
      {isDisplayedNotificationSidebarCover}
      {isDisplayedNotificationSidebarMobileCover}
      {isDisplayedNotificationSidebarSection}
    </div>
  );
}

import {useContext, useState, useEffect} from 'react';
import NotificationItem from '../notification_item/notification_item';
import {UserContext} from '../../contexts/user_context';
import {useGlobal} from '../../contexts/global_context';
import {NotificationContext} from '../../contexts/notification_context';
import {NotificationLevel} from '../../constants/notification_level';
import {MessageType} from '../../constants/message_type';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;

interface INotificationProps {
  notifyRef?: HTMLDivElement extends HTMLElement ? React.RefObject<HTMLDivElement> : null;
  componentVisible: boolean;
}

export default function Notification({
  notifyRef,
  componentVisible,
}: INotificationProps): JSX.Element {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const notificationCtx = useContext(NotificationContext);
  const globalCtx = useGlobal();
  const {enableServiceTerm} = useContext(UserContext);

  const [readAllanim, setReadAllanim] = useState('translate-x-0 opacity-100');

  /* Info: (20230522 - Julian) 初始化完成就去抓 notificationCtx ，檢查有沒有重要通知 */
  useEffect(() => {
    notificationCtx.unreadNotifications.map(v => {
      if (v.notificationLevel === NotificationLevel.CRITICAL) {
        globalCtx.dataAnnouncementModalHandler({
          id: v.id,
          title: v.title,
          content: v.content,
          numberOfButton: 1,
          reactionOfButton: '',
          messageType: MessageType.ANNOUNCEMENT,
        });
        globalCtx.visibleAnnouncementModalHandler();
      }
    });
  }, []);

  /* Deprecated: Use the title in NavBarMobile instead (20230620 - Shirley) 
  const hamburgerStyles =
    'block bg-lightWhite h-3px opacity-100 rounded-12px opacity-100 ease-in duration-300';

  /* Info: (20230327 - Julian) Hamburger Animation */
  // const displayedMobileNavBarLine1 = !componentVisible
  //   ? 'translate-y-0 rotate-0'
  //   : 'translate-y-1.5 origin-left w-3/4 -rotate-35';
  // const displayedMobileNavBarLine2 = !componentVisible ? 'translate-y-1.5 w-full' : 'w-0';
  // const displayedMobileNavBarLine3 = !componentVisible
  //   ? 'translate-y-3 rotate-0'
  //   : 'translate-y-0 origin-left w-3/4 rotate-35';
  //   */

  const readAllHandler = () => {
    setReadAllanim('translate-x-0 opacity-10');

    setTimeout(notificationCtx.readAll, 500);
  };

  const displayedNotificationList = notificationCtx.unreadNotifications.map(v => {
    return (
      <div key={v.id} className={`${readAllanim}`}>
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
          componentVisible ? 'z-60' : 'z-60'
        } flex overflow-x-hidden overflow-y-hidden outline-none focus:outline-none`}
      >
        <div className="relative mx-auto my-3 w-auto max-w-xl">
          {' '}
          <div className={`relative`}>
            {/* Info: (20230420 - Julian) sidebar self */}
            {/* sm:w-640px md:w-768px */}
            <div
              ref={notifyRef}
              className={`pointer-events-auto min-h-screen w-screen ${`lg:w-479px`} ${
                componentVisible
                  ? 'visible opacity-100 lg:translate-x-0'
                  : 'invisible opacity-10 lg:translate-x-full'
              } flex flex-col bg-darkGray pb-20 pt-8 text-white transition-all duration-100 sm:p-5 lg:bg-darkGray/90 lg:duration-300`}
            >
              <div className="mb-10 flex items-center">
                <h1 className="hidden justify-start text-2xl font-bold lg:flex lg:w-1/2 lg:shrink-0">
                  {t('NAV_BAR.NOTIFICATION_TITLE')}
                </h1>
                <div
                  className="flex w-full shrink-0 justify-end text-sm text-tidebitTheme underline hover:cursor-pointer lg:w-1/2"
                  onClick={readAllHandler}
                >
                  {t('NAV_BAR.NOTIFICATION_READ_ALL')}
                </div>
              </div>

              {/* Info: (20230420 - Julian) Notification List*/}
              <div className="flex h-80vh w-full flex-col space-y-5 overflow-y-auto overflow-x-hidden pb-40 sm:pb-10">
                {displayedNotificationList}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  /* Info: (20230420 - Julian) Cover for Desktop notification drawer */
  const isDisplayedNotificationSidebarCover = componentVisible ? (
    <>
      {/* Info: (20230420 - Julian) cover for NavBar ***Bell Icon*** */}
      <div
        className={`${
          componentVisible ? 'visible duration-700 ease-in-out' : 'invisible'
        } invisible fixed z-80 flex h-16 items-center justify-center overflow-x-hidden overflow-y-hidden bg-transparent outline-none hover:cursor-pointer focus:outline-none lg:visible lg:right-52 lg:top-6 lg:h-8 lg:w-8`}
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

  /* Info: (20230420 - Julian) Cover for Mobile notification drawer
   * 如果用戶為登入狀態， cover width 改為 7/10 讓頭貼可以被看到 */
  /* Deprecated: Use the title in NavBarMobile instead (20230620 - Shirley) 
  // const isDisplayedNotificationSidebarMobileCover = (
  //   <div
  //     className={`sm:hidden ${enableServiceTerm ? 'w-7/10' : 'w-screen'} ${
  //       componentVisible ? 'visible opacity-100' : 'invisible opacity-0'
  //     } fixed z-80 flex h-14 items-center justify-center overflow-x-hidden overflow-y-hidden bg-black/100 px-5 pt-1 outline-none transition-all delay-150 duration-300 hover:cursor-pointer focus:outline-none`}
  //   >
  //     <div className="flex basis-full items-end">
  //       <div className="flex border-r border-lightGray1 lg:hidden">
  //         <button className="z-50 inline-flex items-center justify-center rounded-md p-2">
  //           <div className="relative h-20px w-30px cursor-pointer">
  //             <span className={`${hamburgerStyles} ${displayedMobileNavBarLine1}`}></span>
  //             <span className={`${hamburgerStyles} ${displayedMobileNavBarLine2}`}></span>
  //             <span className={`${hamburgerStyles} ${displayedMobileNavBarLine3}`}></span>
  //           </div>
  //         </button>
  //       </div>

  //       <p className="self-center pl-5">{t('NAV_BAR.NOTIFICATION_TITLE')}</p>
  //     </div>
  //   </div>
  // );
  */

  return (
    <div>
      {/* Info: (20230420 - Julian) Notification Sidebar */}
      {isDisplayedNotificationSidebarCover}
      {/* Deprecated: Use the title in NavBarMobile instead (20230620 - Shirley) */}
      {/* {isDisplayedNotificationSidebarMobileCover} */}
      {isDisplayedNotificationSidebarSection}
    </div>
  );
}

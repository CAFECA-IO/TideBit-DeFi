import React, {useState, useContext} from 'react';
import Image from 'next/image';
import {NotificationContext} from '../../contexts/notification_context';
import {useGlobal} from '../../contexts/global_context';
import {INotificationItem} from '../../interfaces/tidebit_defi_background/notification_item';
import {timestampToString} from '../../lib/common';
import {MessageType} from '../../constants/message_type';
import {NotificationLevel} from '../../constants/notification_level';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;

export default function NotificationItem(notificationItem: INotificationItem) {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const {id, title, content, timestamp, notificationLevel} = notificationItem;
  const notificationCtx = useContext(NotificationContext);
  const globalCtx = useGlobal();

  const [itemStyle, setItemStyle] = useState('h-160px translate-x-0 opacity-100');

  const messageType =
    notificationLevel === NotificationLevel.CRITICAL
      ? MessageType.ANNOUNCEMENT
      : MessageType.NOTIFICATION;

  const displayTime = timestampToString(timestamp);

  const itemClickHandler = () => {
    globalCtx.dataAnnouncementModalHandler({
      id: id,
      title: title,
      content: content,
      numberOfButton: 1,
      reactionOfButton: '',
      messageType: messageType,
    });
    globalCtx.visibleAnnouncementModalHandler();

    /* Info:(20230522 - Julian)
     * notification -> item 被點擊後就直接設定 isRead
     * announcement -> 在 AnnouncementModal 裡設定 */
    if (messageType === MessageType.NOTIFICATION) {
      setItemStyle('h-0 translate-x-500px opacity-10');

      setTimeout(() => {
        notificationCtx.isRead(id);
      }, 500);
    }
  };

  return (
    <div
      className={`cursor-pointer overflow-hidden ${itemStyle} w-full transition-all duration-100 ease-in-out lg:duration-500`}
      onClick={itemClickHandler}
    >
      <div id={notificationItem.id} className="flex">
        {/* Info: (20230420 - Julian) Vertical line */}
        <span className={`ml-2 h-160px w-5px shrink-0 bg-tidebitTheme`}></span>

        {/* Info: (20230420 - Julian) contain divider */}
        <div className="flex items-start space-x-2 border-b border-lightGray">
          {/* Info: (20231019 - Julian) Speaker */}
          <Image
            className="ml-2"
            src="/elements/megaphone.svg"
            width={30}
            height={26}
            alt="megaphone icon"
          />
          {/* Info: (20231019 - Julian) Heading & Content */}
          <div className="flex flex-col items-start">
            {/* Info: (20231019 - Julian) Heading */}
            <div className="text-xl text-lightWhite sm:text-2xl">
              <h2 className="">{t(title)}</h2>
            </div>
            {/* Info: (20230420 - Julian) Content */}
            <div className="h-full w-full py-4 text-xs text-lightGray">
              <p className="">{t(content)}</p>
            </div>
          </div>
          {/* Info: (20231019 - Julian) Date */}
          <div className="whitespace-nowrap text-end text-xs text-lightGray">
            <p>{displayTime.date}</p>
            <p>{displayTime.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

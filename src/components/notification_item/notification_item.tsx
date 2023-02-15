import React from 'react';
import Image from 'next/image';
import {INotificationItem} from '../../interfaces/tidebit_defi_background/notification_item';
{
  /* Notification item itself */
}

export default function NotificationItem(
  notificationItem: INotificationItem,
  // {title = '', date = '', time = '', content = '',
  itemHeight = 'h-158px'
  // }
) {
  const {title, content, timestamp} = notificationItem;
  const date = `${new Date(timestamp).getFullYear()}-${
    new Date(timestamp).getMonth() + 1
  }-${new Date(timestamp).getDay()}`;
  const time = `${new Date(timestamp).getHours()}:${
    new Date(timestamp).getMinutes() + 1
  }:${new Date(timestamp).getSeconds()}`;
  // title = title ? title : 'Happy Birthday to TideBit';
  // date = date ? date : '2022-10-05';
  // time = time ? time : '14:28:38';
  // content = content
  //   ? content
  //   : `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
  // invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
  // accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
  // sanctus est Lorem`;

  return (
    <div className="relative">
      <div className="mb-0 flex pb-0">
        {/* Vertical line */}
        <span className={`mx-2 ${itemHeight} w-5px shrink-0 bg-tidebitTheme`}></span>

        {/* contain divider */}
        <div>
          {/* Speaker & Heading & Content & Date */}
          <div className="">
            {/* Speaker & Heading & Date */}
            <div className="flex items-start">
              <Image
                className="sm:ml-8px"
                src="/elements/megaphone.svg"
                width={30}
                height={26}
                alt="icon"
              />

              <div className="relative mb-3 ml-3 basis-full text-start sm:mb-7">
                <div className="flex pr-2">
                  <div className="mr-5px text-xl text-lightWhite sm:whitespace-nowrap sm:text-2xl">
                    {title}
                  </div>
                  <div className="ml-auto whitespace-nowrap text-end text-xs text-lightGray">
                    <div>{date}</div>
                    <div>{time}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mt-0 mb-5 flex w-11/12 flex-wrap pl-12 pt-0 text-xs text-lightGray">
              {content}
            </div>
          </div>
        </div>
      </div>

      <span className="absolute ml-2 inline-block h-1px w-438px shrink-0 bg-lightGray"></span>
    </div>
  );
}

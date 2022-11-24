import React from 'react';
import Image from 'next/image';
{
  /* Notification item itself */
}

export default function NotificationItem({title = '', date = '', time = '', content = ''}) {
  title = title ? title : 'Happy Birthday to TideBit';
  date = date ? date : '2022-10-05';
  time = time ? time : '14:28:38';
  content = content
    ? content
    : `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
  invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
  accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
  sanctus est Lorem`;

  return (
    <div className="relative">
      <div className="mb-0 flex pb-0">
        {/* Vertical line */}
        <span className="mx-2 h-158px w-5px shrink-0 bg-tidebitTheme"></span>

        {/* contain divider */}
        <div>
          {/* Speaker & Heading & Content & Date */}
          <div className="">
            {/* Speaker & Heading & Date */}
            <div className="flex items-start">
              <Image
                className="ml-8px"
                src="/elements/megaphone.svg"
                width={30}
                height={26}
                alt="icon"
              />

              <div className="relative ml-3 mb-7 text-start">
                <div className="">
                  <div className="absolute top-0 text-2xl text-lightWhite">{title}</div>
                  <div className="pl-300px text-end text-xs text-lightGray">
                    <div>{date}</div>
                    <div>{time}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mt-0 flex w-11/12 flex-wrap pl-12 pt-0 text-xs text-lightGray">
              {content}
            </div>
          </div>
        </div>
      </div>

      <span className="absolute ml-2 inline-block h-1px w-438px shrink-0 bg-lightGray"></span>
    </div>
  );
}

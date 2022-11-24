import React from 'react';
import Image from 'next/image';
{
  /* Notification item itself */
}
{
  /* TODO: Fix -m */
}

export default function NotificationItem() {
  return (
    <div>
      <div className="-mb-28px mt-83px flex">
        <span className="mx-2 inline-block h-158px w-5px shrink-0 bg-tidebitTheme"></span>
        <div className="-mt-130px flex items-center">
          <Image
            className="ml-8px -mt-10px flex shrink-0"
            src="/elements/megaphone.svg"
            width={30}
            height={26}
            alt="icon"
          />
          <div className="relative mt-88px ml-3 text-start">
            <div className="">
              <div className="absolute top-40px text-2xl text-lightWhite">
                Happy Birthday to TideBit
              </div>
              <div className="right-20px pl-300px pt-42px pb-50px text-end text-xs text-lightGray">
                <div>2022-10-05</div>
                <div>14:28:38</div>
              </div>
            </div>
            {/* TODO: Fix -m */}

            <div className="mb-23px -mt-30px flex flex-wrap text-xs text-lightGray">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
              accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
              sanctus est Lorem
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

const TradeTab = () => {
  const isDisplayedNotificationSidebarSection = (
    <>
      {/* sidebar section */}
      <div
        className={`pointer-events-none fixed right-1 top-44px  flex overflow-x-hidden overflow-y-hidden outline-none focus:outline-none`}
      >
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {' '}
          <div className={`relative`}>
            {/* sidebar self */}
            <div
              className={`pointer-events-auto ${'w-479px'} h-screen  bg-darkGray/90 p-5 pt-8 text-white transition-all duration-300`}
            >
              <h1 className="pl-5 text-2xl font-bold">Notification</h1>
              <div className="fixed right-30px text-sm text-tidebitTheme underline hover:cursor-pointer">
                Clear All
              </div>

              {/* <div className="mt-20">
                <NotificationItem />
              </div>
              <div className="mt-5">
                <NotificationItem />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return <div>{isDisplayedNotificationSidebarSection}</div>;
};

export default TradeTab;

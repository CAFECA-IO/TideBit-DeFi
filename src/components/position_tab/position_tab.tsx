import React from 'react';

const PositionTab = () => {
  return (
    <div>
      <div
        className={`pointer-events-none fixed top-82px right-0 z-10 flex overflow-x-hidden overflow-y-hidden outline-none focus:outline-none`}
      >
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {' '}
          <div className={`relative`}>
            {/* sidebar self */}
            <div
              className={`pointer-events-auto ${'w-300px'} h-screen bg-darkGray p-5 text-white transition-all duration-300`}
            >
              <h1 className="pl-5 text-2xl font-bold">Order information</h1>

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
    </div>
  );
};

export default PositionTab;

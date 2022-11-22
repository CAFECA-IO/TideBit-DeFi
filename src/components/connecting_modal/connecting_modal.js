import React from 'react';
import {ImCross} from 'react-icons/im';

// TODO: Loading component
// TODO: Procedure component
// TODO: Signature success or not

export default function ConnectingModal({
  connecting = false,
  connected = false,
  error = false,
  signing = false,
  signature = false,
  ...otherProps
}) {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {/*content & panel*/}
          <div
            id="connectModal"
            className="relative flex w-full flex-col rounded-lg border-0 bg-darkGray1 shadow-lg outline-none focus:outline-none"
          >
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-8">
              <h3 className="mb-3 mt-2 ml-auto text-4xl font-semibold text-lightWhite">
                Wallet Connect
              </h3>
              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="mx-8 my-4 block h-6 w-6 outline-none focus:outline-none">
                  <ImCross />
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative mx-10 flex-auto p-6">
              <div className="my-4 text-lg leading-relaxed text-white">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    Test
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    Test
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    Test
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    Test
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    Test
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    Test
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    Test
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    Test
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    Test
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    Test
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    Test
                  </div>
                  <div className="col-span-1 flex items-center justify-center rounded bg-darkGray2">
                    Test
                  </div>
                </div>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b p-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
}

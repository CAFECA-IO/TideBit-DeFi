import {ImCross} from 'react-icons/im';
import React from 'react';

interface IToastProps {
  title?: string;
  content?: string | JSX.Element | undefined;
  time?: string;
  toastHandler?: () => void;
  showToast?: boolean;
}

const DevToast = ({
  title = 'Notification',
  content = 'Signature hash: ',
  time: mins = '2',
  ...otherProps
}: IToastProps): JSX.Element => {
  const {toastHandler, showToast} = otherProps;

  const isDisplayedToast = showToast && (
    <div className="pointer-events-none fixed right-2 top-10 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-transparent outline-none focus:outline-none">
      <div className="relative mx-auto my-6 w-auto max-w-xl">
        <div className="flex justify-center space-x-2">
          <div
            className="pointer-events-auto z-80 mx-auto mr-5 mt-2 block w-72 max-w-full rounded-lg bg-white bg-clip-padding text-sm shadow-md shadow-cuteBlue/70 outline-none focus:outline-none"
            id="delicious toast"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            data-mdb-autohide="false"
          >
            <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-clip-padding px-3 py-2">
              <p className="text-lg font-bold text-gray-500">{title}</p>
              <div className="flex items-center">
                <p className="mr-2 text-xs text-gray-600">{mins} mins ago</p>
                <ImCross
                  className="ml-2 box-content h-4 w-4 rounded-none border-none text-cuteBlue1 opacity-50 hover:cursor-pointer hover:text-cuteBlue1/50 hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                  type="button"
                  data-mdb-dismiss="toast"
                  aria-label="Close"
                  onClick={toastHandler}
                />
              </div>
            </div>
            <div className="break-words rounded-b-lg p-3 text-gray-700">{content}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return <div>{isDisplayedToast}</div>;
};

export default DevToast;

import React from 'react';
import {ImCross} from 'react-icons/im';
import {ToastContainer} from 'react-toastify';

const Toast = () => {
  const toastClassName = () =>
    'pl-14 pr-3 my-2 overflow-hidden cursor-pointer w-screen sm:w-fit sm:whitespace-nowrap h-50px bg-darkGray1 inline-flex items-center justify-between shadow-lg shadow-black/80';

  return (
    <div>
      <ToastContainer
        position="bottom-left"
        hideProgressBar
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="dark"
        limit={10}
        closeButton={() => <ImCross className="w-12px text-lightGray2" />}
        toastClassName={toastClassName}
      />
    </div>
  );
};

export default Toast;

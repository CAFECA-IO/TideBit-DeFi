import React from 'react';
import {ImCross} from 'react-icons/im';
import {ToastContainer} from 'react-toastify';

const Toast = () => {
  const toastClassName = () =>
    'pl-14 pr-3 mt-2 overflow-hidden cursor-pointer w-550px h-50px bg-darkGray1 flex items-center justify-between shadow-lg shadow-black/80';

  return (
    <div>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="dark"
        limit={10}
        closeButton={<ImCross className="text-lightGray2" />}
        toastClassName={toastClassName}
      />
    </div>
  );
};

export default Toast;

import React from 'react';
import {ImCross} from 'react-icons/im';
import {ToastContainer} from 'react-toastify';

const Toast = () => {
  const toastClassName = () =>
    'pr-4 overflow-hidden cursor-pointer w-500px h-50px bg-darkGray1 flex items-center justify-between';

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
        closeButton={<ImCross />}
        toastClassName={toastClassName}
      />
    </div>
  );
};

export default Toast;

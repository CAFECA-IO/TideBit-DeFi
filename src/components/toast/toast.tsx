import React from 'react';
import {ToastContainer} from 'react-toastify';

const Toast = () => {
  return (
    <div>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="dark"
        limit={10}
      />
    </div>
  );
};

export default Toast;

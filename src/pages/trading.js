import React, {useState} from 'react';
import SignatureProcess from '../components/connecting_modal/connecting_modal';
import Toast from '../components/toast/toast';

// <SignatureProcess loading={true} />

export default function Trading() {
  const [showToast, setShowToast] = useState(false);

  const toastHandler = () => {
    setShowToast(!showToast);
  };

  // const isDisplayedToast = showToast && (
  //   <Toast
  //     title="Test title"
  //     content="custom content"
  //     toastHandler={toastHandler}
  //     showToast={showToast}
  //   />
  // );

  return (
    <div className="flex justify-center">
      <button
        onClick={toastHandler}
        className="rounded-xl bg-cuteBlue px-5 py-2 text-black hover:bg-cuteBlue/70"
      >
        showToast Switch
      </button>
      {/* <showToast /> */}
      <Toast
        title="The title"
        content={`Signature: \n 0xf6ecd3ca1eddbee3b25b3371da896d9437ca271408716725bbd33ac2e6c7c9c8215972b41c80d1bfbe7aeb1aad4c0c8ac80fbe4293528daa4ab6da0747fe04fe1c`}
        toastHandler={toastHandler}
        showToast={showToast}
      />
      {/* {isDisplayedToast} */}
    </div>
  );
}

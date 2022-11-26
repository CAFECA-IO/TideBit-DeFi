import React, {useState} from 'react';
import SignatureProcess from '../components/connecting_modal/connecting_modal';
import Toast from '../components/toast/toast';

// <SignatureProcess loading={true} />

export default function Trading() {
  const [myToast, setMyToast] = useState(true);
  const myToastHandler = () => {
    setMyToast(!myToast);
  };
  const isDisplayedToast = myToast && <Toast title="Test title" content="custom content" />;

  return (
    <div className="flex justify-center">
      <button
        onClick={myToastHandler}
        className="rounded-xl bg-cuteBlue px-5 py-2 text-black hover:bg-cuteBlue/70"
      >
        Toast Switch
      </button>
      {/* <Toast /> */}
      {isDisplayedToast}
    </div>
  );
}

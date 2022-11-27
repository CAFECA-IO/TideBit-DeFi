import React, {useState} from 'react';
import Toast from '../components/toast/toast';
import ConnectingModal from '../components/wallet/connecting_modal';
import useOuterClick from '../hooks/lib/use_outer_click';
import HelloModal from '../components/wallet/hello_modal';
import QrcodeModal from '../components/wallet/qrcode_modal';

export default function Trial() {
  const [showToast, setShowToast] = useState(false);
  const {
    ref: qrcodeModalRef,
    componentVisible: qrcodeModalVisible,
    setComponentVisible: setQrcodeModalVisible,
  } = useOuterClick(true);

  const qrcodeClickHandler = () => {
    setQrcodeModalVisible(!qrcodeModalVisible);
  };

  const toastHandler = () => {
    setShowToast(!showToast);
  };

  return (
    // <ConnectingModal isShowing={true} />
    // <HelloModal
    //   helloModalRef={helloModalRef}
    //   helloModalVisible={helloModalVisible}
    //   helloClickHandler={helloClickHandler}
    // />

    <QrcodeModal
      qrcodeModalRef={qrcodeModalRef}
      qrcodeModalVisible={qrcodeModalVisible}
      qrcodeClickHandler={qrcodeClickHandler}
    />

    // <div className="flex justify-center">
    //   <button
    //     onClick={toastHandler}
    //     className="rounded-xl bg-cuteBlue px-5 py-2 text-black hover:bg-cuteBlue/90"
    //   >
    //     showToast Switch
    //   </button>
    //   {/* <showToast /> */}
    //   <Toast
    //     title="The title"
    //     content={`Signature: \n 0xf6ecd3ca1eddbee3b25b3371da896d9437ca271408716725bbd33ac2e6c7c9c8215972b41c80d1bfbe7aeb1aad4c0c8ac80fbe4293528daa4ab6da0747fe04fe1c`}
    //     toastHandler={toastHandler}
    //     showToast={showToast}
    //   />
    //   {/* {isDisplayedToast} */}
    // </div>
  );
}

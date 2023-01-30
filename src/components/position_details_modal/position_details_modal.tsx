import Image from 'next/image';
import {ImCross} from 'react-icons/im';

interface IPositionDetailsModal {
  modalVisible: boolean;
  modalClickHandler: () => void;
}

const PositionDetailsModal = ({modalVisible, modalClickHandler}: IPositionDetailsModal) => {
  const isDisplayedDetailedPositionModal = modalVisible ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {/*content & panel*/}
          <div
            id="connectModal"
            // ref={connectingModalRef}
            className="relative flex h-726px w-450px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-6">
              <Image src="/elements/group_2371.svg" width={40} height={40} alt="icon" />
              {/* <h3 className="mx-auto mt-2 w-20rem pl-1/8 text-4xl font-semibold text-lightWhite">
                Wallet Connect
              </h3> */}
              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                  <ImCross onClick={modalClickHandler} />
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative flex-auto pt-1">
              <div className="text-lg leading-relaxed text-lightWhite">
                {/* <div className="flex-col justify-center text-center">content</div> */}
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b p-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  ) : null;

  return <>{isDisplayedDetailedPositionModal}</>;
};

export default PositionDetailsModal;

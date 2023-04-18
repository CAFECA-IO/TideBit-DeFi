import Lottie from 'lottie-react';
import bigConnectingAnimation from '../../../public/animation/lf30_editor_qlduo5gq.json';
import Image from 'next/image';
import RippleButton from '../ripple_button/ripple_button';

export interface ILoadingModal {
  modalRef?: React.RefObject<HTMLDivElement>;
  modalVisible: boolean;
  modalClickHandler: () => void;
  modalTitle: string;
  modalContent: string;
  btnMsg?: string;
  btnUrl?: string;
}

const LoadingModal = ({
  modalRef: modalRef,
  modalVisible: modalVisible,
  modalClickHandler: modalClickHandler,
  modalTitle,
  modalContent,
  btnMsg,
  btnUrl,
  ...otherProps
}: ILoadingModal) => {
  const isDisplayedConnecting = modalVisible ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {/*content & panel*/}
          <div
            id="loadingModal"
            ref={modalRef}
            className="relative flex h-420px w-296px flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-6">
              <h3 className="mx-auto mt-2 w-full text-center text-2xl font-normal text-lightWhite">
                {modalTitle}
              </h3>
              <button className="z-10 float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span
                  onClick={modalClickHandler}
                  className="absolute top-3 right-3 block outline-none focus:outline-none"
                >
                  <Image
                    src="/elements/group_14915.svg"
                    width={30}
                    height={30}
                    alt="zoom-out icon"
                  />
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative flex-auto pt-1">
              <div className="text-lg leading-relaxed text-lightWhite">
                <div className="flex-col justify-center text-center">
                  <Lottie className="ml-7 w-full pt-2" animationData={bigConnectingAnimation} />
                  <div className="mt-2 mb-3 text-base">{modalContent}</div>

                  {btnUrl && btnMsg ? (
                    <a href={btnUrl} target="_blank">
                      <RippleButton
                        className={`mt-4 w-4/5 rounded border-0 bg-tidebitTheme py-2 text-base text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none md:mt-0`}
                        buttonType="button"
                        onClick={modalClickHandler}
                      >
                        {btnMsg}
                      </RippleButton>
                    </a>
                  ) : btnMsg ? (
                    <RippleButton
                      className={`mt-4 w-4/5 rounded border-0 bg-tidebitTheme py-2 text-base text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none md:mt-0`}
                      buttonType="button"
                      onClick={modalClickHandler}
                    >
                      {btnMsg}
                    </RippleButton>
                  ) : null}
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
  ) : null;

  return <div>{isDisplayedConnecting}</div>;
};

export default LoadingModal;

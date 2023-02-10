import Lottie from 'lottie-react';
import failedAnimation from '../../../public/animation/Lottie_Main_Comp.json';
import RippleButton from '../ripple_button/ripple_button';
import Image from 'next/image';
import {ImCross} from 'react-icons/im';

export interface IFailedModal {
  modalRef?: React.RefObject<HTMLDivElement>;
  modalVisible: boolean;
  modalClickHandler: () => void;
  modalTitle: string;
  modalContent: string;
  btnMsg?: string;
  btnUrl?: string;
  failedTitle?: string;
  failedMsg: string;
}

const FailedModal = ({
  modalRef: modalRef,
  modalVisible: modalVisible,
  modalClickHandler: modalClickHandler,
  modalTitle,
  modalContent,
  btnMsg,
  btnUrl,
  failedTitle,
  failedMsg,
  ...otherProps
}: IFailedModal) => {
  const failContent = (
    <div className="relative flex-auto pt-1">
      <div className="text-lg leading-relaxed text-lightWhite">
        <div className="flex-col items-center justify-center text-center">
          <Lottie className="ml-70px w-150px pt-5" animationData={failedAnimation} />
          <div className="text-base text-lightWhite">{modalContent}</div>

          <div className="mx-2 my-4 bg-lightRed">
            <p className="text-lg">{failedTitle ?? `Failed`}</p>

            <p className="mt-1 bg-darkGray1/50 py-2 px-5px text-start text-xs leading-4 tracking-wide">
              {failedMsg}
            </p>
          </div>
          <div>
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
    </div>
  );

  const isDisplayedModal = modalVisible ? (
    <>
      {/*  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">*/}
      {/*  overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none */}
      {/* position: relative; top: 50%; left: 50%; transform: translate(-50%, -50%) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        {/* The position of the modal */}
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          {' '}
          {/*content & panel*/}
          <div
            id="transferProcessModal"
            // ref={modalRef}
            className="relative flex h-420px w-296px flex-col rounded-3xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/*header*/}
            <div className="flex items-start justify-between rounded-t pt-6">
              <h3 className="mx-auto mt-2 w-full text-center text-2xl font-normal text-lightWhite">
                {modalTitle}
                {/* {(transferProcessStep = 'deposit-' ? 'Deposit' : 'Withdraw')} */}
              </h3>
              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                  <ImCross onClick={modalClickHandler} />
                </span>
              </button>
            </div>
            {/*body*/}
            {failContent}
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b p-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  ) : null;

  return <div>{isDisplayedModal}</div>;
};

export default FailedModal;
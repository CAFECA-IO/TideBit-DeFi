import Lottie from 'lottie-react';
import successfulAnimation from '../../../public/animation/processing-success.json';
import RippleButton from '../ripple_button/ripple_button';
import {ImCross} from 'react-icons/im';
import React from 'react';

export interface ISuccessfulModal {
  modalRef?: React.RefObject<HTMLDivElement>;
  modalVisible: boolean;
  modalClickHandler: () => void;
  modalTitle: string;
  modalContent?: string;
  btnMsg?: string;
  btnUrl?: string;
}

const SuccessfulModal = ({
  modalVisible: modalVisible,
  modalClickHandler: modalClickHandler,
  modalTitle,
  modalContent,
  btnMsg,
  btnUrl,
}: ISuccessfulModal) => {
  const successContent = (
    <div className="relative flex-auto pt-1">
      <div className="text-lg leading-relaxed text-lightWhite">
        <div className="flex-col justify-center text-center">
          <Lottie
            className="ml-70px w-150px pb-5 pt-7"
            animationData={successfulAnimation}
            loop={false}
          />
          <div className="mb-0 mt-3 h-55px text-base">
            {modalContent ? (
              modalContent
            ) : (
              <p>
                It will take <span className="text-tidebitTheme">3 - 5</span> mins to finish all the
                process
              </p>
            )}
          </div>
          <div className="mt-5">
            {btnUrl && btnMsg ? (
              <a href={btnUrl} target="_blank" rel="noreferrer">
                <RippleButton
                  id="SuccessfulModalButton"
                  className={`mt-4 w-4/5 rounded border-0 bg-tidebitTheme py-2 text-base text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none md:mt-0`}
                  buttonType="button"
                  onClick={modalClickHandler}
                >
                  {btnMsg}
                </RippleButton>
              </a>
            ) : btnMsg ? (
              <RippleButton
                id="SuccessfulModalButton"
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
      <div className="fixed inset-0 z-90 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative mx-auto my-6 w-auto max-w-xl">
          <div
            id="SuccessfulModal"
            className="relative flex h-420px w-296px flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            <div className="flex items-start justify-between rounded-t pt-6">
              <h3 className="mx-auto mt-2 w-full text-center text-2xl font-normal text-lightWhite">
                {modalTitle}
              </h3>
              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute right-5 top-5 block outline-none focus:outline-none">
                  <ImCross onClick={modalClickHandler} />
                </span>
              </button>
            </div>
            {successContent}

            <div className="flex items-center justify-end rounded-b p-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  ) : null;

  return <div>{isDisplayedModal}</div>;
};

export default SuccessfulModal;

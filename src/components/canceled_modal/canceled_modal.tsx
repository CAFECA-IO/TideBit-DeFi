import Lottie from 'lottie-react';
import canceledAnimation from '../../../public/animation/lf30_editor_frrs7znj.json';
import RippleButton from '../ripple_button/ripple_button';
import {ImCross} from 'react-icons/im';
import React from 'react';

export interface IFailedModal {
  modalRef?: React.RefObject<HTMLDivElement>;
  modalVisible: boolean;
  modalClickHandler: () => void;
  modalTitle: string;
  modalContent: string;
  btnMsg?: string;
  btnUrl?: string;
}

const CanceledModal = ({
  modalVisible: modalVisible,
  modalClickHandler: modalClickHandler,
  modalTitle,
  modalContent,
  btnMsg,
  btnUrl,
}: IFailedModal) => {
  const cancellationContent = (
    <div className="relative flex-auto pt-1">
      <div className="text-lg leading-relaxed text-lightWhite">
        <div className="flex-col justify-center text-center">
          <Lottie
            className="ml-70px w-150px pt-10"
            animationData={canceledAnimation}
            loop={false}
          />
          <div className="mt-10 text-base text-lightWhite">{modalContent}</div>
          <div className="mt-5">
            {btnUrl && btnMsg ? (
              <a href={btnUrl} target="_blank" rel="noreferrer">
                <RippleButton
                  id="CanceledModalButton"
                  className={`mt-4 w-4/5 rounded border-0 bg-tidebitTheme py-2 text-base text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none md:mt-0`}
                  buttonType="button"
                  onClick={modalClickHandler}
                >
                  {btnMsg}
                </RippleButton>
              </a>
            ) : btnMsg ? (
              <RippleButton
                id="CanceledModalButton"
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
    /* Info: (20231204 - Julian) Blur Mask */
    <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/25 outline-none backdrop-blur-sm focus:outline-none">
      <div
        id="CanceledModal"
        className="relative flex h-420px w-296px flex-col rounded-xl py-6 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
      >
        <div className="flex items-cneter justify-between">
          <h3 className="mx-auto mt-2 w-full text-center text-2xl font-normal text-lightWhite">
            {modalTitle}
          </h3>
          <button
            id="CanceledModalCloseButton"
            onClick={modalClickHandler}
            className="absolute right-5 top-5 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none"
          >
            <ImCross />
          </button>
        </div>
        {cancellationContent}
      </div>
    </div>
  ) : null;

  return <div>{isDisplayedModal}</div>;
};

export default CanceledModal;

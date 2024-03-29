import Lottie from 'lottie-react';
import failedAnimation from '../../../public/animation/Lottie_Main_Comp.json';
import RippleButton from '../ripple_button/ripple_button';
import {ImCross} from 'react-icons/im';
import {useTranslation} from 'next-i18next';
import React from 'react';

type TranslateFunction = (s: string) => string;

export interface IFailedModal {
  modalRef?: React.RefObject<HTMLDivElement>;
  modalVisible: boolean;
  modalClickHandler: () => void;
  modalTitle: string;
  modalContent?: string;
  btnMsg?: string;
  btnUrl?: string;
  failedTitle?: string;
  failedMsg?: string;
  btnFunction?: () => void;
}

const FailedModal = ({
  modalVisible: modalVisible,
  modalClickHandler: modalClickHandler,
  modalTitle,
  modalContent,
  btnMsg,
  btnUrl,
  failedTitle,
  failedMsg,
  btnFunction,
}: IFailedModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  /* Info:(20230530 - Julian)
   * 1. 如果 failedTitle 和 failedMsg 都有填入(&&)，則顯示有紅框的 Failed Modal
   * 2. 如果只填入 modalContent，則不顯示紅框
   * 3. 如果三者都沒有填入，則不顯示紅框，並填入預設內容 */

  const displayedModalContent =
    !failedTitle && !failedMsg && !modalContent ? t('POSITION_MODAL.FAILED_TITLE') : modalContent;

  const btnClickHandler = () => {
    if (btnFunction) {
      btnFunction();
    }

    modalClickHandler();
  };

  const failContent = (
    <div className="relative mx-6 flex flex-auto flex-col items-center pt-1 text-center text-lg leading-relaxed text-lightWhite">
      <Lottie className="w-150px pb-2 pt-5" animationData={failedAnimation} />
      <div className="text-base text-lightWhite">{displayedModalContent}</div>

      <div className="w-full grow">
        {failedTitle && failedMsg ? (
          <div className="mx-21px my-4 bg-lightRed">
            <p className="text-lg">{failedTitle}</p>

            <p className="mt-1 bg-darkGray1/50 px-3 py-2 text-start text-xs leading-4 tracking-wide">
              {failedMsg}
            </p>
          </div>
        ) : null}
      </div>

      <div className="relative">
        {btnUrl && btnMsg ? (
          <a href={btnUrl} target="_blank" rel="noreferrer">
            <RippleButton
              id="FailedModalButton"
              className={`absolute bottom-0 mt-0 w-254px rounded border-0 bg-tidebitTheme py-2 text-base text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none md:mt-0`}
              buttonType="button"
              onClick={btnClickHandler}
            >
              {btnMsg}
            </RippleButton>
          </a>
        ) : btnMsg ? (
          <RippleButton
            id="FailedModalButton"
            className={`absolute bottom-0 mt-0 w-254px rounded border-0 bg-tidebitTheme py-2 text-base text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none md:mt-0`}
            buttonType="button"
            onClick={btnClickHandler}
          >
            {btnMsg}
          </RippleButton>
        ) : null}
      </div>
    </div>
  );

  const isDisplayedModal = modalVisible ? (
    /* Info: (20231019 - Julian) Blur Mask */
    <div className="fixed inset-0 z-80 bg-black/25 flex items-center justify-center overflow-hidden backdrop-blur-sm">
      <div
        id="FailedModal"
        className="relative flex h-auto min-h-420px w-300px py-6 flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
      >
        <div className="flex items-center justify-between">
          <h3 className="mx-auto mt-2 w-full text-center text-2xl font-normal text-lightWhite">
            {modalTitle}
          </h3>
          <button
            id="FailedModalCloseButton"
            onClick={modalClickHandler}
            className="absolute right-5 top-5 p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none"
          >
            <ImCross />
          </button>
        </div>
        {failContent}
      </div>
    </div>
  ) : null;

  return <>{isDisplayedModal}</>;
};

export default FailedModal;

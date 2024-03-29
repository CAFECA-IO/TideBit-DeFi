import Lottie from 'lottie-react';
import bigConnectingAnimation from '../../../public/animation/lf30_editor_qlduo5gq.json';
import Image from 'next/image';
import RippleButton from '../ripple_button/ripple_button';
import {GlobalContext} from '../../contexts/global_context';
import {ToastTypeAndText} from '../../constants/toast_type';
import React, {useContext} from 'react';
import {useTranslation} from 'next-i18next';
import {ToastId} from '../../constants/toast_id';

type TranslateFunction = (s: string) => string;
export interface ILoadingModal {
  modalRef?: React.RefObject<HTMLDivElement>;
  modalVisible: boolean;
  modalClickHandler: () => void;
  modalTitle: string;
  modalContent: string;
  btnMsg?: string;
  btnUrl?: string;
  isShowZoomOutBtn?: boolean;
}

const LoadingModal = ({
  modalRef: modalRef,
  modalVisible: modalVisible,
  modalClickHandler: modalClickHandler,
  modalTitle,
  modalContent,
  btnMsg,
  btnUrl,
  isShowZoomOutBtn,
}: ILoadingModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const globalCtx = useContext(GlobalContext);

  const zoomOutHandler = () => {
    /**
     * Info: (20230424 - Julian) 關掉 modal
     * 1. 記錄目前 modal 的內容 (modalReOpenData)
     * 2. 關掉 modal
     * 3. 顯示 toast
     * 4. 點擊 toast 關掉 toast 並且顯示 modal
     */
    modalClickHandler();

    if (globalCtx.visibleLoadingModal && globalCtx.toast) {
      const toastId =
        modalTitle === t('D_W_MODAL.DEPOSIT')
          ? ToastId.DEPOSIT
          : t('D_W_MODAL.WITHDRAW')
          ? ToastId.WITHDRAW
          : `${modalTitle}_LoadingModalMinimized`;

      globalCtx.toast({
        type: ToastTypeAndText.INFO.type,
        message: `${modalTitle} ${t('TOAST.PROGRESSING_MESSAGE')}`,
        toastId: toastId,
        autoClose: false,
        isLoading: true,
        typeText: t(ToastTypeAndText.INFO.text),
        modalReOpenData: {
          modalTitle: modalTitle,
          modalContent: modalContent,
          btnMsg: btnMsg,
          btnUrl: btnUrl,
          isShowZoomOutBtn: true,
        },
      });
    }
  };

  const isDisplayedConnecting = modalVisible ? (
    /* Info: (20231204 - Julian) Blur Mask */
    <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/25 outline-none backdrop-blur-sm focus:outline-none">
      <div
        id="LoadingModal"
        ref={modalRef}
        className="relative flex h-420px w-296px py-6 flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
      >
        <div className="flex items-center justify-between">
          <h3 className="mx-auto mt-2 w-full text-center text-2xl font-normal text-lightWhite">
            {modalTitle}
          </h3>
          {isShowZoomOutBtn ? (
            <button className="z-10 float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
              <span
                onClick={zoomOutHandler}
                className="absolute top-3 right-3 block outline-none focus:outline-none"
              >
                <Image src="/elements/group_14915.svg" width={30} height={30} alt="zoom-out icon" />
              </span>
            </button>
          ) : null}
        </div>

        <div className="relative flex flex-col justify-center text-center text-lg leading-relaxed text-lightWhite">
          <Lottie className="ml-7 w-full pt-2" animationData={bigConnectingAnimation} />
          <div className="mt-2 mb-3 text-base">{modalContent}</div>

          {btnUrl && btnMsg ? (
            <a href={btnUrl} target="_blank" rel="noreferrer">
              <RippleButton
                id="LoadingModalButton"
                className={`mt-4 w-4/5 rounded border-0 bg-tidebitTheme py-2 text-base text-white transition-colors duration-300 hover:cursor-pointer hover:bg-cyan-600 focus:outline-none md:mt-0`}
                buttonType="button"
                onClick={modalClickHandler}
              >
                {btnMsg}
              </RippleButton>
            </a>
          ) : btnMsg ? (
            <RippleButton
              id="LoadingModalButton"
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
  ) : null;

  return <>{isDisplayedConnecting}</>;
};

export default LoadingModal;

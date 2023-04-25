import Lottie from 'lottie-react';
import bigConnectingAnimation from '../../../public/animation/lf30_editor_qlduo5gq.json';
import Image from 'next/image';
import RippleButton from '../ripple_button/ripple_button';
import {GlobalContext} from '../../contexts/global_context';
import {useContext} from 'react';
import {useTranslation} from 'next-i18next';

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
  //zoomOutHandler: () => void;
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
  ...otherProps
}: ILoadingModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const globalCtx = useContext(GlobalContext);

  const zoomOutHandler = () => {
    /**
     * Info: (20230424 - Julian) 關掉 modal
     * 1. 記錄目前 modal 的內容
     * 2. 關掉 modal
     * 3. 顯示 toast
     * 4. 點擊 toast 關掉 toast 並且顯示 modal
     */
    modalClickHandler();

    if (globalCtx.visibleLoadingModal) {
      globalCtx.toast({
        type: 'info',
        message: `${modalTitle} is still in progress, please wait...`,
        toastId: 'loadingModalClosed',
        autoClose: false,
        isLoading: true,
        typeText: t('TOAST.INFO'),
      }); /* ToDo:(20230424 - Julian) 找到關掉 toast 的 function */
    }
  };

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
              {isShowZoomOutBtn ? (
                <button className="z-10 float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                  <span
                    onClick={zoomOutHandler}
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
              ) : null}
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

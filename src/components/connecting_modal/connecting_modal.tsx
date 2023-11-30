import Lottie from 'lottie-react';
import bigConnectingAnimation from '../../../public/animation/lf30_editor_qlduo5gq.json';
import {ImCross} from 'react-icons/im';
import {useTranslation} from 'next-i18next';
import React from 'react';

type TranslateFunction = (s: string) => string;
interface IConnectingModal {
  connectingModalRef?: React.RefObject<HTMLDivElement>;
  connectingModalVisible?: boolean;
  connectingClickHandler?: () => void;
}

const ConnectingModal = ({
  connectingModalRef,
  connectingModalVisible = false,
  connectingClickHandler,
}: IConnectingModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const isDisplayedConnecting = connectingModalVisible ? (
    <>
      <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          <div
            id="ConnectingModal"
            ref={connectingModalRef}
            className="relative flex h-600px w-450px flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            <div className="flex items-start justify-between rounded-t pt-6">
              <h3 className="mx-auto mt-2 w-20rem pl-1/8 text-4xl font-semibold text-lightWhite">
                {t('WALLET_PANEL.TITLE')}
              </h3>
              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                  <ImCross onClick={connectingClickHandler} />
                </span>
              </button>
            </div>
            <div className="relative flex-auto pt-1">
              <div className="text-lg leading-relaxed text-lightWhite">
                <div className="flex-col justify-center text-center">
                  <Lottie className="ml-7 w-full pt-12" animationData={bigConnectingAnimation} />
                  <div className="mt-10 text-xl">{t('WALLET_PANEL.CONNECTING')}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end rounded-b p-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  ) : null;

  return <div>{isDisplayedConnecting}</div>;
};

export default ConnectingModal;

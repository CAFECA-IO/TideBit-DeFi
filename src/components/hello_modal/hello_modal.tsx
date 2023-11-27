import {ImCross} from 'react-icons/im';
import Image from 'next/image';
import TideButton from '../../components/tide_button/tide_button';
import Link from 'next/link';
import {useTranslation} from 'next-i18next';
import React from 'react';

type TranslateFunction = (s: string) => string;

interface IHelloModal {
  helloModalRef?: React.RefObject<HTMLDivElement>;
  helloModalVisible?: boolean;
  helloClickHandler?: () => void;
}

const HelloModal = ({helloModalRef, helloModalVisible = false, helloClickHandler}: IHelloModal) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const isDisplayedHelloModal = helloModalVisible ? (
    <>
      <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-xl">
          <div
            id="connectModal"
            ref={helloModalRef}
            className="relative flex h-auto w-full flex-col rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none md:w-450px"
          >
            <div className="mx-auto flex items-start justify-between rounded-t pt-6">
              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                  <ImCross onClick={helloClickHandler} />
                </span>
              </button>
            </div>
            <div className="flex flex-auto flex-col items-center pt-32 pb-5">
              <div className="text-lg leading-relaxed text-lightWhite">
                <div className="flex flex-col items-center px-10">
                  <Image
                    className="mt-10 w-100px"
                    src="/elements/path_25939.svg"
                    width={200}
                    height={200}
                    alt="Hello"
                  />
                  <div className="mt-8 mb-40 text-xl text-lightGray">
                    {t('WALLET_PANEL.HELLO_DESCRIPTION')}
                  </div>

                  <TideButton
                    id="hello-modal-button"
                    className="rounded bg-tidebitTheme px-12 py-2 font-normal transition-all hover:opacity-90"
                    onClick={helloClickHandler}
                  >
                    {t('WALLET_PANEL.DONE_BUTTON')}
                  </TideButton>
                  <Link
                    className="mt-3 text-base text-tidebitTheme underline underline-offset-4"
                    href="#"
                  >
                    {t('WALLET_PANEL.HELLO_CONNECT_LINK')}
                  </Link>
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

  return <div>{isDisplayedHelloModal}</div>;
};

export default HelloModal;

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
    /* Info: (20231129 - Julian) Blur Mask */
    <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/25 outline-none backdrop-blur-sm focus:outline-none">
      <div
        id="HelloModal"
        ref={helloModalRef}
        className="relative flex h-auto w-9/10 flex-col rounded-xl bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none md:w-450px"
      >
        <button
          id="HelloCloseButton"
          onClick={helloClickHandler}
          className="absolute right-3 top-3 p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none lg:right-5 lg:top-5"
        >
          <ImCross />
        </button>
        <div className="flex flex-col items-center pt-32 pb-5 px-10 text-lg leading-relaxed text-lightWhite">
          <Image
            className="mt-10 w-100px"
            src="/elements/path_25939.svg"
            width={200}
            height={200}
            alt="Hello"
          />
          <h2 className="mt-8 mb-40 text-xl text-lightGray">
            {t('WALLET_PANEL.HELLO_DESCRIPTION')}
          </h2>

          <TideButton
            id="HelloModalDone"
            className="rounded bg-tidebitTheme px-12 py-2 font-normal transition-all hover:opacity-90"
            onClick={helloClickHandler}
          >
            {t('WALLET_PANEL.DONE_BUTTON')}
          </TideButton>
          <Link
            id="ConnectTidebitLink"
            className="my-3 text-base text-tidebitTheme underline underline-offset-4"
            href="#"
          >
            {t('WALLET_PANEL.HELLO_CONNECT_LINK')}
          </Link>
        </div>
      </div>
    </div>
  ) : null;

  return <>{isDisplayedHelloModal}</>;
};

export default HelloModal;

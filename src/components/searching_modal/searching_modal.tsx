import Lottie from 'lottie-react';
import searching from '../../../public/animation/searching.json';
import {ImCross} from 'react-icons/im';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/tidebit_defi_background/locale';
import React from 'react';

interface ISearchingModalProps {
  className?: string;
  modalVisible: boolean;
  modalClickHandler: () => void;
}

const SearchingModal = ({modalVisible, modalClickHandler}: ISearchingModalProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const searchingSection = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative h-160px w-160px pt-10">
        <Lottie animationData={searching} />
      </div>
      <p className="pt-20 text-center text-sm text-white lg:text-lg">
        {t('WALLET_PANEL.SEARCHING')}
      </p>
    </div>
  );

  const searchingModal = (
    /* Info: (20231204 - Julian) Blur Mask */
    <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/25 outline-none backdrop-blur-sm focus:outline-none">
      <div
        id="SearchingModal"
        className="relative flex w-296px flex-col items-center rounded-xl py-6 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
      >
        <div className="mx-auto flex items-center">
          <h3 className="my-4 mx-auto text-xl font-semibold leading-tight text-lightWhite lg:text-4xl">
            {t('WALLET_PANEL.TITLE')}
          </h3>
          <button
            id="SearchingModalCloseButton"
            className="absolute top-5 right-5 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none"
            onClick={modalClickHandler}
          >
            <ImCross />
          </button>
        </div>
        <div className="relative mx-50px flex-auto">
          <div className="my-4 text-lg leading-relaxed text-white">{searchingSection}</div>
        </div>
      </div>
    </div>
  );

  const isDisplayedSearchingModal = modalVisible ? searchingModal : null;

  return <div>{isDisplayedSearchingModal}</div>;
};

export default SearchingModal;

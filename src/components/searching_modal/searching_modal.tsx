import Lottie from 'lottie-react';
import searching from '../../../public/animation/searching.json';
import {ImCross} from 'react-icons/im';
import {useTranslation} from 'next-i18next';
import {TranslateFunction} from '../../interfaces/tidebit_defi_background/locale';

interface ISearchingModalProps {
  className?: string;
  modalVisible: boolean;
  modalClickHandler: () => void;
}

const SearchingModal = ({className, modalVisible, modalClickHandler}: ISearchingModalProps) => {
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
    <>
      <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative my-6 mx-20px w-auto max-w-xl md:mx-auto">
          <div className="relative flex w-full flex-col items-center rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none">
            <div className="mx-auto flex items-start rounded-t pt-10">
              <h3 className="my-4 mx-auto text-xl font-semibold leading-tight text-lightWhite lg:mt-2 lg:text-4xl">
                {t('WALLET_PANEL.TITLE')}
              </h3>
              <button
                className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none"
                onClick={modalClickHandler}
              >
                <span className="absolute top-5 right-5 block outline-none focus:outline-none">
                  <ImCross />
                </span>
              </button>
            </div>
            <div className="relative mx-50px flex-auto pt-1 md:px-4 md:pb-4">
              <div className="my-4 text-lg leading-relaxed text-white">
                {/* {walletOptionsSection} */}
                {searchingSection}
              </div>
            </div>

            <div className="flex items-center justify-end rounded-b p-2"></div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-30 bg-black opacity-25"></div>
    </>
  );

  const isDisplayedSearchingModal = modalVisible ? searchingModal : null;

  return <div>{isDisplayedSearchingModal}</div>;
};

export default SearchingModal;

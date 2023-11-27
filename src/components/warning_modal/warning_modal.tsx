import React from 'react';
import Link from 'next/link';
import RippleButton from '../ripple_button/ripple_button';
import {IWarningModal} from '../../contexts/global_context';
import {MODAL_BUTTON_STYLE} from '../../constants/display';
import {ImWarning} from 'react-icons/im';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;
interface IWarningModalProps {
  modalVisible: boolean;
  modalClickHandler: () => void;
  getWarningData: IWarningModal;
}

const WarningModal = ({modalVisible, modalClickHandler, getWarningData}: IWarningModalProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const {title, content, numberOfButton, pathOfButton, reactionOfButton} = getWarningData;

  const path = pathOfButton ?? '/';
  const btnPath = path.startsWith('/') || path.startsWith('http') ? path : '/';

  const displayedButton =
    numberOfButton === 2 ? (
      <div className="flex w-full flex-row items-center justify-between whitespace-nowrap px-7">
        <Link href={btnPath}>
          <RippleButton
            id="warning-modal-reaction-button"
            buttonType="button"
            onClick={modalClickHandler}
            className={`${MODAL_BUTTON_STYLE.SOLID} w-150px py-2`}
          >
            {reactionOfButton}
          </RippleButton>
        </Link>

        <RippleButton
          id="warning-modal-ok-button"
          buttonType="button"
          onClick={modalClickHandler}
          className={`${MODAL_BUTTON_STYLE.HOLLOW} w-70px py-2`}
        >
          {t('POSITION_MODAL.WARNING_OK_BUTTON')}
        </RippleButton>
      </div>
    ) : numberOfButton === 1 ? (
      pathOfButton ? (
        <div className="flex flex-row items-center justify-center px-7">
          <Link href={btnPath}>
            <RippleButton
              id="warning-modal-reaction-button"
              buttonType="button"
              onClick={modalClickHandler}
              className={`${MODAL_BUTTON_STYLE.SOLID} px-6 py-2`}
            >
              {reactionOfButton}
            </RippleButton>
          </Link>
        </div>
      ) : (
        <div className="flex flex-row items-center justify-center px-7">
          <RippleButton
            id="warning-modal-reaction-button"
            buttonType="button"
            onClick={modalClickHandler}
            className={`${MODAL_BUTTON_STYLE.SOLID} px-6 py-2`}
          >
            {reactionOfButton}
          </RippleButton>
        </div>
      )
    ) : null;

  const isDisplayedModal = modalVisible ? (
    <>
      <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative mx-auto my-6 w-auto max-w-xl">
          <div
            id="depositHistoryModal"
            className="relative flex h-auto w-300px flex-col space-y-4 rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none"
          >
            {/* Info:(20230418 - Julian) Header/Title */}
            <div className="flex items-center justify-between rounded-t pt-9">
              <h3 className="mt-2 w-full text-center text-xl font-normal text-lightWhite">
                {title}
              </h3>
            </div>

            {/* Info:(20230418 - Julian) Content */}
            <div className="flex flex-col items-center px-3">
              <ImWarning className="h-38px w-40px text-lightYellow2" />
              <p className="p-4 text-left text-sm text-lightGray">{content}</p>
            </div>

            {/* Info:(20230418 - Julian) Buttons */}
            {displayedButton}

            {/* Info:(20230418 - Julian) Footer */}
            <div className="flex items-center justify-end rounded-b p-1"></div>
          </div>
        </div>
      </div>
    </>
  ) : null;

  return <>{isDisplayedModal}</>;
};

export default WarningModal;

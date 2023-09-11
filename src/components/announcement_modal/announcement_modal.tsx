import React, {useState, useContext} from 'react';
import RippleButton from '../ripple_button/ripple_button';
import {IAnnouncementModal} from '../../contexts/global_context';
import {NotificationContext} from '../../contexts/notification_context';
import {ImCross} from 'react-icons/im';
import {MessageType} from '../../constants/message_type';
import {useTranslation} from 'next-i18next';

type TranslateFunction = (s: string) => string;

interface IAnnouncementModalProps {
  modalVisible: boolean;
  modalClickHandler: () => void;
  announcementData: IAnnouncementModal;
}

const AnnouncementModal = ({
  modalVisible,
  modalClickHandler,
  announcementData,
}: IAnnouncementModalProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const notificationCtx = useContext(NotificationContext);

  const [isChecked, setIsChecked] = useState(false);

  const checkmark =
    'before:hidden before:h-3 before:w-2 before:rotate-45 before:rounded-sm before:border-b-3px before:border-r-3px before:border-lightWhite before:absolute before:top-3px before:left-5px';

  const checkHandler = () => {
    setIsChecked(!isChecked);
  };

  /* Info:(20230522 - Julian)
   * notification -> 在 NotificationItem 裡設定
   * announcement -> 判斷 Don't show again box 是否被勾選，然後在 ok button 被點擊時設定 isRead */
  const okButtonClickHandler = () => {
    modalClickHandler();
    if (isChecked) {
      notificationCtx.isRead(announcementData.id);
    }
  };

  const isDisplayedCheckBox =
    announcementData.messageType === MessageType.ANNOUNCEMENT ? (
      <div className="flex items-center justify-end px-8">
        <input
          id="dontShowAgainCheckbox"
          type="checkbox"
          checked={isChecked}
          onChange={checkHandler}
          className={`relative h-5 w-5 appearance-none rounded-sm border-transparent ${checkmark} bg-darkGray2 transition-all duration-150 ease-in-out checked:bg-tidebitTheme checked:before:block hover:cursor-pointer`}
        />
        <label
          htmlFor="dontShowAgainCheckbox"
          className="ml-2 text-base text-lightWhite hover:cursor-pointer"
        >
          {t('ANNOUNCEMENT_MODAL.CHECKBOX_DESCRIPTION')}
        </label>
      </div>
    ) : null;

  const isDisplayedModal = modalVisible ? (
    <>
      <div className="fixed inset-0 z-80 flex items-center justify-center overflow-x-hidden overflow-y-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative mx-auto my-6">
          <div
            id="AnnouncementModal"
            className="relative flex h-auto max-h-600px w-screen flex-col space-y-4 rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none md:w-700px md:space-y-8"
          >
            {/* Info:(20230519 - Julian) Header/Title */}
            <div className="flex items-center justify-between rounded-t pt-9">
              <h3 className="w-full text-center text-xl font-normal text-lightWhite md:text-3xl">
                {t(announcementData.title)}
              </h3>
              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute right-5 top-5 block outline-none focus:outline-none">
                  <ImCross onClick={modalClickHandler} />
                </span>
              </button>
            </div>

            {/* Info:(20230519 - Julian) Content */}
            <div className="flex flex-col items-center overflow-y-hidden px-8">
              <div className="w-full overflow-y-auto whitespace-pre-line bg-darkGray8 px-4 py-3 text-sm text-lightWhite md:py-6 md:text-base">
                {t(announcementData.content)}
              </div>
            </div>

            {/* Info:(20230519 - Julian) Don't show again box */}
            {isDisplayedCheckBox}

            {/* Info:(20230519 - Julian) Button */}
            <div className="flex w-full items-center justify-center">
              <RippleButton
                buttonType="button"
                onClick={okButtonClickHandler}
                className="whitespace-nowrap rounded border-0 bg-tidebitTheme px-10 py-2 text-base text-white transition-colors duration-300 hover:bg-cyan-600 focus:outline-none disabled:bg-lightGray"
              >
                {t('ANNOUNCEMENT_MODAL.OK_BUTTON')}
              </RippleButton>
            </div>

            {/* Info:(20230519 - Julian) Footer */}
            <div className="flex items-center justify-end rounded-b p-1"></div>
          </div>
        </div>
      </div>
    </>
  ) : null;

  return <>{isDisplayedModal}</>;
};

export default AnnouncementModal;

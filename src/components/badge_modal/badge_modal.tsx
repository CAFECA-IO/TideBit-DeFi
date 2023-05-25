import React, {useContext} from 'react';
import Image from 'next/image';
import RippleButton from '../ripple_button/ripple_button';
import {UserContext} from '../../contexts/user_context';
import {IBadgeModal} from '../../contexts/global_context';
import {ImCross} from 'react-icons/im';
import {BsFacebook, BsTwitter, BsReddit} from 'react-icons/bs';
import {useTranslation} from 'react-i18next';
import useShareProcess from '../../lib/hooks/use_share_process';
import {ShareType} from '../../constants/share_type';

type TranslateFunction = (s: string) => string;

interface IBadgeModalProps {
  modalVisible: boolean;
  modalClickHandler: () => void;
  badgeData: IBadgeModal;
}

const BadgeModal = ({modalVisible, modalClickHandler, badgeData}: IBadgeModalProps) => {
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const userCtx = useContext(UserContext);

  const {shareTo} = useShareProcess({
    lockerName: 'badge_modal.shareHandler',
    shareType: ShareType.BADGE,
    shareId: badgeData.badgeId,
    enableShare: userCtx.enableShare, // ToDo: (20230525 - Julian) userCtx.enableShare 需補上 badge data
  });

  // ToDo: (20230517 - Julian) Sharing function
  const socialMediaList = (
    <div
      className={`inline-flex space-x-4 text-3xl text-lightWhite transition-all duration-300 hover:cursor-pointer`}
    >
      <button
        onClick={() =>
          shareTo({
            url: 'https://www.facebook.com/sharer/sharer.php?u=',
            type: 'facebook-share-dialog',
            size: 'width=800,height=600',
          })
        }
      >
        <BsFacebook className="hover:text-lightGray2" />
      </button>
      <button>
        <BsTwitter className="hover:text-lightGray2" />
      </button>
      <button>
        <BsReddit className="hover:text-lightGray2" />
      </button>
    </div>
  );

  const isDisplayedModal = modalVisible ? (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none backdrop-blur-sm focus:outline-none">
        <div className="relative mx-auto my-6">
          <div
            id="BadgeModal"
            className="relative flex h-auto w-screen flex-col space-y-4 rounded-xl border-0 bg-darkGray1 shadow-lg shadow-black/80 outline-none focus:outline-none sm:w-450px"
          >
            {/* Info:(20230517 - Julian) Header/Title */}
            <div className="flex items-center justify-between rounded-t pt-9">
              <h3 className="w-full text-center text-3xl font-normal text-lightWhite">
                {t(badgeData.title)}
              </h3>
              <button className="float-right ml-auto border-0 bg-transparent p-1 text-base font-semibold leading-none text-gray-300 outline-none focus:outline-none">
                <span className="absolute right-5 top-5 block outline-none focus:outline-none">
                  <ImCross onClick={modalClickHandler} />
                </span>
              </button>
            </div>

            {/* Info:(20230517 - Julian) Content */}
            <div className="flex flex-col items-center px-3">
              <div className="p-4">
                <Image src={badgeData.image} width={180} height={180} alt="badge_image" />
              </div>
              <div className="py-3 text-base">
                {t('LEADERBOARD_PAGE.CONGRATULATION_DESCRIPTION')}
              </div>
              <div className="inline-flex items-center p-3">
                <span className="mr-2 text-sm text-lightGray4">
                  {t('LEADERBOARD_PAGE.SHARE')}:{' '}
                </span>
                {socialMediaList}
              </div>
            </div>

            {/* Info:(20230517 - Julian) Button */}
            <div className="flex w-full items-center justify-center">
              <RippleButton
                buttonType="button"
                onClick={modalClickHandler}
                className="w-300px whitespace-nowrap rounded border-0 bg-tidebitTheme px-6 py-2 text-base text-white transition-colors duration-300 hover:bg-cyan-600 focus:outline-none disabled:bg-lightGray"
              >
                {t('LEADERBOARD_PAGE.CLOSE_BUTTON')}
              </RippleButton>
            </div>

            {/* Info:(20230517 - Julian) Footer */}
            <div className="flex items-center justify-end rounded-b p-1"></div>
          </div>
        </div>
      </div>
    </>
  ) : null;

  return <>{isDisplayedModal}</>;
};

export default BadgeModal;

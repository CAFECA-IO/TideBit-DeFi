import React, {useContext} from 'react';
import {findCodeByReason, locker} from '../common';
import {useTranslation} from 'react-i18next';
import {TranslateFunction} from '../../interfaces/tidebit_defi_background/locale';
import {useGlobal} from '../../contexts/global_context';
import {UserContext} from '../../contexts/user_context';
import {DOMAIN} from '../../constants/config';
import {Code} from '../../constants/code';
import {IResult} from '../../interfaces/tidebit_defi_background/result';
import {CustomError} from '../custom_error';
import {IShareType, ShareType} from '../../constants/share_type';

interface IShareToSocialMedia {
  url: string;
  text?: string;
  type: string;
  size: string;
}

/**
 * @param lockerName: unique name, string `'filename_functionname'` `e.g.'history_position_modal.shareHandler'`
 */
interface IUseShareProcess {
  lockerName: string;
  shareType: IShareType;
  shareId: string;
  enableShare: (id: string, share: boolean) => Promise<IResult>;
}

const useShareProcess = ({lockerName, shareType, shareId, enableShare}: IUseShareProcess) => {
  const globalCtx = useGlobal();
  const userCtx = useContext(UserContext);
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const getPageUrl = (): string => {
    let shareUrl = '';

    switch (shareType) {
      case ShareType.CFD:
        shareUrl = DOMAIN + `/share/cfd/${shareId}`;
        return shareUrl;

      case ShareType.RANK:
        // TODO: Share rank (20230524 - Shirley)
        shareUrl = '';
        return shareUrl;

      case ShareType.BADGE:
        // TODO: Share badge (20230524 - Shirley)
        shareUrl = '';
        return shareUrl;

      default:
        // Info: Nothing happens (20230524 - Shirley)
        return '';
    }
  };

  const shareTo = async ({url, text, type, size}: IShareToSocialMedia) => {
    const [lock, unlock] = locker(lockerName);
    if (!lock()) return;

    try {
      const shareUrl = getPageUrl();
      // Info: this error will make try-again button lose its functionality (20230524 - Shirley)
      if (shareUrl === '') throw new CustomError(Code.NEED_SHARE_URL);

      globalCtx.dataLoadingModalHandler({
        modalTitle: t('POSITION_MODAL.SHARING'),
        modalContent: t('POSITION_MODAL.SHARING_LOADING'),
        isShowZoomOutBtn: false,
      });
      globalCtx.visibleLoadingModalHandler();

      const result = await enableShare(shareId, true);

      // Deprecated: after demo (20230524 - Shirley)
      // eslint-disable-next-line no-console
      console.log(`enableShare result in useShareProcess hook: `, result);

      if (result.success) {
        window.open(
          `${url}${encodeURIComponent(shareUrl)}${text ? `${text}` : ''}`,
          `${type}`,
          `${size}`
        );

        globalCtx.eliminateAllProcessModals();
      } else if (
        result.code === Code.INTERNAL_SERVER_ERROR ||
        result.code === Code.UNKNOWN_ERROR ||
        result.code === Code.WALLET_IS_NOT_CONNECT
      ) {
        globalCtx.eliminateAllProcessModals();

        globalCtx.dataFailedModalHandler({
          modalTitle: t('POSITION_MODAL.SHARING'),
          modalContent: `${t('POSITION_MODAL.ERROR_MESSAGE')} (${result.code})`,
          // TODO: style of failed modal (20230524 - Shirley)
          // failedTitle: 'Failed to share',
          // failedMsg: 'Please try again later',
          btnMsg: t('POSITION_MODAL.FAILED_BUTTON_TRY_AGAIN'),
          btnFunction: () => {
            shareTo({url, text, type, size});
          },
        });

        globalCtx.visibleFailedModalHandler();
      }
    } catch (e: any) {
      if (e instanceof CustomError) {
        const str = e.toString().split('Error: ')[1];
        const errorCode = findCodeByReason(str);

        globalCtx.dataFailedModalHandler({
          modalTitle: t('POSITION_MODAL.SHARING'),
          modalContent: `${t('POSITION_MODAL.ERROR_MESSAGE')} (${errorCode})`,
          btnMsg: t('POSITION_MODAL.FAILED_BUTTON_TRY_AGAIN'),
          btnFunction: () => {
            shareTo({url, text, type, size});
          },
        });

        globalCtx.visibleFailedModalHandler();
      } else {
        globalCtx.dataFailedModalHandler({
          modalTitle: t('POSITION_MODAL.SHARING'),
          modalContent: `${t('POSITION_MODAL.ERROR_MESSAGE')} (${Code.UNKNOWN_ERROR_IN_COMPONENT})`,
          btnMsg: t('POSITION_MODAL.FAILED_BUTTON_TRY_AGAIN'),
          btnFunction: () => {
            shareTo({url, text, type, size});
          },
        });

        globalCtx.visibleFailedModalHandler();
      }
    } finally {
      unlock();
    }
  };

  return {shareTo};
};

export default useShareProcess;

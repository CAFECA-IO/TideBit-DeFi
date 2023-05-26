import React, {useContext} from 'react';
import {findCodeByReason, locker} from '../common';
import {useTranslation} from 'react-i18next';
import {TranslateFunction} from '../../interfaces/tidebit_defi_background/locale';
import {useGlobal} from '../../contexts/global_context';
import {UserContext} from '../../contexts/user_context';
import {API_URL, DOMAIN} from '../../constants/config';
import {Code} from '../../constants/code';
import {IResult} from '../../interfaces/tidebit_defi_background/result';
import {CustomError} from '../custom_error';
import {IShareType, ShareType} from '../../constants/share_type';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {ISharingOrder} from '../../interfaces/tidebit_defi_background/sharing_order';
import {IShareToSocialMedia} from '../../constants/social_media';

interface IUseShareProcess {
  lockerName: string;
  shareType: IShareType;
  shareId: string;
  cfd?: IDisplayCFDOrder;
  enableShare?: (id: string, share: boolean) => Promise<IResult>;
}

/**
 * @param lockerName: unique name `'filename_functionname'` `e.g.'history_position_modal.shareHandler'`
 * @param cfd: for checking if the order from API is consistent with the order in the page
 */
const useShareProcess = ({lockerName, shareType, shareId, cfd, enableShare}: IUseShareProcess) => {
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
        shareUrl = DOMAIN + `/share/badge/${shareId}`;
        return shareUrl;

      default:
        // Info: Nothing happens (20230524 - Shirley)
        return '';
    }
  };

  const getCFDOrder = async (): Promise<ISharingOrder | undefined> => {
    const apiUrl = `${API_URL}/public/shared/cfd/${shareId}`;
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      const order = data?.data;
      return order as ISharingOrder;
    } catch (e) {
      globalCtx.dataFailedModalHandler({
        modalTitle: t('POSITION_MODAL.SHARING'),
        failedTitle: t('POSITION_MODAL.FAILED_TITLE'),
        failedMsg: `${t('POSITION_MODAL.SHARING_FAILED_CONTENT')} (${
          Code.CANNOT_FETCH_CFD_SHARE_ORDER
        })`,
      });

      globalCtx.visibleFailedModalHandler();
    }
  };

  const compareOrder = (order: ISharingOrder) => {
    if (order?.id === cfd?.id) return true;
    return false;
  };

  const shareTo = async ({
    url,
    text,
    type,
    size,
  }: {
    url: string;
    text?: string;
    type: string;
    size: string;
  }) => {
    const [lock, unlock] = locker(lockerName);
    if (!lock()) return;

    try {
      const shareUrl = getPageUrl();
      if (shareUrl === '') throw new CustomError(Code.NEED_SHARE_URL);

      switch (shareType) {
        case ShareType.CFD:
          if (!!!cfd) throw new CustomError(Code.NEED_CFD_ORDER);
          if (enableShare === undefined) throw new CustomError(Code.NEED_ENABLE_SHARE_FUNCTION);

          globalCtx.dataLoadingModalHandler({
            modalTitle: t('POSITION_MODAL.SHARING'),
            modalContent: t('POSITION_MODAL.SHARING_LOADING'),
            isShowZoomOutBtn: false,
          });
          globalCtx.visibleLoadingModalHandler();

          const result = await enableShare(shareId, true);

          if (result.success) {
            const order = await getCFDOrder();
            if (!order) throw new CustomError(Code.CANNOT_FETCH_CFD_SHARE_ORDER);

            const isOrderMatched = compareOrder(order);
            if (!isOrderMatched) throw new CustomError(Code.CFD_ORDER_NOT_MATCH);

            window.open(
              `${url}${encodeURIComponent(shareUrl)}${text ? `${text}` : ''}`,
              `${type}`,
              `${size}`
            );

            globalCtx.eliminateAllProcessModals();
          } else {
            globalCtx.eliminateAllProcessModals();

            globalCtx.dataFailedModalHandler({
              modalTitle: t('POSITION_MODAL.SHARING'),
              failedTitle: t('POSITION_MODAL.FAILED_TITLE'),
              failedMsg: `${t('POSITION_MODAL.SHARING_FAILED_CONTENT')} (${result.code})`,
              btnMsg: t('POSITION_MODAL.FAILED_BUTTON_TRY_AGAIN'),
              btnFunction: () => {
                shareTo({url, text, type, size});
              },
            });

            globalCtx.visibleFailedModalHandler();
          }
          break;
        case ShareType.RANK:
          break;

        case ShareType.BADGE:
          window.open(
            `${url}${encodeURIComponent(shareUrl)}${text ? `${text}` : ''}`,
            `${type}`,
            `${size}`
          );
          break;

        default:
          break;
      }
    } catch (e: any) {
      if (e instanceof CustomError) {
        const str = e.toString().split('Error: ')[1];
        const errorCode = findCodeByReason(str);

        globalCtx.dataFailedModalHandler({
          modalTitle: t('POSITION_MODAL.SHARING'),
          failedTitle: t('POSITION_MODAL.FAILED_TITLE'),
          failedMsg: `${t('POSITION_MODAL.SHARING_FAILED_CONTENT')} (${errorCode})`,
        });

        globalCtx.visibleFailedModalHandler();
      } else {
        globalCtx.dataFailedModalHandler({
          modalTitle: t('POSITION_MODAL.SHARING'),
          failedTitle: t('POSITION_MODAL.FAILED_TITLE'),
          failedMsg: `${t('POSITION_MODAL.SHARING_FAILED_CONTENT')} (${
            Code.UNKNOWN_ERROR_IN_COMPONENT
          })`,
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

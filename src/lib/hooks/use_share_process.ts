import {findCodeByReason, locker} from '../common';
import {useTranslation} from 'react-i18next';
import {TranslateFunction} from '../../interfaces/tidebit_defi_background/locale';
import {useGlobal} from '../../contexts/global_context';
import {API_URL, DOMAIN} from '../../constants/config';
import {Code} from '../../constants/code';
import {IResult} from '../../interfaces/tidebit_defi_background/result';
import {CustomError, isCustomError} from '../custom_error';
import {IShareType, ShareType} from '../../constants/share_type';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {ISharingOrder} from '../../interfaces/tidebit_defi_background/sharing_order';
import {MOBILE_WIDTH} from '../../constants/display';

interface IUseShareProcess {
  lockerName: string;
  shareType: IShareType;
  shareId: string;
  cfd?: IDisplayCFDOrder;
  enableShare?: (id: string, share: boolean) => Promise<IResult>;
}

interface IShareToSocialMedia {
  url: string;
  appUrl: string;
  text?: string;
  type: string;
  size: string;
}

/**
 * @param lockerName: unique name `'filename_functionname'` `e.g.'history_position_modal.shareHandler'`
 * @param cfd: for checking if the order from API is consistent with the order in the page
 */
const useShareProcess = ({lockerName, shareType, shareId, cfd, enableShare}: IUseShareProcess) => {
  const globalCtx = useGlobal();
  const {t}: {t: TranslateFunction} = useTranslation('common');

  const getPageUrl = (): string => {
    let shareUrl = '';

    switch (shareType) {
      case ShareType.CFD:
        shareUrl = DOMAIN + `/share/cfd/${shareId}`;
        return shareUrl;

      case ShareType.RANK:
        // TODO: Share rank (20230524 - Shirley)
        // TODO: Test (20230531 - Shirley)
        shareUrl = `https://www.tidebit-defi.com/share/cfd/0x07d793fa5860c9435583c6dbf07b00a6`;
        return shareUrl;

      case ShareType.BADGE:
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

  const shareOn = ({url, appUrl, text, type, size}: IShareToSocialMedia) => {
    const shareUrl = getPageUrl();
    if (shareUrl === '') throw new CustomError(Code.NEED_SHARE_URL);

    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      // TODO: Share to FB on mobile (20230531 - Shirley)
      // if (url.includes('facebook')) {
      // }
      const appShareUrl = `${appUrl}${encodeURIComponent(shareUrl)}`;
      window.location.href = appShareUrl;
    } else {
      window.open(
        `${url}${encodeURIComponent(shareUrl)}${text ? `${text}` : ''}`,
        `${type}`,
        `${size}`
      );
    }
  };

  const shareTo = async ({url, appUrl, text, type, size}: IShareToSocialMedia) => {
    const [lock, unlock] = locker(lockerName);
    if (!lock()) return;

    try {
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

            shareOn({url, appUrl, text, type, size});

            globalCtx.eliminateAllProcessModals();
          } else {
            globalCtx.eliminateAllProcessModals();

            globalCtx.dataFailedModalHandler({
              modalTitle: t('POSITION_MODAL.SHARING'),
              failedTitle: t('POSITION_MODAL.FAILED_TITLE'),
              failedMsg: `${t('POSITION_MODAL.SHARING_FAILED_CONTENT')} (${result.code})`,
              btnMsg: t('POSITION_MODAL.FAILED_BUTTON_TRY_AGAIN'),
              btnFunction: () => {
                shareTo({url, appUrl, text, type, size});
              },
            });

            globalCtx.visibleFailedModalHandler();
          }
          break;
        case ShareType.RANK:
          shareOn({url, appUrl, text, type, size});
          break;

        case ShareType.BADGE:
          shareOn({url, appUrl, text, type, size});
          break;

        default:
          break;
      }
    } catch (e: any) {
      if (isCustomError(e)) {
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
            shareTo({url, appUrl, text, type, size});
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

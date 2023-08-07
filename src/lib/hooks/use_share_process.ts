import {findCodeByReason, locker} from '../common';
import {useTranslation} from 'react-i18next';
import {TranslateFunction} from '../../interfaces/tidebit_defi_background/locale';
import {useGlobal} from '../../contexts/global_context';
import {API_URL, SHARE_DOMAIN} from '../../constants/config';
import {Code} from '../../constants/code';
import {IResult} from '../../interfaces/tidebit_defi_background/result';
import {CustomError, isCustomError} from '../custom_error';
import {IShareType, ShareType} from '../../constants/share_type';
import {IDisplayCFDOrder} from '../../interfaces/tidebit_defi_background/display_accepted_cfd_order';
import {ISharingOrder} from '../../interfaces/tidebit_defi_background/sharing_order';
import {MOBILE_WIDTH} from '../../constants/display';
import {ISocialMedia, ShareSettings, SocialMediaConstant} from '../../constants/social_media';
import {useRouter} from 'next/router';

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

interface IShare {
  socialMedia: ISocialMedia;
  text?: string;
  size?: string;
}

/**
 * @param lockerName: unique name `'file_name.function_name'` `e.g.'history_position_modal.shareHandler'`
 * @param cfd: for checking if the order from API is consistent with the order in the page
 */
const useShareProcess = ({lockerName, shareType, shareId, cfd, enableShare}: IUseShareProcess) => {
  const globalCtx = useGlobal();
  const {t}: {t: TranslateFunction} = useTranslation('common');
  const route = useRouter();

  const getPageUrl = (): string => {
    let shareUrl = '';

    switch (shareType) {
      case ShareType.CFD:
        shareUrl = SHARE_DOMAIN + `/share/cfd/${shareId}`;
        return shareUrl;

      case ShareType.RANK:
        // TODO: Share rank (20230524 - Shirley)
        shareUrl = ``;
        return shareUrl;

      case ShareType.BADGE:
        shareUrl = SHARE_DOMAIN + `/share/badge/${shareId}`;
        return shareUrl;

      case ShareType.ARTICLE:
        shareUrl = SHARE_DOMAIN + `/news/${shareId}`;
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

  const share = async ({socialMedia, text, size}: IShare) => {
    switch (socialMedia) {
      case SocialMediaConstant.FACEBOOK:
        await shareTo({
          url: ShareSettings.FACEBOOK.URL,
          appUrl: ShareSettings.FACEBOOK.APP_URL,
          type: ShareSettings.FACEBOOK.TYPE,
          text,
          size: size ? size : ShareSettings.FACEBOOK.SIZE,
        });
        break;

      case SocialMediaConstant.TWITTER:
        await shareTo({
          url: ShareSettings.TWITTER.URL,
          appUrl: ShareSettings.TWITTER.APP_URL,
          type: ShareSettings.TWITTER.TYPE,
          text,
          size: size ? size : ShareSettings.TWITTER.SIZE,
        });
        break;

      case SocialMediaConstant.REDDIT:
        await shareTo({
          url: ShareSettings.REDDIT.URL,
          appUrl: ShareSettings.REDDIT.APP_URL,
          type: ShareSettings.REDDIT.TYPE,
          text,
          size: size ? size : ShareSettings.REDDIT.SIZE,
        });
        break;
    }
  };

  const shareTo = async ({url, appUrl, type, text, size}: IShareToSocialMedia) => {
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

            // eslint-disable-next-line no-console
            console.log('order', order);

            const isOrderMatched = compareOrder(order);
            if (!isOrderMatched) throw new CustomError(Code.CFD_ORDER_NOT_MATCH);

            // eslint-disable-next-line no-console
            console.log('isOrderMatched', isOrderMatched);

            // use fetch to access our image api
            const res = await fetch(`${SHARE_DOMAIN}/api/images/cfd/${shareId}?tz=0`);
            // eslint-disable-next-line no-console
            console.log('res (tz=0 img)', res);

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

        case ShareType.ARTICLE:
          shareOn({url, appUrl, text, type, size});
          break;

        default:
          break;
      }
    } catch (e: any) {
      globalCtx.eliminateAllProcessModals();

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
      // window.location.replace(`${shareUrl}`);

      // route.push(`${shareUrl}`);
      // const openIt = window.open(`${shareUrl}`, '_blank');
      // console.log('window open', openIt);

      const encodedShareUrl = `${url}${encodeURIComponent(shareUrl)}${text ? `${text}` : ''}`;
      // Deprecated: (20230807 - Shirley)
      // eslint-disable-next-line no-console
      console.log('encodedShareUrl', encodedShareUrl);

      const openFirstURL = () => {
        const openIt = window.open(`${shareUrl}`, '_blank');
        // Deprecated: (20230807 - Shirley)
        // eslint-disable-next-line no-console
        console.log('openFirstURL after opening itself', openIt);

        if (openIt) {
          openIt.onload = openSecondURL;
        }
      };

      const openSecondURL = () => {
        const encodedShareUrl = `${url}${encodeURIComponent(shareUrl)}${text ? `${text}` : ''}`;
        // Deprecated: (20230807 - Shirley)
        // eslint-disable-next-line no-console
        console.log('openSecondURL before opening itself', encodedShareUrl);

        window.open(`${encodedShareUrl}`, `${type}`, `${size}`);
        // Deprecated: (20230807 - Shirley)
        // eslint-disable-next-line no-console
        console.log('openSecondURL after opening itself', encodedShareUrl);
      };

      // Call the function to start the process
      openFirstURL();
    }
  };

  return {share};
};

export default useShareProcess;

export type SocialMedia = 'FACEBOOK' | 'TWITTER' | 'REDDIT';
export interface ISocialMediaConstant {
  FACEBOOK: SocialMedia;
  TWITTER: SocialMedia;
  REDDIT: SocialMedia;
}

export const SocialMediaConstant: ISocialMediaConstant = {
  FACEBOOK: 'FACEBOOK',
  TWITTER: 'TWITTER',
  REDDIT: 'REDDIT',
};

interface ISocialMediaSetting {
  URL: string;
  TEXT?: string;
  TYPE: string;
  SIZE: string;
  APP_URL: string;
}

export interface IShareSettings extends ISocialMediaSetting {
  ICON: string;
}

export const ShareSettings: Record<SocialMedia, IShareSettings> = {
  FACEBOOK: {
    URL: 'https://www.facebook.com/sharer/sharer.php?u=',
    // APP_URL: 'fb://facewebmodal/f?href=', // url: encodeURIComponent(shareUrl)
    APP_URL: 'fb://post?message=', // message: encodeURIComponent(shareUrl)
    TYPE: 'facebook-share-dialog',
    SIZE: 'width=800,height=600',
    ICON: '/elements/group_15237.svg',
  },
  TWITTER: {
    URL: 'https://twitter.com/intent/tweet?url=',
    APP_URL: 'twitter://post?message=', // message: encodeURIComponent(shareUrl)
    TEXT: '&text=Check%20this%20out!',
    TYPE: 'twitter-share-dialog',
    SIZE: 'width=800,height=600',
    ICON: '/elements/group_15235.svg',
  },
  REDDIT: {
    URL: 'https://www.reddit.com/submit?url=',
    APP_URL: 'reddit://submit?url=', // url: encodeURIComponent(shareUrl), title: text
    TEXT: '&title=Check%20this%20out!',
    TYPE: 'reddit-share-dialog',
    SIZE: 'width=800,height=600',
    ICON: '/elements/group_15234.svg',
  },
};

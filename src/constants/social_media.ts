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
    // TODO: Share to FB on mobile (20230531 - Shirley)
    APP_URL: 'fb://post?message=',
    TYPE: 'facebook-share-dialog',
    SIZE: 'width=800,height=600',
    ICON: '/elements/group_15237.svg',
  },
  TWITTER: {
    URL: 'https://twitter.com/intent/tweet?url=',
    APP_URL: 'twitter://post?message=',
    TEXT: '&text=Check%20this%20out!',
    TYPE: 'twitter-share-dialog',
    SIZE: 'width=800,height=600',
    ICON: '/elements/group_15235.svg',
  },
  REDDIT: {
    URL: 'https://www.reddit.com/submit?url=',
    // TODO: Share to FB on mobile (20230531 - Shirley)
    APP_URL: 'reddit://submit?url=',
    TEXT: '&title=Check%20this%20out!',
    TYPE: 'reddit-share-dialog',
    SIZE: 'width=800,height=600',
    ICON: '/elements/group_15234.svg',
  },
};

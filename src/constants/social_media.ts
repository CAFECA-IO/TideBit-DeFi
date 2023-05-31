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

export interface IShareToSocialMedia {
  URL: string;
  TEXT?: string;
  TYPE: string;
  SIZE: string;
}

export interface IShareSettings extends IShareToSocialMedia {
  ICON: string;
}

export const ShareSettings: Record<SocialMedia, IShareSettings> = {
  FACEBOOK: {
    URL: 'https://www.facebook.com/sharer/sharer.php?u=',
    TYPE: 'facebook-share-dialog',
    SIZE: 'width=800,height=600',
    ICON: '/elements/group_15237.svg',
  },
  TWITTER: {
    URL: 'https://twitter.com/intent/tweet?url=',
    TEXT: '&text=Check%20this%20out!',
    TYPE: 'twitter-share-dialog',
    SIZE: 'width=800,height=600',
    ICON: '/elements/group_15235.svg',
  },
  REDDIT: {
    URL: 'https://www.reddit.com/submit?url=',
    TEXT: '&title=Check%20this%20out!',
    TYPE: 'reddit-share-dialog',
    SIZE: 'width=800,height=600',
    ICON: '/elements/group_15234.svg',
  },
};

// MOBILE_URL: 'fb://facewebmodal/f?href='; // url: encodeURIComponent(shareUrl)
// MOBILE_URL: 'twitter://post?message='; // message: encodeURIComponent(shareUrl)
// MOBILE_URL: 'reddit://submit?url=&title='; // url: encodeURIComponent(shareUrl), title: text

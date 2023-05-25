export type SocialMedia = 'FaceBook' | 'Twitter' | 'Reddit';
export interface ISocialMediaConstant {
  FACEBOOK: SocialMedia;
  TWITTER: SocialMedia;
  REDDIT: SocialMedia;
}

export const SocialMediaConstant: ISocialMediaConstant = {
  FACEBOOK: 'FaceBook',
  TWITTER: 'Twitter',
  REDDIT: 'Reddit',
};

export interface IShareSettings {
  url: string;
  text?: string;
  type: string;
  size: string;
}

export const ShareSettings: Record<SocialMedia, IShareSettings> = {
  FaceBook: {
    url: 'https://www.facebook.com/sharer/sharer.php?u=',
    type: 'facebook-share-dialog',
    size: 'width=800,height=600',
  },
  Twitter: {
    url: 'https://twitter.com/intent/tweet?url=',
    text: '&text=Check%20this%20out!',
    type: 'twitter-share-dialog',
    size: 'width=800,height=600',
  },
  Reddit: {
    url: 'https://www.reddit.com/submit?url=',
    text: '&title=Check%20this%20out!',
    type: 'reddit-share-dialog',
    size: 'width=800,height=600',
  },
};

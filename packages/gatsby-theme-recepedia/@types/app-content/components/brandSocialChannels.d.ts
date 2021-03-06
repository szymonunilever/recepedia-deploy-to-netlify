declare namespace AppContent.BrandSocialChannels {
  interface Content extends BaseContent {
    socialItems: SocialsItems;
  }

  interface SocialsItems {
    facebook: SocialItem;
    instagram: SocialItem;
    twitter: SocialItem;
    pinterest: SocialItem;
    [key: string]: SocialItem;
  }

  interface SocialItem {
    url: string;
    label: string;
  }
}

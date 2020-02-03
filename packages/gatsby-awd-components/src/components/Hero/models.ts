import { UnileverLibraryComponent } from '../../models';
import { titleLevel } from '../../models';

export type HeroViewType = 'Text' | 'Image';

export interface HeroProps extends UnileverLibraryComponent<HeroContent> {
  viewType: string;
  titleLevel?: titleLevel;
  imageIsLink?: boolean;
  imageSizes?: string;
  brandTheme?: string;
  brandLink?: string;
}

export interface HeroContent extends AppContent.HeroContent {
  image?: Image;
}

export interface Image extends AppContent.ImageContent {
  localImage?: Internal.LocalImage;
}

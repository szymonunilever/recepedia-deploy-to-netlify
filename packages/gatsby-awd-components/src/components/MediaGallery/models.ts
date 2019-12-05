import {
  titleLevel,
  UnileverLibraryComponent,
} from '../../models/globalModels';

export interface MediaGalleryProps
  extends UnileverLibraryComponent<AppContent.MediaGalleryContent> {
  list: Internal.Article[];
  initialCount?: number;
  galleryItemsPerLoad?: number;
  titleLevel?: titleLevel;
  allCount: number;
  onLoadMore: (articlePerLoad: number) => void;
}
export interface MediaGalleryItemProps {
  title: Internal.Article['title'];
  fields: Internal.Article['fields'];
  localImage: Internal.LocalImage;
  assets: Internal.Article['assets'];
  className: string;
  brand?: string;
  brandTheme?: string;
}

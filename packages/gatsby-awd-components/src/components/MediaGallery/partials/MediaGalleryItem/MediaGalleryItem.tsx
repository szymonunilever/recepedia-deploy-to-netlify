import React, { useContext } from 'react';
import { Link } from 'gatsby';
import cx from 'classnames';
import AdaptiveImage from '../../../AdaptiveImage';
import { MediaGalleryItemProps } from './models';
import { AppContext } from '../../../../context/appContext';
import BrandLogo from '../../../BrandLogo';

const MediaGalleryItem = ({ title, localImage, fields, assets, className, brand, brandTheme }: MediaGalleryItemProps) => {
  //TODO switch back to normal state after localImage wil be fixed in articles
  const searchLink = useContext(AppContext).brandLogoLink;

  return (
    <li className={cx(className, brand, 'media-gallery__item')}>
      <Link to={fields.slug} className="media-gallery__item-link">
        <AdaptiveImage
          className="media-gallery__item-image"
          localImage={localImage}
          alt={title}
        />
        <div className="media-gallery__item-info">
          <div className="media-gallery__item-info-title">{title}</div>
          <BrandLogo brandTheme={brandTheme} linkTo={`${searchLink}?searchQuery=${brand}`} />
        </div>
      </Link>
    </li>
  );
};

export default MediaGalleryItem;

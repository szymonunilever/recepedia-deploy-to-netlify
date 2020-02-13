import React from 'react';
import { Link } from 'gatsby';
import { getImageAlt } from '../../../../utils';
import { PageProps } from './models';
import AdaptiveImage from '../../../AdaptiveImage';
import theme from './PageListingItem.module.scss';
import cx from 'classnames';

const PageListingItem = ({ page, imageSizes }: PageProps) => {
  const {
    title,
    path,
    image: { alt },
    localImage,
  } = page;

  const imgAlt = title ? getImageAlt(title, path) : 'image';

  return (
    <div className={cx(theme.pageListingItem, 'page-listing-item')}>
      <Link
        to={path}
        aria-label={title}
        className={cx(theme.pageListingItem__link, 'page-listing-item__link')}
      >
        <AdaptiveImage
          className={cx(
            theme.pageListingItem__image,
            'page-listing-item__image'
          )}
          localImage={localImage}
          alt={alt}
          sizes={imageSizes}
          title={imgAlt}
        />
        <div
          className={cx(
            theme.pageListingItem__title,
            'page-listing-item__title'
          )}
        >
          {title}
        </div>
      </Link>
    </div>
  );
};

export default PageListingItem;

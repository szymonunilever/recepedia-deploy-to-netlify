import React from 'react';
import { Link } from 'gatsby';

import { PageProps } from './models';
import AdaptiveImage from '../../../AdaptiveImage';

const PageListingItem = ({ page }: PageProps) => {
  const {
    title,
    path,
    image: { alt },
    localImage,
  } = page;

  return (
    <li className="page-listing-item">
      <Link to={path} className="page-listing-item__link">
        <AdaptiveImage
          className="page-listing-item__image"
          localImage={localImage}
          alt={alt}
        />
        <div className="page-listing-item__title">{title}</div>
      </Link>
    </li>
  );
};

export default PageListingItem;
import React from 'react';
import { Link } from 'gatsby';
import Img from 'gatsby-image';

import { PageProps } from '../models';

const PageListingItem = ({ page }: PageProps) => {
  const {
    title,
    path,
    image: { alt },
    localImage,
  } = page;

  return (
    <Link to={path} className={`page-listing__link`}>
      <Img className={`page-listing__image`} fluid={localImage} alt={alt} />
      <div className={`page-listing__title`}>{title}</div>
    </Link>
  );
};

export default PageListingItem;

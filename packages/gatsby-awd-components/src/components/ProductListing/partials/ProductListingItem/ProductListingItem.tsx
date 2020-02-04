import React, {useContext} from 'react';
import { Link } from 'gatsby';
import cx from 'classnames';
import AdaptiveImage from '../../../AdaptiveImage';
import { ProductListingItemProps } from './models';
import BrandLogo from '../../../BrandLogo';
import { AppContext } from '../../../../context/appContext';
import theme from './ProductListingItem.module.scss';

const ProductListingItem = ({
  title,
  localImage,
  fields,
  brand,
  brandTheme,
}: ProductListingItemProps) => {
  const searchLink = useContext(AppContext).brandLogoLink;

  return (
    <li className={cx(theme.productListing__item, brand, 'product-listing__item')}>
      <Link to={fields.slug} className={cx(theme.productListing__itemLink, 'product-listing__item-link')}>
        <AdaptiveImage
          className={cx(theme.productListing__itemImage, 'product-listing__item-image')}
          localImage={localImage}
          alt={title}
        />
        <div className={cx(theme.productListing__itemInfo, 'product-listing__item-info')}>
          <div className={cx(theme.productListing__itemInfoTitle, 'product-listing__item-info-title')}>{title}</div>
          <BrandLogo brandTheme={brandTheme} linkTo={`${searchLink}?searchQuery=${brand}`} />
        </div>
      </Link>
    </li>
  );
};

export default ProductListingItem;

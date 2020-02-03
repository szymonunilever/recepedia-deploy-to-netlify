import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { ProductListingProps } from './models';
import { TagName, Text } from '../Text';
import { Button } from '../Button';
import getComponentDataAttrs from '../../utils/getComponentDataAttrs';
import { AppContext } from '../../context/appContext';
import ProductListingItem from './partials/ProductListingItem';
import theme from './ProductListing.module.scss';

const ProductListing = ({
  list,
  content,
  className,
  galleryItemsPerLoad = 4,
  titleLevel = 2,
  onLoadMore,
  allCount,
  brandLogoLink = '',
}: ProductListingProps) => {
  const [products, setProducts] = useState<Internal.Product[]>(list);
  useEffect(() => {
    setProducts(list);
  }, [list]);

  const loadMore = () => {
    onLoadMore(galleryItemsPerLoad);
  };
  
  const loadMoreBtn =
    products.length < allCount ? (
      <div className={cx(theme.productListing__buttonWrap, 'product-listing__button-wrap')}>
        <Button onClick={loadMore} className={cx(theme.productListing__button, 'product-listing__button')}>
          {content.cta ? content.cta.label : null}
        </Button>
      </div>
    ) : null;

  return (
    <AppContext.Provider value={{ brandLogoLink }}>
      <div
        className={cx(theme.productListing, 'product-listing', className)}
        {...getComponentDataAttrs('product-listing', content)}
      >
        {content.title && (
          <Text
            className={cx(theme.productListing__title, 'product-listing__title')}
            // @ts-ignore
            tag={TagName[`h${titleLevel}`]}
            text={content.title}
          />
        )}

        <ul className={cx(theme.productListing__list, 'product-listing__list')}>
          {products.map((item: Internal.Product) => {
            return (
              <ProductListingItem
                key={item.productId}
                brand={item.brand}
                brandTheme={item.brandTheme}
                title={item.productName}
                localImage={item.images[0]}
                fields={item.fields}
              />
            );
          })}
        </ul>

        {loadMoreBtn}
      </div>
    </AppContext.Provider>
  );
};

export default ProductListing;

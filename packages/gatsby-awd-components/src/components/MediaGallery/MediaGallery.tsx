import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { MediaGalleryProps, MediaGalleryViewType } from './models';
import { TagName, Text } from '../Text';
import { Button } from '../Button';
import MediaGalleryItem from './partials/MediaGalleryItem';
import getComponentDataAttrs from '../../utils/getComponentDataAttrs';
import { AppContext } from '../../context/appContext';

const MediaGallery = ({
  list,
  content,
  className,
  galleryItemsPerLoad = 4,
  titleLevel = 2,
  onLoadMore,
  allCount,
  brandLogoLink = '',
  viewType = MediaGalleryViewType.FourRowed
}: MediaGalleryProps) => {
  const [articles, setArticles] = useState<Internal.Article[]>(list);

  useEffect(() => {
    setArticles(list);
  }, [list]);

  const loadMore = () => {
    onLoadMore(galleryItemsPerLoad);
  };

  const galleryViewType = viewType === MediaGalleryViewType.TwoRowed ? 'media-gallery__item--two-rows' : '';

  const loadMoreBtn =
    articles.length < allCount ? (
      <div className="media-gallery__button-wrap">
        <Button onClick={loadMore} className="media-gallery__button">
          {content.cta ? content.cta.label : null}
        </Button>
      </div>
    ) : null;

  return (
    <AppContext.Provider value={{ brandLogoLink }}>
      <div
        className={cx('media-gallery', className)}
        {...getComponentDataAttrs('media-gallery', content)}
      >
        {content.title && (
          <Text
            className="media-gallery__title"
            // @ts-ignore
            tag={TagName[`h${titleLevel}`]}
            text={content.title}
          />
        )}

        <ul className="media-gallery__list">
          {articles.map((item: Internal.Article) => {
            return (
              <MediaGalleryItem
                key={item.id}
                brand={item.brand}
                brandTheme={item.brandTheme}
                title={item.title}
                localImage={item.localImage}
                fields={item.fields}
                assets={item.assets}
                className={galleryViewType}
              />
            );
          })}
        </ul>

        {loadMoreBtn}
      </div>
    </AppContext.Provider>
  );
};

export default MediaGallery;

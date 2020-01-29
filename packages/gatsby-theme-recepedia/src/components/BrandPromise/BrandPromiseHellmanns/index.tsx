import React, { useState } from 'react';
import { findPageComponentContent } from 'src/utils';
import { Link } from 'gatsby';
import {
  mapArticlesListingContent,
  PromiseArticle,
} from '../mapArticlesListingContent';
import { IMAGE_SIZES } from 'src/constants';
import { Text, TagName } from 'gatsby-awd-components/src/components/Text';
import { Listing } from 'gatsby-awd-components/src/components/Listing';
import { AdaptiveImage } from 'gatsby-awd-components/src/components/AdaptiveImage';
import RichText from 'gatsby-awd-components/src/components/RichText';
import Button from 'gatsby-awd-components/src/components/Button';

const BrandPromiseHellmanns = ({
  components,
  brandArticles,
}: HellmannsPromiseProps) => {
  const standForCount = 4;
  const [upToCount, addUpToCount] = useState(2);

  const promiseArticleContent = findPageComponentContent(
    components,
    'PromiseArticle'
  );

  const standForArticles = brandArticles.filter(
    article => article.section === 'Nuestro compromiso es con'
  );
  const upToArticles = brandArticles.filter(
    article => article.section === 'Conoce más de nosotros'
  );

  const getArticleLinkType = (url: string, label: string) =>
    ~url.indexOf('http') ? (
      <a
        className="promise-article__cta"
        href={url}
        rel="noopener noreferrer nofollow"
        target="_blank"
      >
        {label}
      </a>
    ) : (
      <Link className="promise-article__cta" to={url}>
        {label}
      </Link>
    );

  const promiseArticleCta =
    promiseArticleContent.cta &&
    (promiseArticleContent.cta.linkTo ? (
      getArticleLinkType(
        promiseArticleContent.cta.linkTo,
        promiseArticleContent.cta.label
      )
    ) : (
      <Button className="promise-article__cta" onClick={() => {}}>
        {promiseArticleContent.cta.label}
      </Button>
    ));

  const discoverMoreContent = findPageComponentContent(
    components,
    'CTA',
    'discoverMore'
  );

  return (
    <>
      <section className="wrapper _pt--40 bg-secondary stand-for">
        <Listing
          content={findPageComponentContent(components, 'StandForListing')}
          className="stand-for-listing"
          titleLevel={2}
        >
          {mapArticlesListingContent({
            articles: standForArticles,
            countState: standForCount,
          })}
        </Listing>
      </section>

      <section className="wrapper promise-article _pt--40 _pb--40 bg-secondary">
        <Text
          tag={TagName.h2}
          text={promiseArticleContent.title}
          className="promise-article__title"
        />
        {promiseArticleContent.subtitle && (
          <Text
            tag={TagName.p}
            text={promiseArticleContent.subtitle}
            className="promise-article__subtitle"
          />
        )}
        {promiseArticleContent.description && (
          <Text
            tag={TagName.p}
            text={promiseArticleContent.description}
            className="promise-article__description"
          />
        )}
        {promiseArticleContent.blocks.map((block: any, index: any) => (
          <div className="promise-article__block" key={index}>
            {block.image && (
              <AdaptiveImage
                localImage={block.image.localImage}
                alt={block.image.alt}
                className="promise-article__block-image"
                sizes={IMAGE_SIZES.PROMISE_HELLMANNS}
              />
            )}
            <RichText
              content={block.richText}
              className="promise-article__block-text"
            />
          </div>
        ))}
        {promiseArticleCta}
      </section>

      <section className="wrapper _pt--40 _pb--40 bg-primary bg-primary--wave up-to">
        <Listing
          content={findPageComponentContent(components, 'UpToListing')}
          className="up-to-listing cards--light"
          titleLevel={2}
        >
          {mapArticlesListingContent({
            articles: upToArticles,
            countState: upToCount,
          })}
        </Listing>
        {upToArticles && upToCount < upToArticles.length && (
          <Button
            className="discover-more"
            content={discoverMoreContent}
            onClick={() => {
              addUpToCount(upToCount + 4);
            }}
          />
        )}
      </section>
    </>
  );
};

interface HellmannsPromiseProps {
  components: AppContent.Page.components;
  brandArticles: PromiseArticle[];
}

export default BrandPromiseHellmanns;

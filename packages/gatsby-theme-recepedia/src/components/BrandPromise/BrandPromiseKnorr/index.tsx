import React, { useState } from 'react';
import { findPageComponentContent } from 'src/utils';
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

const BrandPromiseKnorr = ({
  components,
  brandArticles,
}: BrandPromiseProps) => {
  const INITIAL_COUNT = 4;

  const forYouArticles = brandArticles.filter(
    article => article.section === 'Los 50 alimentos del Futuro'
  );
  const forPlanetArticles = brandArticles.filter(
    article =>
      article.section === 'El futuro del mundo está en nuestros platillos'
  );
  const futureFoodsArticles = brandArticles.filter(
    article => article.section === 'Los 50 alimentos del Futuro' // looks like duplicate of "forYouArticles" section
  );
  const localInitiativesArticles = brandArticles.filter(
    // article => article.section === 'Conoce más tips'
    article => article.section === 'Los 50 alimentos del Futuro'
  );

  const [forYouCount, addForYouCount] = useState(INITIAL_COUNT);
  const [forPlanetCount, addForPlanetCount] = useState(INITIAL_COUNT);
  const [futureFoodsCount, addFutureFoodsCount] = useState(INITIAL_COUNT);
  const localInitiativesCount = INITIAL_COUNT;

  const promiseArticleContent = findPageComponentContent(
    components,
    'PromiseArticle'
  );
  const aboutFutureContent = findPageComponentContent(
    components,
    'AboutFuture'
  );
  const localInitiativesContent = findPageComponentContent(
    components,
    'LocalInitiatives'
  );

  const listingCtaContent = findPageComponentContent(
    components,
    'CTA',
    'loadMore'
  );

  return (
    <>
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
        {promiseArticleContent.blocks.map((block: any, index: any) => (
          <div className="promise-article__block" key={index}>
            <RichText
              content={block.richText}
              className="promise-article__block-text"
            />
          </div>
        ))}
      </section>

      <section className="wrapper _pt--40 _pb--40 good-for bg-secondary">
        <Listing
          content={findPageComponentContent(components, 'GoodForYouListing')}
          className="good-for__listing"
          titleLevel={3}
        >
          {mapArticlesListingContent({
            articles: forYouArticles,
            countState: forYouCount,
          })}
        </Listing>
        {forYouArticles && forYouCount < forYouArticles.length && (
          <Button
            className="load-more"
            content={listingCtaContent}
            onClick={() => {
              addForYouCount(forYouCount + 4);
            }}
          />
        )}
      </section>
      <section className="wrapper _pt--40 _pb--40 good-for bg-secondary">
        <Listing
          content={findPageComponentContent(components, 'GoodForPlanetListing')}
          className="good-for__listing"
          titleLevel={3}
        >
          {mapArticlesListingContent({
            articles: forPlanetArticles,
            countState: forPlanetCount,
          })}
        </Listing>
        {forPlanetArticles && forPlanetCount < forPlanetArticles.length && (
          <Button
            className="load-more"
            content={listingCtaContent}
            onClick={() => {
              addForPlanetCount(forPlanetCount + 4);
            }}
          />
        )}
      </section>

      <section className="wrapper _pt--40 _pb--40 about-future bg-secondary">
        <Text
          tag={TagName.h2}
          text={aboutFutureContent.title}
          className="about-future__title"
        />
        <Text
          tag={TagName.p}
          text={aboutFutureContent.subtitle}
          className="about-future__subtitle"
        />
        <AdaptiveImage
          localImage={aboutFutureContent.image.localImage}
          alt={aboutFutureContent.image.alt}
          className="about-future__image"
          sizes={IMAGE_SIZES.CONTAINER_WIDTH}
        />
        <Listing content={[]} className="about-future__listing" titleLevel={3}>
          {mapArticlesListingContent({
            articles: futureFoodsArticles,
            countState: futureFoodsCount,
          })}
        </Listing>
        {futureFoodsArticles && futureFoodsCount < futureFoodsArticles.length && (
          <Button
            className="load-more"
            content={listingCtaContent}
            onClick={() => {
              addFutureFoodsCount(futureFoodsCount + 4);
            }}
          />
        )}
      </section>
      <section className="wrapper _pt--40 _pb--40 local-initiatives bg-secondary">
        <Text
          tag={TagName.h2}
          text={localInitiativesContent.title}
          className="local-initiatives__title"
        />
        <Text
          tag={TagName.p}
          text={localInitiativesContent.subtitle}
          className="local-initiatives__subtitle"
        />
        <Listing
          content={localInitiativesContent.listingTitle}
          className="local-initiatives__listing"
          titleLevel={3}
        >
          {mapArticlesListingContent({
            articles: localInitiativesArticles,
            countState: localInitiativesCount,
          })}
        </Listing>
      </section>
    </>
  );
};

interface BrandPromiseProps {
  components: AppContent.Page.components;
  brandArticles: PromiseArticle[];
}

export default BrandPromiseKnorr;

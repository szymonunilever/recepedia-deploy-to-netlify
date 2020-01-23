import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { WindowLocation } from '@reach/router';

import {
  SocialIcons,
  SocialSharing,
  SocialSharingViewType,
  ProductHero,
  ProductCopy,
  ProductCopyViewType,
  ProductNutrients,
  Button,
  CardLinkWrapper,
  ProductCardWrapper,
  RatingAndReviewsProvider,
  Card,
  Text,
  TagName,
  BrandSocialChannels,
  Hero,
  Listing,
  Reviews,
  RatingAndReviewsEntityType,
  Rating,
} from 'gatsby-awd-components/src';
import { findPageComponentContent, isBrowser } from 'src/utils';
import BrandHero from 'src/components/BrandHero';
import Layout from 'src/components/Layout/Layout';
import SEO from 'src/components/Seo';
import AddThis from '../../../integrations/AddThis';
import DigitalData from '../../../integrations/DigitalData';
import { IMAGE_SIZES } from 'src/constants';
import { graphql } from 'gatsby';
import { getSortedProducts } from '../../utils';
import { ReactComponent as KnorrLogoIcon } from '../../svgs/inline/logo-knorr.svg';
import { ReactComponent as HellmannsLogoIcon } from '../../svgs/inline/logo-hellmanns.svg';
import { ReactComponent as MaizenaLogoIcon } from '../../svgs/inline/logo-maizena.svg';
import { ReactComponent as InstagramIcon } from '../../svgs/inline/instagram.svg';
import { ReactComponent as CloseIcon } from 'gatsby-awd-components/src/svgs/inline/x-mark.svg';
import { ReactComponent as CartIcon } from 'gatsby-awd-components/src/svgs/inline/cart.svg';
import { ReactComponent as FacebookIcon } from '../../svgs/inline/facebook.svg';
import { ReactComponent as TwitterIcon } from '../../svgs/inline/twitter.svg';
import { ReactComponent as YoutubeIcon } from '../../svgs/inline/youtube-simple.svg';
import { ReactComponent as PinterestIcon } from '../../svgs/inline/pinterest.svg';
import { ReactComponent as WhatsappIcon } from '../../svgs/inline/whatsapp.svg';
import { ReactComponent as OpenModelButtonIcon } from '../../svgs/inline/social-sharing-circle.svg';
import theme from './BrandProductDetailsPage.module.scss';
import themeHellmanns from './BrandProductDetailsPageHellmanns.module.scss';
import themeKnorr from './BrandProductDetailsPageKnorr.module.scss';
import themeMaizena from './BrandProductDetailsPageMaizena.module.scss';
import '../../scss/pages/_brand.scss';

const BrandProductDetailsPage: React.FunctionComponent<
  BrandProductDetailsPageProps
> = ({ pageContext, location, data: { allProduct } }) => {
  const {
    page: { components, seo, type },
    product,
    brand,
    category,
  } = pageContext;
  const [showFullList, setShowFullList] = useState();
  const [counter, setCounter] = useState(0);
  const currentBrand = product.brand.toLowerCase();
  const localImage = product.images[0];
  const socialIcons: SocialIcons = {
    facebook: FacebookIcon,
    twitter: TwitterIcon,
    pinterest: PinterestIcon,
    whatsapp: WhatsappIcon,
  };
  const getBrandThemeContent = (brand: string | undefined) => {
    switch (brand) {
      case 'knorr':
        return {
          brandTheme: themeKnorr,
          brandLogo: KnorrLogoIcon,
        };
      case 'hellmanns':
        return {
          brandTheme: themeHellmanns,
          brandLogo: HellmannsLogoIcon,
        };
      case 'maizena':
        return {
          brandTheme: themeMaizena,
          brandLogo: MaizenaLogoIcon,
        };
      default:
        return false;
    }
  };
  // @ts-ignore
  const { brandTheme, brandLogo } = getBrandThemeContent(product.brand);
  const classWrapper = cx(
    theme.productPage,
    brandTheme && brandTheme.brandProductPage,
    'brand-page',
    'product-page',
    currentBrand
  );
  const createProductCards = (list: Internal.Product[]) =>
    list
      .filter(prod => prod.id !== product.id)
      .map(product => (
        <CardLinkWrapper
          key={product.fields.slug}
          title={product.productName}
          slug={product.fields.slug}
          cardKey={product.fields.slug}
        >
          <ProductCardWrapper
            key={product.fields.slug}
            ratingProvider={RatingAndReviewsProvider.none}
            cardKey={product.fields.slug}
          >
            <Card
              showDescription
              idPropertyName="productId"
              key={product.fields.slug}
              content={{
                ...product,
                localImage: product.images[0],
                title: product.productName,
                description: product.shortPageDescription,
              }}
              imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.STANDARD}
              cardKey={product.fields.slug}
            />
          </ProductCardWrapper>
        </CardLinkWrapper>
      ));

  const brandHero = (
    <section>
      <BrandHero
        content={findPageComponentContent(components, 'BrandHero')}
        titleLevel={2}
        brandLogo={brandLogo}
        prefix={brand === 'knorr' ? 'Knorr.' : ''}
      />
    </section>
  );

  const productHero = (
    <>
      <ProductHero
        content={product}
        localImage={localImage}
        imageSizes={'(max-width: 1366px) 100vw, 800px'}
      />
      <div className={theme.product__headingSocialSharing}>
        <SocialSharing
          content={findPageComponentContent(components, 'SocialSharing')}
          viewType={SocialSharingViewType.Modal}
          CloseButtonIcon={CloseIcon}
          icons={socialIcons}
          titleLevel={4}
          WidgetScript={AddThis}
          OpenModelButtonIcon={OpenModelButtonIcon}
          brand={brand}
        />
      </div>
    </>
  );

  const mealPlanner = (
    <section className="_pb--40">
      <Hero
        content={findPageComponentContent(components, 'Hero')}
        viewType="Image"
        imageIsLink={false}
        className="hero--planner color--inverted bg-primary"
      />
    </section>
  );

  const brandSocialChannels = (
    <section className="wrapper bg-primary brand-social _pt--40 _pb--40">
      <div className="bow-white" />
      <Text
        tag={TagName.h2}
        text={
          findPageComponentContent(components, 'BrandSocialChannelsTitle').title
        }
        className="brand-social__title _pt--40"
      />
      <BrandSocialChannels
        className="brand-social__list"
        content={findPageComponentContent(components, 'BrandSocialChannels')}
        listIcons={{
          twitter: <TwitterIcon />,
          facebook: <FacebookIcon />,
          instagram: <InstagramIcon />,
          youtube: <YoutubeIcon />,
        }}
      />
    </section>
  );

  const openList = () => {
    setShowFullList(true);
  };
  const relatedCards = createProductCards(getSortedProducts(allProduct));
  const relatedProductsContent = findPageComponentContent(
    components,
    'Listing',
    'FeaturedProducts'
  );
  const query = isBrowser()
    ? ['(min-width: 768px)', '(max-width: 767px)'].findIndex(
        q => matchMedia(q).matches
      )
    : 0;
  useEffect(() => {
    const onResize = () => {
      setCounter(counter + 1);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  });
  const relatedProducts = (
    <>
      <Listing content={relatedProductsContent} titleLevel={3}>
        {showFullList ? relatedCards : relatedCards.slice(0, query ? 2 : 4)}
      </Listing>

      {!showFullList && relatedCards.length > (query ? 2 : 4) && (
        <div
          className={cx(
            theme.product__attributesRelatedButtonWrapper,
            'product__attribute-related-button-wrapper'
          )}
        >
          <Button
            className={cx(
              theme.product__attributesRelatedButton,
              brandTheme && brandTheme.product__attributesRelatedButton,
              'product__attributes-related-button'
            )}
            content={findPageComponentContent(
              components,
              'CTA',
              'discoverMore'
            )}
            onClick={openList}
          />
        </div>
      )}
    </>
  );

  const productNutrients = (
    <ProductNutrients
      titleLevel={3}
      className={cx(brandTheme && brandTheme.product__nutrients)}
      content={findPageComponentContent(components, 'ProductNutrients')}
      nutritionFacts={product.nutritionFacts}
    />
  );

  const productHeader = (
    <section className={cx(theme.product__heading, 'bg-secondary wrapper')}>
      <div
        className={cx(
          theme.product__headingContainer,
          brandTheme && brandTheme.product__headingContainer
        )}
      >
        <div
          className={cx(
            theme.product__headingHeroWrapper,
            theme.product__headingHeroWrapperDesktop
          )}
        >
          {productHero}
        </div>
        <div className={theme.product__headingInfoWrapper}>
          <ProductCopy
            viewType={ProductCopyViewType.Title}
            product={product}
            content={{}}
            titleLevel={1}
            className="product-copy__title"
          />
          <div
            className={cx(
              theme.product__headingHeroWrapper,
              theme.product__headingHeroWrapperMobile
            )}
          >
            {productHero}
          </div>
          <Rating
            id={product.productId}
            entityType={RatingAndReviewsEntityType.product}
            provider={RatingAndReviewsProvider.kritique}
            linkTo={product.fields.slug}
          />
          <ProductCopy
            viewType={ProductCopyViewType.Description}
            product={product}
            content={{}}
            className="product-copy__description"
          />
          <Button
            Icon={<CartIcon />}
            content={findPageComponentContent(
              components,
              'BuyNowButton',
              'buyNowButton'
            )}
            className={cx(
              theme.product__headingButton,
              'product__heading-button'
            )}
          />
        </div>
      </div>
    </section>
  );

  const productBody = (
    <section
      className={cx(
        theme.product__attributesWrapper,
        brandTheme && brandTheme.product__attributesWrapper,
        '_pb--40 _pt--40 bg-primary bg-primary--wave up-to wrapper'
      )}
    >
      <div
        className={cx(
          theme.product__attributes,
          brandTheme && brandTheme.product__attributes
        )}
      >
        {product.allergy || product.ingredients ? (
          product.ingredients ? (
            <div className={cx(theme.product__attributesColumn)}>
              <ProductCopy
                viewType={ProductCopyViewType.Ingredients}
                product={product}
                titleLevel={3}
                content={findPageComponentContent(
                  components,
                  'ProductCopy',
                  'Ingredients'
                )}
              />
              {product.allergy ? (
                <ProductCopy
                  viewType={ProductCopyViewType.Allergy}
                  product={product}
                  titleLevel={3}
                  content={findPageComponentContent(
                    components,
                    'ProductCopy',
                    'Allergy'
                  )}
                />
              ) : null}
            </div>
          ) : null
        ) : null}
        <div className={cx(theme.product__attributesColumn)}>
          {productNutrients}
        </div>
      </div>
      <div className={cx(theme.product__attributesRelated)}>
        {relatedCards.length ? relatedProducts : null}
      </div>
      <div>
        <Reviews
          id={product.productId}
          entityType={RatingAndReviewsEntityType.product}
          provider={RatingAndReviewsProvider.kritique}
          linkTo={product.fields.slug}
        />
      </div>
    </section>
  );

  if (localImage) {
    const seoImage = seo.meta.find(item => {
      return item.name == 'og:image';
    });
    seoImage && (seoImage.content = localImage.childImageSharp.fluid.src);
  }

  return (
    <Layout className={classWrapper}>
      <SEO
        {...seo}
        canonical={location.href}
        title={product.productName}
        description={product.longPageDescription}
      />
      <DigitalData title={seo.title} type={type} />
      {brandHero}
      {productHeader}
      {productBody}
      {brandSocialChannels}
      {mealPlanner}
    </Layout>
  );
};

export default BrandProductDetailsPage;

export const query = graphql`
  query($brand: String, $category: String) {
    allProduct(
      filter: {
        brand: { eq: $brand }
        category: { eq: $category }
        EANparent: { eq: "" }
      }
    ) {
      nodes {
        brand
        id
        productId
        productName
        productLaunchDate
        shortPageDescription
        productTags
        category
        fields {
          slug
        }
        images {
          childImageSharp {
            fluid {
              base64
              aspectRatio
              sizes
              src
              srcSet
              srcSetWebp
              srcWebp
            }
          }
        }
      }
    }
  }
`;

interface BrandProductDetailsPageProps {
  pageContext: {
    page: AppContent.Page;
    product: Internal.Product;
    brand: string;
    category: string;
  };
  data: {
    allProduct: {
      nodes: [
        {
          brand: string;
          id: string;
          productId: number;
          productName: string;
          productLaunchDate: string;
          shortPageDescription: string;
          productTags: Internal.Tag[];
          category: string;
          fields: { slug: string };
          images: Internal.LocalImage[];
        }
      ];
    };
  };
  location: WindowLocation;
}

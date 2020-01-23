import { WindowLocation } from '@reach/router';
import cx from 'classnames';
import { graphql } from 'gatsby';
import {
  BrandSocialChannels,
  Button,
  Card,
  CardLinkWrapper,
  GenericCarousel,
  Hero,
  Listing,
  ProductCardWrapper,
  RatingAndReviewsProvider,
  TagName,
  Text,
} from 'gatsby-awd-components/src';
import React, { useEffect, useState } from 'react';
import SEO from 'src/components/Seo';
import BrandHero from '../../components/BrandHero';
import { ReactComponent as FacebookIcon } from 'src/svgs/inline/facebook.svg';
import { ReactComponent as InstagramIcon } from 'src/svgs/inline/instagram.svg';
import { ReactComponent as TwitterIcon } from 'src/svgs/inline/twitter.svg';
import { ReactComponent as YoutubeIcon } from 'src/svgs/inline/youtube.svg';
import themeKnorr from './BrandProductsPageKnorr.module.scss';
import themeHellmanns from './BrandProductsPageHellmanns.module.scss';
import themeMaizena from './BrandProductsPageMaizena.module.scss';
import { ReactComponent as KnorrLogoIcon } from 'src/svgs/inline/logo-knorr.svg';
import { ReactComponent as HellmannsLogoIcon } from 'src/svgs/inline/logo-hellmanns.svg';
import { ReactComponent as MaizenaLogoIcon } from 'src/svgs/inline/logo-maizena.svg';
import {
  findPageComponentContent,
  getSortedProducts,
  isBrowser,
} from 'src/utils';
import DigitalData from '../../../integrations/DigitalData';
import Layout from '../../components/Layout/Layout';
import LookByCategory from '../../components/LookByCategory';
import { IMAGE_SIZES } from '../../constants';
import { ReactComponent as ArrowIcon } from 'src/svgs/inline/arrow-down.svg';
import '../../scss/pages/_brand.scss';
import { ReactComponent as MaizenaSpikeletIcon } from 'src/svgs/inline/spikelet.svg';

const BrandProductsPage: React.FunctionComponent<BrandProductsPageProps> = ({
  pageContext,
  location,
  data: { allProduct },
}) => {
  const [counter, setCounter] = useState(0);
  const {
    page: { components, seo, type, brand },
  } = pageContext;
  const getBrandThemeContent = (brand: string | undefined) => {
    switch (brand) {
      case 'knorr':
        return {
          theme: themeKnorr,
          brandLogo: KnorrLogoIcon,
        };
      case 'hellmanns':
        return {
          theme: themeHellmanns,
          brandLogo: HellmannsLogoIcon,
        };
      case 'maizena':
        return {
          theme: themeMaizena,
          brandLogo: MaizenaLogoIcon,
        };
      default:
        return null;
    }
  };

  // @ts-ignore
  const { theme, brandLogo } = getBrandThemeContent(brand);
  const classWrapper = cx(
    theme.brandProductsPage,
    'brand-page',
    'brand-products-page',
    brand
  );
  const headerContent = findPageComponentContent(components, 'Header');

  const productCarouselContent = findPageComponentContent(
    components,
    'GenericCarousel',
    'ProductCarousel'
  );
  const featuredProductsContent = findPageComponentContent(
    components,
    'Listing',
    'FeaturedProducts'
  );

  const lookByCategoryContent = findPageComponentContent(
    components,
    'Text',
    'LookByCategory'
  );

  const discoverMoreContent = findPageComponentContent(
    components,
    'CTA',
    'discoverMore'
  );

  const followUs = findPageComponentContent(components, 'Text', 'FollowUs');
  const brandSocial = findPageComponentContent(
    components,
    'BrandSocialChannels'
  );
  const carouselConfig = {
    breakpoints: [
      {
        width: 768,
        switchElementsBelowBreakpoint: 1,
        switchElementsAfterBreakpoint: 1,
        visibleElementsBelowBreakpoint: 2,
        visibleElementsAboveBreakpoint: 4,
      },
    ],
    arrowIcon: <ArrowIcon />,
  };

  //@ts-ignore
  const createProductCards = list =>
    //@ts-ignore
    list.map(product => (
      <CardLinkWrapper
        key={product.fields.slug}
        cardKey={product.fields.slug}
        title={product.productName}
        slug={product.fields.slug}
      >
        <ProductCardWrapper
          cardKey={product.fields.slug}
          ratingProvider={RatingAndReviewsProvider.none}
        >
          <Card
            showDescription
            idPropertyName="productId"
            cardKey={product.fields.slug}
            content={{ ...product, title: product.productName }}
            imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.STANDARD}
          />
        </ProductCardWrapper>
      </CardLinkWrapper>
    ));
  const categories = Array.from(
    new Set(allProduct.nodes.map(product => product.category))
  );
  const categoriesInitial = () => {
    const initial: { [key: string]: boolean } = {};
    categories.forEach(category => {
      initial[category] = false;
    });
    return initial;
  };
  const [showFullList, setShowFullList] = useState(categoriesInitial());
  let productsSorted: Internal.Product[] = getSortedProducts(allProduct);
  //@ts-ignore
  productsSorted = productsSorted.map(product => {
    return {
      ...product,
      description: product.shortPageDescription,
    };
  });
  const featuredProducts = createProductCards(
    productsSorted.filter(
      product =>
        featuredProductsContent.staticList.indexOf(
          parseInt(product.productId)
        ) !== -1
    )
  );
  const newestCards = createProductCards(productsSorted.slice(0, 6));
  const categoryCards: { [key: string]: any } = [];
  categories.forEach(cat => {
    categoryCards[cat] = createProductCards(
      //@ts-ignore
      productsSorted.filter(product => product.category === cat)
    );
  });

  const openListCategory = (category: string) => {
    showFullList[category] = true;
    setShowFullList(showFullList);
    setCounter(counter + 1);
  };
  const createCategories = (category: string) => {
    const query = isBrowser()
      ? ['(min-width: 768px)', '(max-width: 767px)'].findIndex(
          q => matchMedia(q).matches
        )
      : 0;
    const initialView = categoryCards[category].slice(0, query ? 2 : 4);
    return (
      <div className="product-category-listing cards--light">
        {showFullList[category] ? (
          <Listing content={{ title: category.toLowerCase() }} titleLevel={3}>
            {categoryCards[category]}
          </Listing>
        ) : (
          <Listing content={{ title: category.toLowerCase() }} titleLevel={3}>
            {initialView}
          </Listing>
        )}
        {!showFullList[category] &&
          categoryCards[category].length > (query ? 2 : 4) && (
            <Button
              className="discover-more"
              content={discoverMoreContent}
              onClick={() => {
                openListCategory(category);
              }}
            />
          )}
      </div>
    );
  };

  useEffect(() => {
    const onResize = () => {
      setCounter(counter + 1);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  return (
    <Layout className={classWrapper}>
      <SEO {...seo} canonical={location.href} />
      <DigitalData title={seo.title} type={type} />
      {headerContent && (
        <section className="">
          <BrandHero
            content={findPageComponentContent(components, 'BrandHero')}
            titleLevel={1}
            brandLogo={brandLogo}
            prefix={brand === 'knorr' ? 'Knorr.' : ''}
          />
        </section>
      )}
      {productCarouselContent && (
        <section className="wrapper product-carousel _pt--40 _pb--40 bg-secondary">
          {brand && brand.toLowerCase() === 'maizena' ? (
            <div className="spikelet-icon">
              <MaizenaSpikeletIcon />
            </div>
          ) : null}
          <GenericCarousel
            content={productCarouselContent}
            titleLevel={2}
            config={carouselConfig}
          >
            {newestCards}
          </GenericCarousel>
        </section>
      )}
      {featuredProductsContent && (
        <section className="wrapper featured-products _pb--40 bg-primary bg-primary--wave">
          <Listing content={featuredProductsContent} titleLevel={3}>
            {featuredProducts}
          </Listing>
        </section>
      )}
      {categories && lookByCategoryContent && (
        <section className="wrapper categories bg-primary _pb--40">
          <LookByCategory
            renderIteration={counter}
            categories={categories}
            title={lookByCategoryContent.text}
            createChildren={createCategories}
            titleLevel={3}
          />
        </section>
      )}
      <section className="wrapper brand-social bg-primary _pt--40 _pb--40">
        <div className="bow-white" />
        {followUs && brandSocial && (
          <Text
            tag={TagName.h2}
            text={followUs.text}
            className="brand-social__title _pt--40"
          />
        )}
        {brandSocial && (
          <BrandSocialChannels
            content={brandSocial}
            className="brand-social__list"
            listIcons={{
              twitter: <TwitterIcon />,
              facebook: <FacebookIcon />,
              instagram: <InstagramIcon />,
              youtube: <YoutubeIcon />,
            }}
          />
        )}
      </section>
      <section className="_pb--40">
        <Hero
          content={findPageComponentContent(components, 'Hero')}
          viewType="Image"
          className="hero--planner color--inverted bg-primary"
          imageSizes={IMAGE_SIZES.HERO}
        />
      </section>
    </Layout>
  );
};

export default BrandProductsPage;
// we need have brand prop in context
export const query = graphql`
  query($regexpBrand: String) {
    allProduct(filter: { brand: { regex: $regexpBrand } }) {
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

interface BrandProductsPageProps {
  pageContext: {
    page: AppContent.Page;
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

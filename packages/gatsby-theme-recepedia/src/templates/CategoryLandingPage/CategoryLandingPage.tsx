import React, { useCallback, useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { graphql } from 'gatsby';
import SEO from 'src/components/Seo';
import cx from 'classnames';
import { IMAGE_SIZES } from '../../constants';
import { ReactComponent as ArrowIcon } from '../../svgs/inline/arrow-down.svg';
import { findPageComponentContent } from '../../utils';
import useMedia from '../../utils/useMedia';
import theme from './CategoryLandingPage.module.scss';
import DigitalData from '../../../integrations/DigitalData';
import { WindowLocation } from '@reach/router';
// Component Styles
import '../../scss/pages/_recipeCategories.scss';
import { createCardsFromList, createRecipeCardsFromList } from './helpers';
import { Listing } from 'gatsby-awd-components/src/components/Listing';
import { GenericCarousel } from 'gatsby-awd-components/src/components/GenericCarousel';
import { Hero } from 'gatsby-awd-components/src/components/Hero';
import Tags from 'gatsby-awd-components/src/components/Tags';
import Button from 'gatsby-awd-components/src/components/Button';
import Text, { TagName } from 'gatsby-awd-components/src/components/Text';
import { getPagePath } from '../../utils/getPagePath';

const CategoryLandingPage = ({
  pageContext,
  data,
  location,
}: CategoryLandingPage) => {
  const BASE_CATEGORIES_COUNT = useMedia(undefined, [8, 6]) || 0;
  const LOAD_CATEGORIES_COUNT = useMedia(undefined, [4, 2]) || 2;
  const initialTagsCount = useMedia(undefined, [9, 5]);
  const {
    page: { components, seo, type },
    category,
  } = pageContext;

  const relatedCategoriesContent = findPageComponentContent(
    components,
    'PageListing',
    'RelatedCategories'
  );
  const brandLogoLink = getPagePath('Search');
  const { localImage, title, titlePlural, description } = category;
  const {
    tags: { nodes: categoryTags },
    seasonalPromo: { nodes: recipesPromo },
    searchPageUrl: { relativePath: searchPath },
  } = data;
  const tagsContent = findPageComponentContent(components, 'Tags');
  const pageTitleContent = findPageComponentContent(
    components,
    'PageTitleTemplate'
  );
  const pageTitle = pageTitleContent?.text
    ? pageTitleContent.text.replace('{categoryTitle}', titlePlural)
    : titlePlural;
  const seasonalPromotionsContent = findPageComponentContent(
    components,
    'Carousel',
    'RecipePromotions'
  );
  const heroContent = findPageComponentContent(components, 'Hero');
  const relatedCategories = data.allCategory.nodes;

  const [relatedCategoriesDisplaing, setRelatedCategoriesDisplaing] = useState(
    relatedCategories.slice(0, BASE_CATEGORIES_COUNT)
  );
  useEffect(() => {
    if (BASE_CATEGORIES_COUNT > relatedCategoriesDisplaing.length) {
      setRelatedCategoriesDisplaing(
        relatedCategories.slice(0, BASE_CATEGORIES_COUNT)
      );
    }
  }, [BASE_CATEGORIES_COUNT]);

  const onLoadMoreCategories = useCallback(() => {
    setRelatedCategoriesDisplaing(
      relatedCategories.slice(
        0,
        relatedCategoriesDisplaing.length + LOAD_CATEGORIES_COUNT
      )
    );
  }, [relatedCategoriesDisplaing]);

  const classWrapper = cx(theme.categoryLandingPage, 'category-landing-page');
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
        title={title}
        description={description}
        canonical={location.href}
      />
      <DigitalData title={title} type={type} />
      <section className={cx(theme.pageTitle__wrap, '_pt--40', 'wrapper')}>
        <Text
          className={theme.pageTitle}
          tag={TagName['h1']}
          text={pageTitle}
        />
      </section>
      {relatedCategoriesContent && relatedCategories.length > 0 && (
        <section className={cx(theme.relatedCategories, 'wrapper', '_pt--40')}>
          <Listing content={relatedCategoriesContent}>
            {createCardsFromList(relatedCategoriesDisplaing)}
          </Listing>
          {relatedCategoriesDisplaing.length < relatedCategories.length &&
            BASE_CATEGORIES_COUNT > 0 && (
              <Button
                content={relatedCategoriesContent.cta}
                onClick={onLoadMoreCategories}
                className="load-more button--medium"
              />
            )}
        </section>
      )}
      {tagsContent && categoryTags.length > 0 && (
        <section className={cx(theme.tagsList, 'wrapper')}>
          <Tags
            initialCount={initialTagsCount}
            list={categoryTags}
            content={tagsContent}
          />
        </section>
      )}
      {recipesPromo && recipesPromo.length > 0 && seasonalPromotionsContent && (
        <section className={cx(theme.seasonalPromotions, 'wrapper', '_pb--40')}>
          <GenericCarousel
            content={seasonalPromotionsContent}
            titleLevel={2}
            config={{
              breakpoints: [
                {
                  width: 768,
                  switchElementsBelowBreakpoint: 1,
                  switchElementsAfterBreakpoint: 1,
                  visibleElementsBelowBreakpoint: 1,
                  visibleElementsAboveBreakpoint: 2,
                },
              ],
              arrowIcon: <ArrowIcon />,
            }}
          >
            {createRecipeCardsFromList(recipesPromo, searchPath, brandLogoLink)}
          </GenericCarousel>
        </section>
      )}
      {heroContent && (
        <section className="_pb--40">
          <Hero
            content={heroContent}
            viewType="Image"
            className={'hero--planner color--inverted'}
            imageSizes={IMAGE_SIZES.HERO}
          />
        </section>
      )}
    </Layout>
  );
};

export default CategoryLandingPage;
export const query = graphql`
  query($children: [Int], $tags: [Int], $seasonalPromo: [Int]) {
    allCategory(
      filter: { categoryId: { in: $children } }
      sort: { fields: categoryOrder, order: ASC }
    ) {
      nodes {
        ...CategoryFields
      }
    }
    tags: allTag(filter: { tagId: { in: $tags } }) {
      nodes {
        ...TagFields
      }
    }
    seasonalPromo: allRecipe(
      limit: 8
      sort: { order: DESC, fields: creationTime }
      filter: {
        tagGroups: {
          elemMatch: { tags: { elemMatch: { id: { in: $seasonalPromo } } } }
        }
      }
    ) {
      nodes {
        ...RecipeCardFields
      }
      totalCount
    }
    searchPageUrl: page(type: { eq: "Search" }) {
      relativePath
    }
  }
`;

interface CategoryLandingPage {
  pageContext: {
    page: AppContent.Page;
    category: Internal.Category;
    tags: number[];
    slug: string;
  };
  data: {
    allCategory: {
      nodes: Internal.Category[];
    };
    tags: {
      nodes: Internal.Tag[];
    };
    seasonalPromo: {
      nodes: Internal.Recipe[];
    };
    searchPageUrl: {
      relativePath: string;
    };
  };
  location: WindowLocation;
}

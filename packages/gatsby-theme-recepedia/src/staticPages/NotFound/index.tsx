import React from 'react';
import { graphql, Link } from 'gatsby';

import Layout from 'src/components/Layout/Layout';
import SEO from 'src/components/Seo';
import DigitalData from 'integrations/DigitalData';
import { findPageComponentContent, getImageAlt } from 'src/utils';
import '../../scss/pages/_notFound.scss';
import theme from './NotFound.module.scss';
import cx from 'classnames';
import { getPagePath } from '../../utils/getPagePath';
import { ReactComponent as ArrowIcon } from '../../svgs/inline/arrow-down.svg';
import { IMAGE_SIZES } from '../../constants';
import PageListing, {
  PageListingViewTypes,
} from 'gatsby-awd-components/src/components/PageListing';
import { Text, TagName } from 'gatsby-awd-components/src/components/Text';

const NotFoundPage = ({ data, location, pageContext }: NotFoundPageProps) => {
  const {
    page: { seo, components, type },
  } = pageContext;
  const { allCategory } = data;
  const pageListingData = allCategory.nodes.map(category => ({
    ...category,
    path: category.fields.slug,
    image: {
      alt: getImageAlt(category.title, category.fields.slug),
    },
  }));
  const pageListingContent = {
    title: undefined,
  };
  const allCategoryUrl = getPagePath('AllRecipes');

  return (
    <Layout
      className="not-found"
      location={location}
      title={data.site.siteMetadata.title}
    >
      <SEO {...seo} canonical={location.href} />
      <DigitalData title={seo.title} type={'404'} />
      <div className={theme.notFound}>
        <Text
          className={theme.notFound__title}
          tag={TagName.h1}
          text={findPageComponentContent(components, 'Text', 'Title').text}
        />
        <Text
          className={theme.notFound__subtitle}
          tag={TagName.p}
          text={findPageComponentContent(components, 'Text', 'Subtitle').text}
        />
        <section
          className={cx(theme.recipeBottomCarousel, '_pt--40 _pb--40 wrapper')}
        >
          <PageListing
            content={pageListingContent}
            viewType={PageListingViewTypes.carousel}
            list={pageListingData}
            carouselConfig={{
              arrowIcon: <ArrowIcon />,
            }}
            imageSizes={IMAGE_SIZES.PAGE_LISTINGS.CAROUSEL}
          />
        </section>
        <Link
          to={allCategoryUrl}
          className={cx('button', theme.notFound__recipesLink)}
        >
          {findPageComponentContent(components, 'Button').label}
        </Link>
      </div>
    </Layout>
  );
};

export default NotFoundPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allCategory(
      limit: 15
      filter: { showOnHomepage: { ne: 0 } }
      sort: { order: ASC, fields: showOnHomepage }
    ) {
      nodes {
        ...CategoryFields
      }
    }
  }
`;

interface NotFoundPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  location: Location;
  pageContext: {
    page: AppContent.Page;
  };
}

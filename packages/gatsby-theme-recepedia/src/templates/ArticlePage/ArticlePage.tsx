import { graphql, Link } from 'gatsby';
import React from 'react';
import {
  Card,
  CardLinkWrapper,
  Listing,
  ProductCardWrapper,
  RatingAndReviewsProvider,
  TagName,
  Text,
} from 'gatsby-awd-components/src';
import SEO from 'src/components/Seo/Seo';
import cx from 'classnames';
import { findPageComponentContent } from 'src/utils';
import AddThis from '../../../integrations/AddThis';
import Layout from '../../components/Layout/Layout';
import {
  Hero,
  SocialIcons,
  SocialSharing,
  SocialSharingViewType,
} from 'gatsby-awd-components/src';
import DigitalData from '../../../integrations/DigitalData';
import { WindowLocation } from '@reach/router';
import BlockContent from '@sanity/block-content-to-react';
import { IMAGE_SIZES } from 'src/constants';
import { getPagePath } from '../../utils/getPagePath';
import { ReactComponent as FacebookIcon } from 'src/svgs/inline/facebook.svg';
import { ReactComponent as TwitterIcon } from 'src/svgs/inline/twitter.svg';
import { ReactComponent as CloseButton } from 'src/svgs/inline/x-mark.svg';
import { ReactComponent as OpenModelButtonIcon } from 'src/svgs/inline/social-sharing-circle.svg';
import { ReactComponent as PinterestIcon } from 'src/svgs/inline/pinterest.svg';
import { ReactComponent as WhatsappIcon } from 'src/svgs/inline/whatsapp.svg';
import theme from 'src/templates/ArticlePage/ArticlePage.module.scss';
import '../../scss/pages/_article.scss';

const socialIcons: SocialIcons = {
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  pinterest: PinterestIcon,
  whatsapp: WhatsappIcon,
};
const ArticlePage: React.FunctionComponent<ArticlePageProps> = ({
  data: { article, allArticle },
  pageContext,
  location,
}) => {
  const {
    page: { seo, components, type },
  } = pageContext;
  let brandedArticles = allArticle.nodes
    .filter(art => art.tags && art.tags.some(tag => article.tags.includes(tag)))
    .filter(art => art.id !== article.id)
    .slice(0, 4);
  if (!brandedArticles.length) {
    brandedArticles = allArticle.nodes.slice(0, 4);
  }
  const mainImageHero = {
    image: {
      localImage: article.localImage,
      size: IMAGE_SIZES.HERO,
      alt: article.title,
      url: '/',
    },
  };
  const next = brandedArticles[0];
  const nextContent = next && {
    image: {
      localImage: next.localImage,
      size: IMAGE_SIZES.HERO,
      alt: next.title,
      url: '/',
    },
    shortSubheader: next.title,
    longSubheader: next.shortDescription,
  };
  const LinkToBrandProducts = getPagePath('BrandProductsPage', article.brand);
  const socialSharingContent = findPageComponentContent(
    components,
    'SocialSharing'
  );

  const searchPath = getPagePath('Search');
  const articleCards = brandedArticles.map(brandedArticle => (
    <CardLinkWrapper
      key={brandedArticle.fields.slug}
      title={brandedArticle.title}
      slug={brandedArticle.fields.slug}
      cardKey={brandedArticle.fields.slug}
    >
      <ProductCardWrapper
        key={brandedArticle.fields.slug}
        ratingProvider={RatingAndReviewsProvider.none}
        cardKey={brandedArticle.fields.slug}
      >
        <Card
          showDescription
          idPropertyName="id"
          key={brandedArticle.fields.slug}
          content={{
            ...brandedArticle,
            title: brandedArticle.title,
            description: brandedArticle.shortDescription,
            localImage: brandedArticle.localImage,
          }}
          imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.STANDARD}
          cardKey={brandedArticle.fields.slug}
          brandName={article.brand}
          brandLink={searchPath}
        />
      </ProductCardWrapper>
    </CardLinkWrapper>
  ));

  return (
    <Layout className={theme.articleWrap}>
      <SEO
        {...seo}
        canonical={location.href}
        title={article.title}
        description={article.shortDescription}
      />
      <DigitalData title={article.title} type={type} />
      <section className={theme.articleTitle}>
        <Text tag={TagName.h1} text={article.title} className="wrapper" />
      </section>
      {mainImageHero && (
        <section className={cx(theme.articleImage, 'bg--half', 'wrapper')}>
          <div className="article-image__wrap">
            <Hero
              viewType="Image"
              content={mainImageHero}
              imageSizes={IMAGE_SIZES.HERO}
              brand={article.brand}
              brandLink={LinkToBrandProducts}
            />
            <SocialSharing
              content={socialSharingContent}
              className={theme.articleSocial}
              icons={socialIcons}
              viewType={SocialSharingViewType.Modal}
              CloseButtonIcon={CloseButton}
              WidgetScript={AddThis}
              OpenModelButtonIcon={OpenModelButtonIcon}
              brand={article.brand}
            />
          </div>
        </section>
      )}

      <section className={cx(theme.articleText, 'wrapper')}>
        <BlockContent blocks={JSON.parse(article.content)} />
        <SocialSharing
          content={socialSharingContent}
          className={theme.articleSocial}
          icons={socialIcons}
          viewType={SocialSharingViewType.Modal}
          CloseButtonIcon={CloseButton}
          WidgetScript={AddThis}
          OpenModelButtonIcon={OpenModelButtonIcon}
          brand={article.brand}
        />
      </section>
      {next && next.fields && next.fields.slug && nextContent.image && (
        <section className={theme.articleNext}>
          <Text
            tag={TagName.h2}
            text={
              findPageComponentContent(components, 'Text', 'NextTitle').text
            }
            className="wrapper"
          />
          <Link to={next.fields.slug} className="wrapper">
            <Hero
              content={nextContent}
              viewType="Image"
              titleLevel={2}
              imageSizes={IMAGE_SIZES.HERO}
              brand={next.brand}
              className={cx(theme.articleHeroNext, 'article-hero-next')}
            />
          </Link>
        </section>
      )}
      <section>
        <Hero
          content={findPageComponentContent(components, 'Hero')}
          viewType="Image"
          className="hero--planner color--inverted wrapper"
          imageSizes={IMAGE_SIZES.HERO}
        />
      </section>
      {brandedArticles.length ? (
        <section className={cx(theme.articleRecent, 'wrapper _pb--40 _pt--40')}>
          <Listing
            content={findPageComponentContent(components, 'RelatedArticles')}
            titleLevel={2}
          >
            {articleCards}
          </Listing>
        </section>
      ) : null}
    </Layout>
  );
};

export default ArticlePage;

export const query = graphql`
  query($slug: String!) {
    article(fields: { slug: { eq: $slug } }) {
      ...ArticleFields
    }
    allArticle(sort: { fields: creationTime, order: DESC }) {
      nodes {
        ...ArticleFields
      }
    }
  }
`;

interface ArticlePageProps {
  data: {
    article: Internal.Article;
    allArticle: {
      nodes: Internal.Article[];
    };
  };
  pageContext: {
    id: string;
    slug: string;
    page: AppContent.Page;
    edge: object;
  };
  location: WindowLocation;
}

import { graphql, Link } from 'gatsby';
import React from 'react';
import SEO from 'src/components/Seo/Seo';
import cx from 'classnames';
import { findPageComponentContent } from 'src/utils';
import AddThis from '../../../integrations/AddThis';
import Layout from '../../components/Layout/Layout';
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
import SocialSharing, {
  SocialIcons,
  SocialSharingViewType,
} from 'gatsby-awd-components/src/components/SocialSharing';
import { CardLinkWrapper } from 'gatsby-awd-components/src/components/CardLinkWrapper';
import { ProductCardWrapper } from 'gatsby-awd-components/src/components/Card';
import { Text, TagName } from 'gatsby-awd-components/src/components/Text';
import { Listing } from 'gatsby-awd-components/src/components/Listing';
import { Hero } from 'gatsby-awd-components/src/components/Hero';
import { RatingAndReviewsProvider } from 'gatsby-awd-components/src';
import { Card } from 'gatsby-awd-components/src/components/Card';

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
  const brandedArticles = allArticle.nodes
    .filter(art => art.tags && art.tags.some(tag => article.tags.includes(tag)))
    .filter(art => art.id !== article.id);

  const mainImageHero = {
    image: {
      localImage: article.localImage,
      size: IMAGE_SIZES.HERO,
      alt: article.title,
      url: '/',
    },
  };
  const next =
    brandedArticles[0] ||
    allArticle.nodes.filter(
      art => art.brand === article.brand && art.id !== article.id
    )[0];
  const relatedArticles = brandedArticles.length
    ? brandedArticles.slice(0, 4)
    : allArticle.nodes.slice(0, 4);
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
  const serializers = {
    marks: {
      // eslint-disable-next-line react/display-name
      link: (props: any) => (
        <a href={props.mark.href} target="_blank" rel="noopener noreferrer">
          {props.children}
        </a>
      ),
    },
  };
  const searchPath = getPagePath('Search');
  const articleCards = relatedArticles.map(relatedArticle => (
    <CardLinkWrapper
      key={relatedArticle.fields.slug}
      title={relatedArticle.title}
      slug={relatedArticle.fields.slug}
      cardKey={relatedArticle.fields.slug}
    >
      <ProductCardWrapper
        key={relatedArticle.fields.slug}
        ratingProvider={RatingAndReviewsProvider.none}
        cardKey={relatedArticle.fields.slug}
      >
        <Card
          showDescription
          idPropertyName="id"
          key={relatedArticle.fields.slug}
          content={{
            ...relatedArticle,
            title: relatedArticle.title,
            description: relatedArticle.shortDescription,
            localImage: relatedArticle.localImage,
          }}
          imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.STANDARD}
          cardKey={relatedArticle.fields.slug}
          brandName={relatedArticle.brand}
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
        <BlockContent
          blocks={JSON.parse(article.content)}
          serializers={serializers}
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
      </section>
      {next && next.fields && next.fields.slug && nextContent.image && (
        <section className={cx(theme.articleNext, 'wrapper')}>
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
      {relatedArticles.length ? (
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

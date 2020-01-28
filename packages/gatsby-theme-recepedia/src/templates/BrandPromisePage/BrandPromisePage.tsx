import React from 'react';
import Layout from '../../components/Layout/Layout';
import BrandHero from '../../components/BrandHero';
import SEO from 'src/components/Seo';
import cx from 'classnames';
import { graphql } from 'gatsby';
import { findPageComponentContent } from 'src/utils';
import DigitalData from '../../../integrations/DigitalData';
import { WindowLocation } from '@reach/router';
import themeKnorr from './BrandPromisePageKnorr.module.scss';
import themeHellmanns from './BrandPromisePageHellmanns.module.scss';
import themeMaizena from './BrandPromisePageMaizena.module.scss';
import { ReactComponent as KnorrLogoIcon } from 'src/svgs/inline/logo-knorr.svg';
import { ReactComponent as HellmannsLogoIcon } from 'src/svgs/inline/logo-hellmanns.svg';
import { ReactComponent as MaizenaLogoIcon } from 'src/svgs/inline/logo-maizena.svg';
import '../../scss/pages/_brand.scss';
import { ReactComponent as FacebookIcon } from 'src/svgs/inline/facebook.svg';
import { ReactComponent as InstagramIcon } from 'src/svgs/inline/instagram.svg';
import { ReactComponent as TwitterIcon } from 'src/svgs/inline/twitter.svg';
import { ReactComponent as YoutubeIcon } from 'src/svgs/inline/youtube.svg';
import { IMAGE_SIZES } from 'src/constants';
import BrandPromiseHellmanns from 'src/components/BrandPromise/BrandPromiseHellmanns';
import BrandPromiseKnorr from 'src/components/BrandPromise/BrandPromiseKnorr';
import BrandPromiseMaizena from 'src/components/BrandPromise/BrandPromiseMaizena';
import BrandSocialChannels from 'gatsby-awd-components/src/components/BrandSocialChannels';
import { Text, TagName } from 'gatsby-awd-components/src/components/Text';
import { Hero } from 'gatsby-awd-components/src/components/Hero';

const BrandPromisePage: React.FunctionComponent<BrandPromisePageProps> = ({
  data: {
    allArticle: { nodes: brandArticles },
  },
  pageContext,
  location,
}) => {
  const {
    page: { components, seo, type, brand },
  } = pageContext;

  const getBrandThemeContent = (brand: string | undefined) => {
    switch (brand) {
      case 'knorr':
        return {
          theme: themeKnorr,
          brandLogo: KnorrLogoIcon,
          brandComponent: (
            <BrandPromiseKnorr {...{ components, brandArticles }} />
          ),
        };
      case 'hellmanns':
        return {
          theme: themeHellmanns,
          brandLogo: HellmannsLogoIcon,
          brandComponent: (
            <BrandPromiseHellmanns {...{ components, brandArticles }} />
          ),
        };
      case 'maizena':
        return {
          theme: themeMaizena,
          brandLogo: MaizenaLogoIcon,
          brandComponent: <BrandPromiseMaizena {...{ components }} />,
        };
      default:
        return null;
    }
  };
  // @ts-ignore
  const { theme, brandLogo, brandComponent } = getBrandThemeContent(brand);
  const classWrapper = cx(
    theme.brandPromisePage,
    'brand-page',
    'brand-promise-page',
    brand
  );

  return (
    <Layout className={classWrapper}>
      <SEO {...seo} canonical={location.href} />
      <DigitalData title={seo.title} type={type} />
      <section>
        <BrandHero
          content={findPageComponentContent(components, 'BrandHero')}
          titleLevel={1}
          brandLogo={brandLogo}
          prefix={brand === 'knorr' ? 'Knorr.' : ''}
        />
      </section>
      {/*
      // @ts-ignore */}
      {brand && brandComponent}
      <section className="wrapper bg-primary brand-social _pt--40 _pb--40">
        <div className="bow-white" />
        <Text
          tag={TagName.h2}
          text={
            findPageComponentContent(components, 'BrandSocialChannelsTitle')
              .title
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

      <section className="_pb--40">
        <Hero
          content={findPageComponentContent(components, 'Hero')}
          viewType="Image"
          imageIsLink={false}
          className="hero--planner color--inverted bg-primary"
          imageSizes={IMAGE_SIZES.HERO}
        />
      </section>
    </Layout>
  );
};

export default BrandPromisePage;

export const pageQuery = graphql`
  query($regexpBrand: String) {
    allArticle(filter: { brand: { regex: $regexpBrand } }) {
      nodes {
        ...ArticleFields
      }
    }
  }
`;
interface BrandPromisePageProps {
  data: { allArticle: { nodes: Internal.Article[] } };
  pageContext: {
    page: AppContent.Page;
  };
  location: WindowLocation;
}

import React from 'react';
import Layout from 'src/components/Layout/Layout';
import SEO from 'src/components/Seo';
import DigitalData from '../../../integrations/DigitalData';
import { WindowLocation } from '@reach/router';
import { Text, TagName } from 'gatsby-awd-components/src/components/Text';
import { findPageComponentContent } from 'src/utils';
import theme from './termsAndConditions.module.scss';
import cx from 'classnames';
import '../../scss/pages/_default.scss';
import RichText from 'gatsby-awd-components/src/components/RichText';

const TermsAndConditionsPage = ({
  pageContext: {
    page: { components, seo, type },
  },
  location,
}: TermsAndConditionsPageProps) => {
  return (
    <Layout>
      <SEO {...seo} canonical={location.href} />
      <DigitalData title={seo.title} type={type} />
      <section className={cx(theme.termsAndConditions, '_pt--40 wrapper')}>
        <Text
          tag={TagName['h1']}
          text={findPageComponentContent(components, 'Text', 'Title').text}
        />
        <Text
          tag={TagName['h2']}
          text={findPageComponentContent(components, 'Text', 'Subtitle').text}
        />
        <RichText content={findPageComponentContent(components, 'RichText')} />
      </section>
    </Layout>
  );
};

interface TermsAndConditionsPageProps {
  pageContext: {
    page: AppContent.Page;
  };
  location: WindowLocation;
}
export default TermsAndConditionsPage;

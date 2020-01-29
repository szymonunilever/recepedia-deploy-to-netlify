import React from 'react';
import SEO from 'src/components/Seo';
import { findPageComponentContent } from 'src/utils';
import DigitalData from '../../../integrations/DigitalData';
import Layout from '../../components/Layout/Layout';
import { navigate } from 'gatsby';
import { WindowLocation } from '@reach/router';
import theme from './ContactUsThankYou.module.scss';
// Component Styles
import '../../scss/pages/_thankYouPage.scss';
import Button from 'gatsby-awd-components/src/components/Button';
import { Text, TagName } from 'gatsby-awd-components/src/components/Text';

const ContactUsThankYouPage = ({
  pageContext,
  location,
}: ContactUsThankYouPageProps) => {
  const {
    page: { seo, components, type },
  } = pageContext;

  const buttonContent = findPageComponentContent(components, 'Button');

  const clickHandler = () => {
    if (buttonContent && buttonContent.linkTo) navigate(buttonContent.linkTo);
  };

  return (
    <Layout>
      <SEO {...seo} canonical={location.href} />
      <DigitalData title={seo.title} type={type} />
      <section className={theme.contactUsThankYou}>
        <Text
          tag={TagName['h1']}
          text={findPageComponentContent(components, 'Text', 'Title').text}
        />
        <Text
          tag={TagName.p}
          className="thank-you__description"
          text={
            findPageComponentContent(components, 'Text', 'Description').text
          }
        />
        <div className="thank-you__profile-link">
          <Button
            className="thank-you__profile-button"
            content={buttonContent}
            onClick={clickHandler}
          />
        </div>
      </section>
    </Layout>
  );
};

export default ContactUsThankYouPage;
export interface ContactUsThankYouPageProps {
  pageContext: {
    page: AppContent.Page;
  };
  location: WindowLocation;
}

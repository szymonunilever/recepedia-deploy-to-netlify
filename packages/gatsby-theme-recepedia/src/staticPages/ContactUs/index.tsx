import React from 'react';
import cx from 'classnames';
import SEO from 'src/components/Seo';
import { findPageComponentContent } from 'src/utils';
import DigitalData from '../../../integrations/DigitalData';
import Layout from '../../components/Layout/Layout';
import theme from './ContactUs.module.scss';
import { ReactComponent as MapMarker } from 'src/svgs/inline/map-marker.svg';
import { ReactComponent as Email } from 'src/svgs/inline/email.svg';
import { ReactComponent as Phone } from 'src/svgs/inline/phone.svg';
import { WindowLocation } from '@reach/router';
// Component Styles
import '../../scss/pages/_contactUs.scss';
import ContactCard from 'gatsby-awd-components/src/components/ContactCard';
import { Text, TagName } from 'gatsby-awd-components/src/components/Text';

const ContactUsPage = ({ pageContext, location }: ContactUsPageProps) => {
  const {
    page: { seo, components, type },
  } = pageContext;
  const contactFormCardContent = findPageComponentContent(
    components,
    'Card',
    'Contact'
  );
  const phoneContent = findPageComponentContent(components, 'Card', 'Phone');
  const emailContent = findPageComponentContent(components, 'Card', 'Email');
  const addressContent = findPageComponentContent(
    components,
    'Card',
    'Address'
  );

  return (
    <Layout>
      <SEO {...seo} canonical={location.href} />
      <DigitalData title={seo.title} type={type} />
      <section className={theme.contactUs}>
        <Text
          tag={TagName['h1']}
          text={findPageComponentContent(components, 'Text', 'PageTitle').text}
        />
        <Text
          tag={TagName.p}
          className="contact-us__description"
          text={
            findPageComponentContent(components, 'Text', 'Description').text
          }
        />
        <div className={theme.cardholder}>
          {!!Object.keys(addressContent).length && (
            <div className={theme.cardholderItem}>
              <ContactCard
                className="contact-card"
                titleLevel={2}
                content={addressContent}
                Icon={MapMarker}
              />
            </div>
          )}
          {!!Object.keys(phoneContent).length && (
            <div className={theme.cardholderItem}>
              <ContactCard
                className="contact-card"
                titleLevel={2}
                content={phoneContent}
                Icon={Phone}
              />
            </div>
          )}
          {!!Object.keys(emailContent).length && (
            <div className={theme.cardholderItem}>
              <ContactCard
                className="contact-card"
                titleLevel={2}
                content={emailContent}
                Icon={Email}
              />
            </div>
          )}
          {!!Object.keys(contactFormCardContent).length && (
            <div className={theme.cardholderItem}>
              <ContactCard
                className={cx(theme.cardStretch, 'card')}
                titleLevel={2}
                content={contactFormCardContent}
                Icon={MapMarker}
              />
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ContactUsPage;
export interface ContactUsPageProps {
  pageContext: {
    page: AppContent.Page;
  };
  location: WindowLocation;
}

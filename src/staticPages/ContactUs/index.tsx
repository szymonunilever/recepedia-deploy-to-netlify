import React from 'react';
import cx from 'classnames';
import SEO from 'src/components/Seo';
import { findPageComponentContent } from 'src/utils';
import DigitalData from '../../../integrations/DigitalData';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/lib/components/Card';
import { TagName, Text } from '../../components/lib/components/Text';
import theme from './ContactUs.module.scss';
import Phone from 'src/svgs/inline/phone.svg';
import MapMarker from 'src/svgs/inline/map-marker.svg';
import { WindowLocation } from '@reach/router';

const ContactUsPage = ({ pageContext, location }: ContactUsPageProps) => {
  const {
    page: { seo, components, type },
  } = pageContext;
  return (
    <Layout>
      <SEO {...seo} canonical={location.href} />
      <DigitalData title={seo.title} type={type} />
      <section className={theme.contactUs}>
        <div className="container">
          <Text
            tag={TagName['h1']}
            text={
              findPageComponentContent(components, 'Text', 'PageTitle').text
            }
          />
          <Text
            tag={TagName.p}
            text={
              findPageComponentContent(components, 'Text', 'Description').text
            }
          />
          <div className={theme.cardholder}>
            <div className={theme.cardholderItem}>
              <Card
                className="card"
                titleLevel={2}
                content={findPageComponentContent(components, 'Card', 'Phone')}
                Icon={Phone}
              />

              <Card
                className="card"
                titleLevel={2}
                content={findPageComponentContent(
                  components,
                  'Card',
                  'Address'
                )}
                Icon={MapMarker}
              />
            </div>
            <div className={theme.cardholderItem}>
              <Card
                className={cx(theme.cardStretch, 'card')}
                titleLevel={2}
                content={findPageComponentContent(
                  components,
                  'Card',
                  'Contact'
                )}
                Icon={MapMarker}
              />
            </div>
          </div>
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

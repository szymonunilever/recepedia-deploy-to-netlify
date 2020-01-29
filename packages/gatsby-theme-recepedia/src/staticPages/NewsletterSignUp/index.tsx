import React, { useState, useEffect, useCallback } from 'react';
import Layout from 'src/components/Layout/Layout';
import SEO from 'src/components/Seo';
import DigitalData from '../../../integrations/DigitalData';
import { WindowLocation } from '@reach/router';
import '../../scss/pages/_newsletterSignUp.scss';
import { isBrowser, findPageComponentContent } from 'src/utils';
import { TagName, Text } from 'gatsby-awd-components/src/components/Text';

const GIGYA_SCRIPT_SRC = `${process.env['gigya_script_src']}?apiKey=${process.env['gigya_script_api_key']}&lang=${process.env['gigya_script_lang']}`;

const NewsletterSignupPage: React.FunctionComponent<NewsletterSignupPageProps> = ({
  pageContext,
  location,
}) => {
  const {
    page: { seo, type, components },
  } = pageContext;

  const [configScriptLoaded, setConfigScriptLoaded] = useState<boolean | null>(
    null
  );
  const isGigyaLoaded = () =>
    // @ts-ignore
    isBrowser() && window.gigya && window.gigya.isGigya && window.gigya.isReady;

  const onAfterSubmit = useCallback(eventObject => {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const gigyaCheck = setInterval(() => {
      if (isGigyaLoaded() && !configScriptLoaded) {
        clearInterval(gigyaCheck);
        // @ts-ignore
        window.gigya.accounts.showScreenSet({
          screenSet: process.env['newsletter_signUp_screenset_name'],
          containerID: 'gigya-newsletter-screenset',
          onAfterSubmit: onAfterSubmit,
        });
      }
    }, 300);
    return () => clearInterval(gigyaCheck);
  }, []);

  return (
    <Layout showNewsletterForm={false}>
      <SEO
        {...seo}
        canonical={location.href}
        onChangeClientState={newState => {
          const gigyaConfigScriptObject = newState.scriptTags.find(
            ({ id }: { id: string }) => id === 'gigya-config-script'
          );

          if (gigyaConfigScriptObject && !configScriptLoaded && isBrowser()) {
            const gigyaConfigScript = Array.from(window.document.scripts).find(
              ({ id }) => id === 'gigya-config-script'
            );

            if (gigyaConfigScript) {
              gigyaConfigScript.onload = () => {
                setConfigScriptLoaded(true);
              };
            }
          }
        }}
      >
        {!isGigyaLoaded() && [
          <script
            type="text/javascript"
            src={GIGYA_SCRIPT_SRC}
            id="gigya-config-script"
            key="gigya-config-script"
          />,
        ]}
      </SEO>
      <DigitalData title={seo.title} type={type} />
      <section className="gigya-content">
        <div className="container">
          <div
            className="gy-ui-screen-set"
            data-screen-set={process.env['newsletter_signUp_screenset_name']}
            id="gigya-newsletter-screenset"
          >
            <Text
              text={
                findPageComponentContent(
                  components,
                  'Text',
                  'Loading screenset placeholder'
                ).text
              }
              tag={TagName.h2}
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};
export interface NewsletterSignupPageProps {
  pageContext: {
    page: AppContent.Page;
  };
  location: WindowLocation;
}

export default NewsletterSignupPage;

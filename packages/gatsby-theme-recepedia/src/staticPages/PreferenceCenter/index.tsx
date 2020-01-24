import React from 'react';
import Layout from 'src/components/Layout/Layout';
import SEO from 'src/components/Seo';
import { WindowLocation } from '@reach/router';
import DigitalData from '../../../integrations/DigitalData';
import '../../scss/pages/_preferenceCenter.scss';

const PreferenceCenterPage: React.FunctionComponent<PreferenceCenterPageProps> = ({
  pageContext,
  location,
}) => {
  const {
    page: { seo, type },
  } = pageContext;

  const GIGYA_SCRIPT_SRC = `${process.env['gigya_script_src']}?apiKey=${process.env['gigya_script_api_key']}&lang=${process.env['gigya_script_lang']}`;

  return (
    <Layout>
      <SEO {...seo} canonical={location.href}>
        <script type="text/javascript" src={GIGYA_SCRIPT_SRC} />
        <script type="text/javascript" src={process.env['gigya_script_src2']} />
      </SEO>
      <DigitalData title={seo.title} type={type} />
      <section className="gigya-content">
        <div className="container">
          <div
            className="gy-ui-screen-set"
            data-screen-set={process.env['preference_center_screenset_name']}
          />
        </div>
      </section>
    </Layout>
  );
};
export interface PreferenceCenterPageProps {
  pageContext: {
    page: AppContent.Page;
  };
  location: WindowLocation;
}

export default PreferenceCenterPage;

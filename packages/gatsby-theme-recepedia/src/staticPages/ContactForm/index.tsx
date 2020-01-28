import React, { useState } from 'react';
import cx from 'classnames';
import SEO from 'src/components/Seo';
import { findPageComponentContent } from 'src/utils';
import DigitalData from '../../../integrations/DigitalData';
import ReCaptchaInit from '../../../integrations/RecaptchaV3';
import Layout from '../../components/Layout/Layout';
import theme from './/ContactForm.module.scss';
import sendForm from 'src/services/transactionalServiceAdapter';
import { WindowLocation } from '@reach/router';
// Component Styles
import '../../scss/pages/_contactForm.scss';
import { navigate } from 'gatsby';
import { getPagePath } from '../../utils/getPagePath';
import Modal from 'gatsby-awd-components/src/components/Modal';
import GeneratedForm from 'gatsby-awd-components/src/components/GeneratedForm';

const ContactFormPage: React.FunctionComponent<ContactFormPageProps> = ({
  pageContext,
  location,
}) => {
  const {
    page: { seo, components, type },
  } = pageContext;
  const contactFormComponent = findPageComponentContent(
    components,
    'GeneratedForm',
    'ContactForm'
  );
  const contactFormSuccessUrl = getPagePath('ContactUsThankYou');
  const { title, formMessages } = contactFormComponent;
  const [modalState, setModalState] = useState({
    isOpen: false,
    text: '',
    className: '',
  });
  const submitHandler = async (values: any) => {
    if (sendForm) {
      try {
        const {
          givenName,
          familyName,
          email,
          phoneNumber,
          formType,
          formUrl,
          locale,
          reCaptchaToken,
          comments,
          inquiryType,
          recipe,
        } = values;

        const contact = {
          givenName,
          familyName,
          email,
          phoneNumbers: [
            {
              value: phoneNumber,
            },
          ],
          languagePref: process.env['dataCapturing_contact_languagePref'],
          country: process.env['dataCapturing_contact_country'],
        };
        const contactUs = {
          product: recipe,
          comments,
          inquiryType: inquiryType.value,
          brand: process.env['dataCapturing_commonProps_brand'],
        };
        const commonProps = {
          brand: process.env['dataCapturing_commonProps_brand'],
          locale,
          formType,
          entity: process.env['contactForm_commonProps_entity'],
          formUrl,
          inquiryTypeDropdown: inquiryType.value,
        };

        const result = await sendForm(
          commonProps,
          { contact, contactUs },
          reCaptchaToken
        );
        // eslint-disable-next-line no-console
        if (result && result.status === 'Ok')
          setModalState({
            isOpen: true,
            text: formMessages && formMessages.confirmSubmitMessage,
            className: cx('contact-form--result', 'success'),
          });
        setTimeout(() => {
          setModalState({ ...modalState, isOpen: false });
          navigate(contactFormSuccessUrl);
        }, 3000);
      } catch (e) {
        setModalState({
          isOpen: true,
          text: e.message,
          className: cx('contact-form--result', 'error'),
        });
        setTimeout(() => {
          setModalState({ ...modalState, isOpen: false });
        }, 3000);
      }
    }
  };
  return (
    <Layout>
      <ReCaptchaInit />
      <SEO {...seo} canonical={location.href} />
      <DigitalData type={type} title={title} />
      <Modal isOpen={modalState.isOpen} className={modalState.className}>
        <div>{modalState.text}</div>
      </Modal>
      <section className={theme.contactForm}>
        <GeneratedForm
          className={cx(theme.contactGeneratedForm, 'wrapper')}
          onSubmit={submitHandler}
          content={contactFormComponent}
          recaptchaKey={process.env['ReCaptcha_clientKey']}
          shouldValidate
          titleLevel={1}
        />
      </section>
    </Layout>
  );
};

export default ContactFormPage;

export interface ContactFormPageProps {
  pageContext: {
    page: AppContent.Page;
  };
  location: WindowLocation;
}

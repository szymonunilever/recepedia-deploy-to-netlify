import React, { useState } from 'react';
import cx from 'classnames';
import SEO from 'src/components/Seo';
import { findPageComponentContent } from 'src/utils';
import DigitalData from '../../../integrations/DigitalData';
import Layout from '../../components/Layout/Layout';
import { GeneratedForm, Modal } from 'src/components/lib';
import theme from './/ContactForm.module.scss';
import sendForm from 'src/services/form.service';
import { WindowLocation } from '@reach/router';
// Component Styles
import '../../scss/pages/_contactForm.scss';
import { navigate } from 'gatsby';

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
  const { title, formMessages } = contactFormComponent;
  const [modalState, setModalState] = useState({
    isOpen: false,
    text: '',
    className: '',
  });
  const submitHandler = async (values: object) => {
    if (sendForm) {
      try {
        const result = await sendForm(values);
        // eslint-disable-next-line no-console
        if (result && result.status === 'Ok')
          setModalState({
            isOpen: true,
            text: formMessages && formMessages.confirmSubmitMessage,
            className: cx('contact-form--result', 'success'),
          });
        setTimeout(() => {
          setModalState({ ...modalState, isOpen: false });
          navigate('/obrigado');
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

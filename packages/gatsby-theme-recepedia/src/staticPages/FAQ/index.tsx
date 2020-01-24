import React from 'react';
import {
  Accordion,
  AccordionTitle,
  RichText,
  TagName,
  Text,
  iconNormalize,
  Icon,
} from 'gatsby-awd-components/src';
import { findPageComponentContent } from 'src/utils';
import Layout from 'src/components/Layout/Layout';
import SEO from 'src/components/Seo';
import { WindowLocation } from '@reach/router';
import DigitalData from '../../../integrations/DigitalData';
import '../../scss/pages/_default.scss';
import theme from './FAQ.module.scss';
import cx from 'classnames';
import { ReactComponent as ArrowDownIcon } from 'src/svgs/inline/arrow-down.svg';

import { ReactComponent as RecepediaLogoIcon } from '../../svgs/inline/logo.svg';
import { ReactComponent as KnorrLogoIcon } from '../../svgs/inline/logo-knorr.svg';
import { ReactComponent as HellmannsLogoIcon } from '../../svgs/inline/logo-hellmanns-filled.svg';
import { ReactComponent as MaizenaLogoIcon } from '../../svgs/inline/logo-maizena.svg';

const FAQPage = ({
  pageContext: {
    page: { seo, components, type },
  },
  location,
}: FAQPageProps) => {
  const brandLogo: { [key: string]: Icon } = {
    recepedia: RecepediaLogoIcon,
    knorr: KnorrLogoIcon,
    hellmanns: HellmannsLogoIcon,
    maizena: MaizenaLogoIcon,
  };
  const faqs = findPageComponentContent(components, 'FAQs');
  const getQuestions = (faqs: FAQsProps) =>
    faqs.questions.map((item: FAQProps, i: number) => {
      const accordionTitle =
        typeof item.question.logo === 'string'
          ? {
              ...item.question,
              logo: iconNormalize(brandLogo[item.question.logo]),
            }
          : item.question;
      return (
        <li className={theme.faq__listItem} key={i}>
          <Accordion
            title={accordionTitle}
            isOpen={false}
            className={cx(theme.faq__question, 'faq__question')}
            Icon={ArrowDownIcon}
          >
            {Object.prototype.hasOwnProperty.call(item.answer, 'questions') ? (
              <ul className={cx(theme.faq__list, theme.faq__sublist)}>
                {getQuestions(item.answer as FAQsProps)}
              </ul>
            ) : (
              <RichText
                content={item.answer as AppContent.RichTextContent}
                className={theme.faq__answer}
              />
            )}
          </Accordion>
        </li>
      );
    });
  return (
    <Layout>
      <SEO {...seo} canonical={location.href} />
      <DigitalData title={seo.title} type={type} />
      <section className={cx(theme.faq)}>
        <Text
          className={theme.faq__title}
          tag={TagName.h1}
          text={findPageComponentContent(components, 'Text', 'Title').text}
        />
        <ul className={theme.faq__list}>{getQuestions(faqs)}</ul>
      </section>
    </Layout>
  );
};

export default FAQPage;

interface FAQPageProps {
  pageContext: {
    page: AppContent.Page;
  };
  location: WindowLocation;
}
interface FAQsProps {
  questions: FAQProps[];
}
interface FAQProps {
  question: AccordionTitle;
  answer: AppContent.RichTextContent | FAQsProps;
}

import React, { ReactNode, useEffect } from 'react';
import { graphql, navigate, useStaticQuery } from 'gatsby';
import { BackToTop } from 'gatsby-awd-components/src/components/BackToTop';
import { BrandSocialChannels } from 'gatsby-awd-components/src/components/BrandSocialChannels';
import { GeneratedForm } from 'gatsby-awd-components/src/components/GeneratedForm';
import { GlobalFooter } from 'gatsby-awd-components/src/components/GlobalFooter';
import UnileverLogoIcon from 'src/svgs/inline/unilever-logo.svg';
import { ReactComponent as ArrowUpIcon } from 'src/svgs/inline/arrow-up.svg';
import { ReactComponent as FacebookIcon } from 'src/svgs/inline/facebook.svg';
import { ReactComponent as InstagramIcon } from 'src/svgs/inline/instagram.svg';
import { ReactComponent as PinterestIcon } from 'src/svgs/inline/pinterest.svg';
import { ReactComponent as TwitterIcon } from 'src/svgs/inline/twitter.svg';
import { ReactComponent as YoutubeIcon } from 'src/svgs/inline/youtube-simple.svg';
import Navigation from '../Navigation/Navigation';
import cx from 'classnames';
import { findPageComponentContent } from 'src/utils';
import smartOutline from 'smart-outline';
import find from 'lodash/find';
import { getPagePath } from '../../utils/getPagePath';
// // Component Styles
// import '../../scss/pages/_layout.scss';

const Layout = ({
  children,
  className,
  showNewsletterForm = true,
}: LayoutProps) => {
  const { allCommonComponent, allCategory } = useStaticQuery(graphql`
    {
      allCommonComponent {
        nodes {
          content
          name
        }
      }
      allCategory(
        filter: { inFooter: { eq: true } }
        sort: { fields: footerOrder, order: ASC }
      ) {
        nodes {
          title
          titleFooter
          inFooter
          footerOrder
          fields {
            slug
          }
        }
      }
    }
  `);

  useEffect(() => {
    smartOutline.init();
  }, []);
  const componentNodes = allCommonComponent.nodes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentNodes.forEach((component: any) => {
    component.content =
      typeof component.content === 'string'
        ? JSON.parse(component.content)
        : component.content;
  });
  const components = { items: componentNodes };

  const footerCategoryLinks: AppContent.GlobalFooter.MenuItem[] = allCategory.nodes.map(
    (category: Partial<Internal.Category>) => ({
      path: category.fields && category.fields.slug,
      name: category.titleFooter || category.title,
    })
  );

  const footerNavLists: AppContent.GlobalFooter.Content = findPageComponentContent(
    components,
    'GlobalFooter'
  );
  const footerCategoryList: AppContent.GlobalFooter.MenuList = {
    items: footerCategoryLinks,
  };

  const categoryLinksInFooter = find(footerNavLists.lists, footerCategoryList);

  if (!categoryLinksInFooter) {
    footerNavLists.lists.unshift(footerCategoryList);
  }
  const newsletterSignUpUrl = getPagePath('NewsletterSignUp');
  // eslint-disable-next-line no-console
  const onSignUpCallback = () => {
    navigate(newsletterSignUpUrl);
  };

  // @ts-ignore
  return (
    <div className={cx('global-container', className)}>
      <BackToTop content={{}} Icon={ArrowUpIcon} />
      <a className="skip-to-content" href="#content">
        Skip To Content
      </a>
      <Navigation
        navigationContent={
          findPageComponentContent(
            components,
            'GlobalNavigation'
          ) as AppContent.GlobalNavigation.Content
        }
        searchContent={
          findPageComponentContent(
            components,
            'SearchInput'
          ) as AppContent.SearchInput.Content
        }
        profileContent={
          findPageComponentContent(
            components,
            'Profile'
          ) as AppContent.ProfileHeader.Content
        }
      />
      <main id="content">{children}</main>
      {showNewsletterForm && (
        <GeneratedForm
          shouldValidate={false}
          onSubmit={onSignUpCallback}
          recaptchaAction="SignUpEmail"
          content={findPageComponentContent(components, 'Form', 'SignUpForm')}
          className="general-signup"
        />
      )}
      <GlobalFooter logoIcon={<UnileverLogoIcon />} content={footerNavLists}>
        <BrandSocialChannels
          content={findPageComponentContent(components, 'BrandSocialChannels')}
          listIcons={{
            twitter: <TwitterIcon />,
            facebook: <FacebookIcon />,
            instagram: <InstagramIcon />,
            pinterest: <PinterestIcon />,
            youtube: <YoutubeIcon />,
          }}
        />
      </GlobalFooter>
    </div>
  );
};

export default Layout;

interface LayoutProps {
  location?: Location;
  title?: string;
  children?: ReactNode | ReactNode[];
  className?: string;
  showNewsletterForm?: boolean;
}

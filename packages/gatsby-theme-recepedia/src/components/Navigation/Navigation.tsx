import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import { ReactComponent as ButtonCloseIcon } from 'src/svgs/inline/x-mark.svg';
import { GlobalNavigation } from 'gatsby-awd-components/src/components/GlobalNavigation';
import { ReactComponent as LogoIcon } from 'src/svgs/inline/logo.svg';
import { ReactComponent as ArrowDownIcon } from 'src/svgs/inline/arrow-down.svg';
import GlobalSearch from 'src/components/Search/GlobalSearch';
import { constructMenu } from './utils';
import { ReactComponent as ProfileIcon } from 'src/svgs/inline/profile.svg';
import { getPagePath } from '../../utils/getPagePath';

interface NavigationProps {
  navigationContent: AppContent.GlobalNavigation.Content;
  searchContent: AppContent.SearchInput.Content;
  profileContent: AppContent.ProfileHeader.Content;
}

const Navigation: React.FunctionComponent<NavigationProps> = ({
  navigationContent,
  searchContent,
  profileContent,
}) => {
  const data = useStaticQuery(graphql`
    {
      allCategory(
        filter: { parent: { id: { eq: null } }, inNavigation: { eq: true } }
        sort: { order: ASC, fields: categoryOrder }
      ) {
        nodes {
          ...CategoryNavigationFields
        }
      }
    }
  `);

  const categories = data.allCategory.nodes;
  const menuItems = constructMenu(categories, navigationContent);
  const userProfilePath = getPagePath('UserProfile');
  return (
    <GlobalNavigation
      logo={{
        icon: <LogoIcon className="main-logo__icon" />,
        path: '/',
      }}
      dropDownIcon={<ArrowDownIcon className="dropdown-icon" />}
      buttonCloseIcon={ButtonCloseIcon}
      content={{ list: menuItems }}
      isAccordion
    >
      <Link className="global-navigation__profile" to={userProfilePath}>
        {<ProfileIcon />}
        {profileContent.title}
      </Link>
      <GlobalSearch searchContent={searchContent} />
    </GlobalNavigation>
  );
};

export default Navigation;

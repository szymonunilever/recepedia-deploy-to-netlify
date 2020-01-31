import cx from 'classnames';
import React from 'react';
import { BrandLogoProps } from './models';
import { graphql, Link, useStaticQuery } from 'gatsby';
import { getBrandLogo } from './getBrandLogo';
import theme from './BrandLogo.module.scss';

export const BrandLogo = ({
  className,
  brand,
  linkTo,
  isExternal = false,
}: BrandLogoProps) => {
  const locale = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          lang
        }
      }
    }
  `).site.siteMetadata.lang;
  brand = locale === 'es-MX' ? brand : undefined;
  const classWrapper = cx(theme.brandLogo, linkTo && theme.brandLogoClickable, className, 'brand-logo');
  const currentBrand = brand && getBrandLogo(brand);
  const LinkComponent: any = isExternal ? 'a' : Link;
  const linkProps: any = {'aria-label': brand };
  if (isExternal) {
    linkProps[ 'href' ] = linkTo;
    linkProps[ 'target' ] = '_blank';
    linkProps[ 'rel' ] = 'noopener noreferrer';
  } else {
    linkProps[ 'to' ] = linkTo;
  }

  return currentBrand ? (
    <LinkComponent {...linkProps} className={classWrapper}>
      {currentBrand}
    </LinkComponent>
  ) : null;
};

export default BrandLogo;

import cx from 'classnames';
import React from 'react';
import { BrandLogoProps } from './models';
import { Link } from 'gatsby';
import { getBrandLogo } from './getBrandLogo';
import theme from './BrandLogo.module.scss';

export const BrandLogo = ({
  className,
  brandTheme,
  linkTo,
  isExternal = false,
}: BrandLogoProps) => {
  const classWrapper = cx(
    theme.brandLogo,
    linkTo && theme.brandLogoClickable,
    className,
    'brand-logo'
  );
  const currentBrand = brandTheme && getBrandLogo(brandTheme);
  const LinkComponent: any = isExternal ? 'a' : Link;
  const linkProps: any = { 'aria-label': brandTheme };
  if (isExternal) {
    linkProps['href'] = linkTo;
    linkProps['target'] = '_blank';
    linkProps['rel'] = 'noopener noreferrer';
  } else {
    linkProps['to'] = linkTo;
  }

  return currentBrand ? (
    <LinkComponent {...linkProps} className={classWrapper}>
      {currentBrand}
    </LinkComponent>
  ) : null;
};

export default BrandLogo;

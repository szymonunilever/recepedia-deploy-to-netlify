import cx from 'classnames';
import { Link } from 'gatsby';
import React, { FunctionComponent } from 'react';
import theme from '../RecipeCard/RecipeCard.module.scss';
import { CardLinkWrapperProps } from './models';

export const CardLinkWrapper:FunctionComponent<CardLinkWrapperProps> = ({
  isExternal,
  className,
  title,
  children,
  slug,
  cardKey,
  ...props
}) => {
  const wrapClasses = cx(theme.recipeCard, 'recipe-card', className);
  const LinkComponent: any = isExternal ? 'a' : Link;
  const linkProps = {'aria-label' : title, ...props};
  if (isExternal) {
    linkProps[ 'href' ] = props.href || slug;
    linkProps[ 'target' ] = props.target || '_blank';
    linkProps[ 'rel' ] = props.rel || 'noopener noreferrer';
  } else {
    linkProps[ 'to' ] = props.to || props.href || slug;
  }

  return <LinkComponent  {...linkProps} className={wrapClasses}>
    {children}
  </LinkComponent>
};

export default CardLinkWrapper;

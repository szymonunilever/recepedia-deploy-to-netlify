import React, { FunctionComponent } from 'react';
import cx from 'classnames';
import { getComponentDataAttrs } from '../../utils';
import { CardProps } from '../Card';
import { CardLinkWrapperProps } from '../CardLinkWrapper';
import { RecipeAddPlaceholderProps } from '../RecipeListing/partials/models';
import { TagName, Text } from '../Text';
import theme from './Listing.module.scss';
import { ListingProps } from './models';

export const Listing: FunctionComponent<ListingProps> = ({className, content, children, titleLevel = 1}) => {
  const {title} = content;
  const list = children && React.Children.map(children, (child,i) => {
    if(React.isValidElement<CardProps|CardLinkWrapperProps|RecipeAddPlaceholderProps>(child)){
        return <li key={child.props.cardKey}
                   className={cx(theme.listing__item, 'listing__item')}>
          {child}
        </li>
      }
  });
  const listHeader = title ? (
    <Text
      className={cx(theme.recipeList__header, 'recipe-list__header')}
      // @ts-ignore
      tag={TagName[ `h${titleLevel}` ]}
      text={title}
    />
  ) : null;

  return <div {...getComponentDataAttrs('listing', content)}>
    {listHeader}
    <ul className={cx(theme.listing__list, 'listing-list', className)}>
      {list}
    </ul>
  </div>
};
export default Listing;

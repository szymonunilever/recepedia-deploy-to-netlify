import React, { FunctionComponent, memo } from 'react';
import cx from 'classnames';
import { iconNormalize } from '../../utils';
import Attribute from './partials/Attribute';
import compact from 'lodash/compact';
import { RecipeDietaryAttributesProps } from './models';
import getComponentDataAttrs from '../../utils/getComponentDataAttrs';
import theme from './RecipeDietaryAttributes.module.scss';
import {Link} from 'gatsby';

const RecipeDietaryAttributes: FunctionComponent<RecipeDietaryAttributesProps> = ({
  attributes,
  activeAttributes,
  icons,
  infoIcon,
  className,
  showInactiveAttributes = false,
  categoryLinksMap,
}) => {
  const classNames = cx(
    theme.recipeDietaryAttributes,
    'recipe-dietary-attributes',
    className
  );
  const activeIds = activeAttributes.map(attr => attr.id);
  const activeTags = compact(
    activeAttributes.map(activeAttr =>
      attributes.find(attr => attr.tagId === activeAttr.id)
    )
  );
  const inactiveTags = attributes.filter(
    attr => !activeIds.includes(attr.tagId)
  );
  const mapIcons = (attributes: Internal.Tag[], inActive: boolean = false) =>
    Object.entries(icons).map(([key,icon]) => {
      const attr =
        attributes && attributes.find(attr => attr.tagId === parseInt(key));
      const check = inActive ? icon.inActive : true;
      if (attr && check) {
        const attributeComponent = (
          <Attribute
            infoIcon={infoIcon}
            key={attr.tagId}
            tag={attr}
            icon={inActive
              ? iconNormalize(icon.inActive)
              : iconNormalize(icon.active)}
          />
        );
        return (
          <li key={attr.tagId}
            aria-describedby={`${attr.tagId}`}
            className={cx(
              theme.recipeDietaryAttributes__item,
              'recipe-dietary-attributes__item'
            )}
          >
            {categoryLinksMap && categoryLinksMap[`${attr.tagId}`]
              ? (
                  <Link to={categoryLinksMap[attr.tagId]}>
                    {attributeComponent}
                  </Link>
              )
              : (attributeComponent)
            }
          </li>
        );
      }
    });
  const attrWillShowActive = mapIcons(activeTags);
  const attrWillShowInActive = mapIcons(inactiveTags, true);
  return (
    <>
      {attrWillShowActive.length || showInactiveAttributes ? (
        <div
          className={classNames}
          {...getComponentDataAttrs('recipe-dietary-attributes')}
        >
          <ul
            className={cx(
              theme.recipeDietaryAttributes__list,
              'recipe-dietary-attributes__list'
            )}
          >
            {attrWillShowActive}
            {showInactiveAttributes && attrWillShowInActive}
          </ul>
        </div>
      ) : (
        <p>No attributes</p>
      )}
    </>
  );
};

export default memo(RecipeDietaryAttributes);

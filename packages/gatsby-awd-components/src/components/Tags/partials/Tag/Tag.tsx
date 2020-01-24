import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';
import { TagProps, TagVariant } from '../../models';
import { Button, ButtonViewType } from '../../../Button';
import cx from 'classnames';
import theme from './Tag.module.scss';

const Tag = ({
  tag,
  handleClick,
  RemoveIcon,
  active = false,
  enableExternalManage = false,
  handleToggle,
  variant,
}: TagProps) => {
  const [state, setState] = useState(active);
  const {
    title,
    fields: { slug: path },
  } = tag;
  const classWrapper = cx(theme.tags__item, 'tags__item', {
    'for-filter': variant === TagVariant.toggle,
  });
  const onButtonClick = () => {
    handleClick(tag);
  };

  const onTagClick = (selected: boolean) => {
    setState(selected);
    if (handleToggle) {
      handleToggle({ tag, state: selected });
    }
  };
  useEffect(() => {
    if (enableExternalManage && state !== active) {
      setState(active);
    }
  }, []);

  let view;
  switch (variant) {
    case TagVariant.toggle:
      view = (
        <Button
          className={cx(theme.tags__toggle, 'tags__toggle')}
          onClick={onTagClick}
          content={{ label: title }}
          isSelected={state}
          isToggle={true}
        />
      );
      break;
    case TagVariant.link:
      view = (
        <Link className={cx(theme.tags__link, 'tags__link')} to={path}>
          <span>{title}</span>
        </Link>
      );
      break;
    case TagVariant.removable:
      view = (
        <div
          className={cx(theme.tags__removable, 'tags__removable')}
          tabIndex={0}
        >
          <span>{title}</span>
          <Button
            className={cx(
              theme.tags__removableButton,
              'tags__removable--button'
            )}
            onClick={onButtonClick}
            isSelected={state}
            Icon={RemoveIcon}
          />
        </div>
      );

      break;
    default:
  }

  return <li className={classWrapper}>{view}</li>;
};

export default Tag;

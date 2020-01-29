import React, { FunctionComponent, useEffect, useState } from 'react';
import { Text, TagName } from 'gatsby-awd-components/src/components/Text';
import { LookByCategoryProps } from './models';
import theme from './LookByCategory.module.scss';
import cx from 'classnames';

export const LookByCategory: FunctionComponent<LookByCategoryProps> = ({
  className,
  categories,
  createChildren,
  title,
  titleLevel = 1,
  renderIteration = 0,
}) => {
  const classWrapper = cx(theme.lookByCategory, 'look-by-category', className);
  const header = title && (
    <Text
      // @ts-ignore */
      tag={TagName[`h${titleLevel}`]}
      text={title}
      className={cx(theme.lookByCategory__title, 'look-by-category__title')}
    />
  );
  const catIds = categories.map((cat: string) => cat.replace(' ', '_'));
  const links = (
    <div className={cx(theme.lookByCategory__links, 'look-by-category__links')}>
      {categories.map((cat, i) => (
        <a
          key={catIds[i] + '_link'}
          href={`#${catIds[i]}`}
          className={cx(theme.lookByCategory__link, 'look-by-category__link')}
        >
          {cat.toLowerCase()}
        </a>
      ))}
    </div>
  );
  const linkedBlocks = categories.map((cat, i) => (
    <div
      key={catIds[i]}
      id={catIds[i]}
      className={cx(theme.lookByCategory__blocks, 'look-by-category__blocks')}
    >
      {createChildren(cat)}
    </div>
  ));
  const [blocks, setBlocks] = useState(linkedBlocks);

  useEffect(() => {
    const linkedBlocks = categories.map((cat, i) => (
      <div
        key={catIds[i]}
        id={catIds[i]}
        className={cx(theme.lookByCategory__blocks, 'look-by-category__blocks')}
      >
        {createChildren(cat)}
      </div>
    ));
    setBlocks(linkedBlocks);
  }, [renderIteration]);

  return (
    <div className={classWrapper}>
      {header}
      {links}
      {blocks}
    </div>
  );
};

export default LookByCategory;

import cx from 'classnames';
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { titleLevel } from "../../models";
import { RecipeCopyProps, RecipeCopyViewType } from './models';
import {
  RecipeCopyDescription,
  RecipeCopyTitle,
  RecipeCopyIngredients,
} from './partials';
import theme from './RecipeCopy.module.scss';
import getComponentDataAttrs from '../../utils/getComponentDataAttrs';

export const RecipeCopy = ({
  className,
  content,
  content: { title, subtitle },
  recipe,
  titleLevel = 1,
  viewType,
}: RecipeCopyProps) => {
  const classWrapper = cx(theme.recipeCopy, className);
  let view: JSX.Element | undefined | null;
  switch (viewType) {
    case RecipeCopyViewType.Title:
      view = <RecipeCopyTitle title={recipe.title} titleLevel={titleLevel} />;
      break;
    case RecipeCopyViewType.Description:
      view = <RecipeCopyDescription description={recipe.description} />;
      break;
    case RecipeCopyViewType.Ingredients:
      view = (
        <RecipeCopyIngredients
          ingredients={recipe.ingredients}
          titleLevel={(titleLevel + 1) as titleLevel}
          title={title}
          subtitle={subtitle}
        />
      );
      break;
  }
  return (
    <div
      className={classWrapper}
      {...getComponentDataAttrs('recipeCopy', content)}
    >
      {view}
    </div>
  );
};

export default RecipeCopy;

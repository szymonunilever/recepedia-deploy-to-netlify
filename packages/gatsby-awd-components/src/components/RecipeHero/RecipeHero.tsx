import React from 'react';
import cx from 'classnames';
import { RecipeHeroProps } from './models';
import theme from './RecipeHero.module.scss';
import AdaptiveImage from '../AdaptiveImage';
import getComponentDataAttrs from '../../utils/getComponentDataAttrs';

const RecipeHero = ({ content, className, imageSizes }: RecipeHeroProps) => {
  const containerStyles = cx(theme.recipeHero, 'recipe-hero', className);
  const imageStyles = cx(theme.recipeHero__image, 'recipe-hero__image');
  const title =
    content.title.split(' ').length > 1
      ? content.title
      : `Receita: ${content.title}`;

  return (
    <div {...getComponentDataAttrs('recipe-hero')} className={containerStyles}>
      <div className={imageStyles}>
        <AdaptiveImage
          localImage={content.localImage}
          sizes={imageSizes}
          alt={title}
          critical
          title={content.imgTitle}
        />
      </div>
    </div>
  );
};

export default RecipeHero;

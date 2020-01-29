import React, { SyntheticEvent, useState, useEffect } from 'react';
import { RatingProps } from './models';
import {
  RatingAndReviewsProvider,
  RatingSummaryTemplate,
} from '../../models';
import cx from 'classnames';
import isBrowser from '../../utils/isBrowser';
import getComponentDataAttrs from '../../utils/getComponentDataAttrs';
import { ReactComponent as RatingIcon } from 'src/svgs/inline/rating.svg';
import theme from './Rating.module.scss';

const Rating = ({
  className,
  id,
  entityType,
  provider,
  averageRating = 0,
  linkTo = '',
}: RatingProps) => {
  // @ts-ignore
  const classNames = cx(
    theme.recipeRating,
    'recipe-rating',
    className,
    provider === RatingAndReviewsProvider.kritique
      ? ''
      : 'recipe-rating--inline'
  );
  const [locationOrigin, setLocationOrigin] = useState('');
  const ratingPercentage = averageRating * 20 + '%';
  const rating = (
    <>
      <div style={{ width: ratingPercentage }}>
        <RatingIcon />
      </div>
      <div>
        <RatingIcon />
      </div>
    </>
  );

  useEffect(() => {
    setLocationOrigin(window.location.origin);
  }, []);
  return (
    <>
      <div className={classNames} {...getComponentDataAttrs('recipe-rating')}>
        {provider === RatingAndReviewsProvider.kritique ? (
          <div
            className="rr-widget-container rr-container"
            data-summary-template={RatingSummaryTemplate.inline01}
            data-entity-type={entityType}
            data-unique-id={id}
            data-entity-url={isBrowser() && `${locationOrigin}/${linkTo}`}
            data-category-pageurl={isBrowser() && `${locationOrigin}/recipes`}
            onClick={(e: SyntheticEvent) => {
              e.stopPropagation();
            }}
          />
        ) : provider === RatingAndReviewsProvider.inline ? (
          rating
        ) : null}
      </div>
    </>
  );
};

export default Rating;

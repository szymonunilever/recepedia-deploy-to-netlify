import { RatingAndReviewsProvider, RatingAndReviewsEntityType } from '../../models';

export interface RatingProps {
  provider: RatingAndReviewsProvider;
  className?: string;
  linkTo?: string;
  id: number | string;
  entityType: RatingAndReviewsEntityType;
  averageRating?: number;
}

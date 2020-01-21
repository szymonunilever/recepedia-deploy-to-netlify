import { RatingAndReviewsProvider, RatingAndReviewsEntityType } from "../../models";

export interface ReviewsProps {
  provider: RatingAndReviewsProvider;
  className?: string;
  linkTo?: string;
  id: number | string;
  entityType: RatingAndReviewsEntityType
}

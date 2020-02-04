export const isKritiqueLoaded = entity =>
  typeof window.RRjQueryRef !== 'undefined' &&
  typeof window.ratingReview !== 'undefined' &&
  window.ratingReview.widget &&
  window.ratingReview.widget.openWriteReviews &&
  window.ratingReview[entity] &&
  window.ratingReview[entity].config &&
  window.ratingReview[entity].contents &&
  window.RRjQueryRef('.rr-widget-container').length;

export const openReviewModal = () =>
  window.ratingReview.widget.openWriteReviews(
    window.RRjQueryRef('.rr-widget-container')
  );

export const getOnChangeClientStateCallback = (scriptSrc, callback) => {
  return (newState: any, addedTags: any) => {
    if (addedTags && addedTags.scriptTags) {
      const foundScript = addedTags.scriptTags.find(
        ({ src }) => src === scriptSrc
      );
      if (foundScript) {
        foundScript.addEventListener('load', callback, {
          once: true,
        });
      }
    }
  };
};

export const kritiqueWidgetSrc = `${process.env['kritique_url']}?brandid=${process.env['kritique_brandId']}&localeid=${process.env['kritique_localeId']}&apikey=${process.env['kritique_apiKey']}&sitesource=${process.env['kritique_siteSource']}`;

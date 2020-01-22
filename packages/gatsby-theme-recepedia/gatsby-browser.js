import React from 'react';
// polyfill for IE
import 'url-search-params-polyfill';
import 'whatwg-fetch';

import 'typeface-rubik';

import { startTracking } from './src/tracking';
import { LinkTracking } from './src/tracking/LinkTracking';
import { pageViewTracking } from './src/tracking/page-view-tracking';
import Helmet from 'react-helmet';

// uncomment if WPT FPL need to be improved
// export const disableCorePrefetching = () => true;

export const onClientEntry = startTracking;

export const wrapPageElement = ({ element, props }) => {
  if (props.pageContext.recipe || props.pageContext.product) {
    const kritiqueWidgetSrc = `${process.env['kritique_url']}?brandid=${
      process.env['kritique_brandId']
    }&localeid=${process.env['kritique_localeId']}&apikey=${
      process.env['kritique_apiKey']
    }&sitesource=${process.env['kritique_siteSource']}`;

    let entityType = '';
    let id = 0;

    if (props.pageContext.product) {
      entityType = 'product';
      id = props.pageContext.product.productId;
    } else {
      id = props.pageContext.recipe.recipeId;
    }

    return (
      <>
        <Helmet
          script={[
            {
              id: `rr-widget-${entityType}-${id}`,
              src: kritiqueWidgetSrc,
              async: true,
            },
          ]}
        />
        <LinkTracking>{element}</LinkTracking>
      </>
    );
  } else {
    return <LinkTracking>{element}</LinkTracking>;
  }
};

export const onRouteUpdate = pageViewTracking;

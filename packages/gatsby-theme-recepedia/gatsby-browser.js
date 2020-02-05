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
export const disableCorePrefetching = () => true;

export const onClientEntry = startTracking;

export const wrapPageElement = ({ element }) => {
  return <LinkTracking>{element}</LinkTracking>;
};

export const onRouteUpdate = pageViewTracking;

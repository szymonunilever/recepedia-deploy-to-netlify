import React, { useEffect } from 'react';

import { pushEvent } from './';
import { ctConstants } from './ct-constants';

export const LinkTracking = ({ children }) => {
  useEffect(() => {
    setTimeout(() => {
      const anchors = document.getElementsByTagName('a');

      for (let index = 0; index < anchors.length; index++) {
        anchors[index].addEventListener('click', ev => {
          if (ev) {
            // Find anchor tag in hierachy
            const clickedLink = ev.path.find(tag => tag.tagName === 'A');

            const text =
              clickedLink.innerText === ''
                ? clickedLink.getAttribute('aria-label')
                : clickedLink.innerText;

            pushEvent({
              category: {
                primaryCategory: ctConstants.custom,
              },
              eventInfo: {
                type: ctConstants.trackEvent,
                eventAction: ctConstants.linkClick,
                eventLabel: `${text}-${clickedLink.getAttribute('href')}`,
                eventValue: 1,
              },
            });
          }
        });
      }
    }, 300);
    // Slight delay added to facilitate dynamic elements of page
  }, []);
  return <>{children}</>;
};

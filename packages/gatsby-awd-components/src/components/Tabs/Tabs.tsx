import React, { useState, useEffect } from 'react';
import { TabsProps, HeaderContent } from './models';
import theme from './Tabs.module.scss';
import cx from 'classnames';
import Button, { ButtonViewType } from '../Button';
import { Tab } from './partials';
import { TagName, Text } from '../Text';
import get from 'lodash/get';
import getComponentDataAttrs from '../../utils/getComponentDataAttrs';

export const Tabs = ({
  className,
  content,
  content: { tabs },
  children = [],
  // @ts-ignore
  tabsHeaderContent,
  titleLevel = 2,
  tabFromLocation = false,
  location,
  data,
  dataFetched,
}: TabsProps) => {
  const classWrapper = cx(theme.tabs, className);
  const [active, setActive] = useState<string>(tabs[0].view);
  useEffect(() => {
    const activeTab = tabFromLocation
      ? location &&
        (location.search
          ? new URLSearchParams(location.search).get('tabOpen')
          : tabs[0].view)
      : tabs[0].view;
    setActive(activeTab as string);
  }, [location]);
  useEffect(() => {
    dataFetched
      ? !tabs.filter(tab => tab.view === active && tab.resultsCount).length &&
        setActive(tabs[0].view)
      : setActive(tabs[0].view);
  }, [tabs, dataFetched]);
  let tabItems: JSX.Element[], tabsContents: JSX.Element[];
  tabsContents = children.reduce(
    (accum, child) => {
      if (
        typeof child.props.visible === 'undefined' ||
        child.props.visible === true
      ) {
        const tab = (
          <Tab
            key={child.props.view}
            active={active === child.props.view}
            attributes={
              active === child.props.view
                ? {
                    role: 'tabpanel',
                    'aria-labelledby': `${child.props.view}`,
                    id: `${child.props.view}__tab`,
                  }
                : {
                    role: 'tabpanel',
                    'aria-labelledby': `${child.props.view}`,
                    id: `${child.props.view}__tab`,
                  }
            }
            {...child.props}
          >
            {child.props.children}
          </Tab>
        );
        return [...accum, tab];
      }
      return [...accum];
    },
    [] as JSX.Element[]
  );
  tabItems = tabs.reduce(
    (accum, tab) => {
      if (tabsContents.find(item => item.props.view === tab.view)) {
        const hasResultCount = typeof tab.resultsCount !== 'undefined';

        const tabItem = (
          <Button
            key={tab.view}
            className={cx(theme.tabs__button, 'tabs__button')}
            isToggle
            isDisabled={hasResultCount && !tab.resultsCount}
            role="tab"
            isSelected={active === tab.view}
            onClick={() => setActive(tab.view)}
            viewType={ButtonViewType.icon}
            attributes={
              active === tab.view
                ? {
                    'aria-controls': `${tab.view}__tab`,
                    id: `${tab.view}`,
                  }
                : {
                    'aria-controls': `${tab.view}__tab`,
                    id: `${tab.view}`,
                  }
            }
          >
            {tab.title}
            {hasResultCount ? ` (${tab.resultsCount})` : null}
          </Button>
        );
        return [...accum, tabItem];
      }
      return [...accum];
    },
    [] as JSX.Element[]
  );

  const headerInfo =
    tabsHeaderContent &&
    tabsHeaderContent.contents.find((item: HeaderContent) => {
      return active === item.view;
    });

  let subheading = get(
    get(children.find(child => child.props.view === active), 'props', {}),
    'hasContent',
    {}
  )
    ? get(headerInfo, 'subheading', '')
    : '';

  const processData = (input: string): string => {
    let processed = input;
    data &&
      data.forEach(item => {
        if (processed.includes(item.pattern)) {
          // @ts-ignore
          processed = processed.replace(item.pattern, item.replacement);
        }
      });
    return processed || '';
  };

  return (
    <div className={classWrapper} {...getComponentDataAttrs('tabs', content)}>
      {headerInfo && (
        <div className={cx(theme.tabsHeader, 'tabs-header')}>
          <div
            className={cx(theme.tabsHeader__heading, 'tabs-header__heading')}
          >
            <Text
              // @ts-ignore
              tag={TagName[`h${titleLevel}`]}
              text={processData(headerInfo.heading)}
            />
          </div>
          <div
            className={cx(
              theme.tabsHeader__headingSubheading,
              'tabs-header__heading-subheading'
            )}
          >
            <Text
              // @ts-ignore
              tag={TagName[`h${titleLevel + 1}`]}
              text={processData(subheading)}
            />
          </div>
        </div>
      )}
      <div role="tablist" className={cx(theme.tabs__buttons, 'tabs__buttons')}>
        {tabItems}
      </div>
      <div className={cx(theme.tabs__items, 'tabs__items')}>{tabsContents}</div>
    </div>
  );
};

export default Tabs;

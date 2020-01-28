import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import theme from './FilterSettings.module.scss';
import Tags, { TagToggleHandler, TagVariant, TagViewType } from "../../Tags";
import { FilterSettingsProps } from "..";
import Accordion from "../../Accordion";
import Button from "../../Button";

const FilterSettings = ({
  allFilters,
  selectedTags,
  onFilterChange,
  className,
  icons,
  content: { filtersPanel },
}: FilterSettingsProps) => {
  const classWrapper = cx(theme.filterSettings, 'filter-settings', className);
  const [filteredTags, setFilteredTags] = useState<Internal.Tag[]>([]);

  useEffect(() => {
    setFilteredTags(selectedTags)
  }, [selectedTags]);

  const onToggleFilter = (val: TagToggleHandler) => {
    const filters = [...filteredTags];
    if (val.state) {
      filters.push(val.tag);
    } else if (filters.length > 0) {
      filters.splice(filters.findIndex((t: Internal.Tag) => t.id === val.tag.id), 1);
    }
    setFilteredTags(filters)
  };
  const onReset = () => {
    setFilteredTags([]);
  };

  const onApplyHandler = () => {
    onFilterChange(filteredTags);
  };

  const displayGroups =
    allFilters.displayCategories && allFilters.displayCategories.length > 0
      ? (allFilters.displayCategories
          .map(groupName =>
            allFilters.tagGroups.find(item => item.name === groupName)
          )
          .filter(item => item !== undefined) as Internal.TagGroup[])
      : allFilters.tagGroups;

  return (
    <div className={classWrapper}>
      <ul
        className={cx(
          theme.filterSettings__tagGroups,
          'filter-settings__tagGroups'
        )}
      >
        {displayGroups.map((item: Internal.TagGroup, key) => (
          <li
            key={key}
            className={cx(
              theme.filterSettings__categoryItem,
              'filter-settings__category-item'
            )}
          >
            <Accordion
              className={cx(
                theme.filterSettings__categoryHeader,
                'filter-settings__category-header'
              )}
              title={{ label: item.label, name: item.name }}
              Icon={icons.open}
              IconOpened={icons.closed}
              isOpen={false}
            >
              <Tags
                list={item.children}
                content={{ title: undefined, loadMoreButton: undefined }}
                enableExternalManage
                selectedTags={filteredTags}
                viewType={TagViewType.filter}
                initialCount={0}
                handleTagToggle={onToggleFilter}
                variant={TagVariant.toggle}
              />
            </Accordion>
          </li>
        ))}
      </ul>
      <div
        className={cx(
          theme.filterSettings__buttons,
          'filter-settings__buttons'
        )}
      >
        <Button
          className={cx(
            theme.filterSettings__reset,
            'filter-settings__reset',
            'button--secondary'
          )}
          onClick={onReset}
          content={filtersPanel && filtersPanel.ctas.reset}
        />
        <Button
          className={cx(theme.filterSettings__apply, 'filter-settings__apply')}
          onClick={onApplyHandler}
          content={filtersPanel && filtersPanel.ctas.apply}
        />
      </div>
    </div>
  );
};

export default FilterSettings;

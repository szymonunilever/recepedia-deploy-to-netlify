import cx from 'classnames';
import { remove } from 'lodash';
import React from 'react';
import { Tags } from '../../Tags';
import { ItemProps, TagToggleHandler, TagViewType } from '../../Tags/models';
import theme from './FilterSettings.module.scss';
import { FilterSettingsProps, TagCategory } from './models';

const FilterSettings = ({
  allFilters,
  filtersSelected,
  onFilterChange,
  className,
  hidden,
}: FilterSettingsProps) => {
  const classWrapper = cx(theme.filterSettings, className);
  const onToggleFilter = (val: TagToggleHandler) => {
    const filters = [...filtersSelected];
    if (val.state) {
      filters.push(val.tag);
    } else if (filters.length > 0) {
      remove(filters, (t: ItemProps) => t.id === val.tag.id);
    }
    onFilterChange(filters);
  };

  return (
    <div className={classWrapper} hidden={hidden}>
      <ul className="filter-settings__categories">
        {allFilters.categories.map((item: TagCategory, key) => (
          <li key={key} className="filter-settings__category-item">
            <span className="filter-settings__category-header">
              {item.categoryName}
            </span>
            <Tags
              isEditable={false}
              list={item.tags}
              selectedTags={filtersSelected}
              viewType={TagViewType.filter}
              initialCount={0}
              handleTagToggle={onToggleFilter}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilterSettings;

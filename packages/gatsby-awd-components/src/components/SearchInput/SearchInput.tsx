import React, { useState, KeyboardEvent, useEffect, useCallback } from 'react';
import SearchResults from './partials/SearchResults';
import cx from 'classnames';
import { SearchInputProps, FilterData } from './models';
import trim from 'lodash/trim';
import getComponentDataAttrs from '../../utils/getComponentDataAttrs';
import theme from './SearchInput.module.scss';
import { Button, ButtonViewType } from "../Button";

const SearchInput = ({
  list = [],
  content,
  searchPagePath = '',
  content: { title, placeholderText },
  className,
  labelIcon,
  buttonResetIcon,
  buttonSubmitIcon,
  searchResultsCount = 8,
  debounceTimeout = 300,
  onSubmit,
  getSearchResults,
  searchResults,
  defaultSearchValue = '',
  onClickSearchResultsItem,
  autoFocus = false,
  minLength = 3,
  maxLength = 60,
}: SearchInputProps) => {
  const classNames = cx(theme.searchInput, 'search-input', className);
  const [inputValue, setInputValue] = useState('');
  const [data, setData] = useState<string[]>([]);
  const [timerId, setTimerId] = useState();
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [inputIsDirty, setInputIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setInputValue(defaultSearchValue);
  }, [defaultSearchValue]);

  const filterData: FilterData = (data, val) => {
    return val
      ? data
          .filter(
            (text: string) =>
              text && text.toLowerCase().includes(val.toLowerCase())
          )
          .slice(0, searchResultsCount)
      : [];
  };

  const getResults = useCallback((searchInputValue: string, e) => {
    if (getSearchResults) {
      getSearchResults(trim(searchInputValue), {
        from: 0,
        size: searchResultsCount,
      })
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else {
      setData(filterData(list, searchInputValue));
      setInputIsDirty(true);
    }
  }, []);

  useEffect(() => {
    if (searchResults) {
      setData(searchResults);
    }
  }, [searchResults]);

  const clearTimeOut = () => window.clearTimeout(timerId);

  const resetForm = () => {
    clearTimeOut();
    setInputValue('');
    setData([]);
    setActiveItemIndex(0);
  };

  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const trimmedValue = trim(value);
      if (trimmedValue.length <= maxLength) {
        setInputValue(value);
      }

      setInputIsDirty(true);
      setData([]);

      if (
        trimmedValue.length >= minLength &&
        trimmedValue !== trim(inputValue)
      ) {
        clearTimeOut();
        setIsLoading(true);
        setTimerId(() =>
          window.setTimeout(() => {
            getResults(trimmedValue, e);
          }, debounceTimeout)
        );
      }
    },
    [inputValue]
  );

  const submitHandler = useCallback(() => {
    setData([]);
    setInputIsDirty(false);
    onClickSearchResultsItem && onClickSearchResultsItem(inputValue, { size: searchResultsCount });
    if (
      trim(inputValue).length >= minLength &&
      onSubmit &&
      trim(inputValue).length <= maxLength
    ) {
      clearTimeOut();
      onSubmit(inputValue, {
        from: 0,
        size: searchResultsCount,
      });
      setIsLoading(false);
    }
  }, [isLoading, inputValue, onSubmit, searchResultsCount]);

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if(trim(inputValue).length >= minLength &&
      trim(inputValue).length <= maxLength) {
        submitHandler();
      }
    } else if (e.key === 'ArrowDown' && data.length) {
      let newActiveItemIndex =
        activeItemIndex < data.length - 1 ? activeItemIndex + 1 : 0;
      setInputValue(data[newActiveItemIndex]);
      setActiveItemIndex(newActiveItemIndex);
    } else if (e.key === 'ArrowUp' && data.length) {
      let newActiveItemIndex =
        activeItemIndex <= 0 ? data.length - 1 : activeItemIndex - 1;
      setInputValue(data[newActiveItemIndex]);
      setActiveItemIndex(newActiveItemIndex);
    }
  };

  const onHoverSearchResultsItemHandler = (index: number) => {
    setInputValue(data[index]);
    setActiveItemIndex(index);
  };

  const onClickSearchResultsItemHandler = (index: number) => {
    setInputValue(data[index]);
    setInputIsDirty(false);

    if (onClickSearchResultsItem) {
      setData([]);
      onClickSearchResultsItem(data[index], { size: searchResultsCount });
    }
  };

  const inputHasValidValue = inputValue.length >= minLength;
  const buttonReset = inputValue.length ? (
    <Button
      className="form__button-reset"
      type="button"
      onClick={resetForm}
      aria-label="reset"
      viewType={ButtonViewType.icon}
    >
      {buttonResetIcon}
    </Button>
  ) : null;

  const showSearchResults = inputIsDirty && inputHasValidValue && !isLoading;

  return (
    <div
      className={classNames}
      {...getComponentDataAttrs('search-input', content)}
    >
      <h1 className="search-input__title">{title}</h1>

      <form className="form">
        <div className="form__group">
          <label className="form__label" htmlFor="search-input">
            <span className="form__label-text">search</span>
            {labelIcon}
          </label>
          <input
            minLength={minLength}
            maxLength={maxLength}
            autoFocus={autoFocus}
            className="form__input"
            type="text"
            onChange={onChangeHandler}
            onKeyDown={onKeyDownHandler}
            value={inputValue}
            id="search-input"
            placeholder={placeholderText}
            autoComplete="off"
          />
          {buttonReset}
          <Button
            className="form__button-submit"
            onClick={submitHandler}
            aria-label="submit"
            isDisabled={!inputHasValidValue}
          >
            {buttonSubmitIcon}
          </Button>
        </div>
      </form>

      {showSearchResults ? (
        <SearchResults
          searchPagePath={searchPagePath}
          navigateToItem={!!onClickSearchResultsItem}
          onClickHandler={onClickSearchResultsItemHandler}
          activeIndex={activeItemIndex}
          list={data}
          onHoverHandler={onHoverSearchResultsItemHandler}
        />
      ) : null}
    </div>
  );
};

export default SearchInput;

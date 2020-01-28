import React, { useCallback, useState } from 'react';
import { graphql, navigate, useStaticQuery } from 'gatsby';
import {
  Button,
  ButtonViewType,
} from 'gatsby-awd-components/src/components/Button';
import { Modal } from 'gatsby-awd-components/src/components/Modal';
import {
  SearchInput,
  SearchInputProps,
} from 'gatsby-awd-components/src/components/SearchInput';
import { SearchParams } from 'gatsby-awd-components/src/components/SearchParams';
import { ReactComponent as ButtonCloseIcon } from 'src/svgs/inline/x-mark.svg';
import { ReactComponent as SearchIcon } from 'src/svgs/inline/search-icon.svg';
import { getSearchSuggestionResponse } from 'src/utils/searchUtils';
import { esResponseHandler } from '../../utils/esResponseHandler';

const GlobalSearch = ({
  searchContent,
}: {
  searchContent: AppContent.SearchInput.Content;
}) => {
  const {
    page: { relativePath },
  } = useStaticQuery(graphql`
    {
      page(type: { eq: "Search" }) {
        relativePath
      }
    }
  `);

  const [modalState, setModalState] = useState(false);
  const [searchInputResults, setSearchInputResults] = useState<
    SearchInputProps['searchResults']
  >([]);

  const openModal = () => {
    setModalState(true);
  };

  const closeModal = () => {
    setModalState(false);
  };

  const getSearchSuggestionData = async (
    searchQuery: string,
    params: SearchParams
  ) => {
    getSearchSuggestionResponse(searchQuery, params, '')
      .then(values => {
        const [recipeRes, articleRes, productRes] = values;
        const recipeTitles = esResponseHandler(recipeRes, 'title').byField;
        const articleTitles = esResponseHandler(articleRes, 'title').byField;
        const productTitles = esResponseHandler(productRes, 'productName')
          .byField;
        setSearchInputResults([
          ...recipeTitles,
          ...articleTitles,
          ...productTitles,
        ]);
      })
      .catch(() => {});
  };
  const onSubmit = useCallback(value => {
    navigate(`${relativePath}?searchQuery=${value}`);
    setModalState(false);
  }, []);

  return (
    <>
      <Button
        className="searchBar"
        onClick={openModal}
        attributes={{ 'aria-label': 'search' }}
        viewType={ButtonViewType.icon}
      >
        <SearchIcon className="searchBar__icon" />
      </Button>
      <Modal
        className="modal--search"
        isOpen={modalState}
        close={closeModal}
        closeBtn={<ButtonCloseIcon />}
      >
        <SearchInput
          searchPagePath={relativePath}
          getSearchResults={getSearchSuggestionData}
          onClickSearchResultsItem={onSubmit}
          content={searchContent}
          searchResults={searchInputResults}
          labelIcon={<SearchIcon />}
          buttonResetIcon={<ButtonCloseIcon />}
          buttonSubmitIcon={<SearchIcon />}
          onSubmit={onSubmit}
          autoFocus
        />
      </Modal>
    </>
  );
};

export default GlobalSearch;

export interface RecipeSearchDetailsNode {
  fields: {
    slug: string;
  };
  id: string;
  recipeId: string;
  title: string;
}

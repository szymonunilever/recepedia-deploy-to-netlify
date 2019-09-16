import React, { useState } from 'react';
import { navigate } from 'gatsby';
import SearchInput from '../lib/components/SearchInput/SearchInput';
import { Modal } from 'src/components/lib/components/Modal';
import { Button } from '../lib/components/Button';
import { ReactComponent as ButtonCloseIcon } from 'src/svgs/inline/x-mark.svg';
import { ReactComponent as SearchIcon } from 'src/svgs/inline/search-icon.svg';
import { SearchParams } from '../lib/components/SearchListing/models';
import { SearchInputProps } from '../lib/components/SearchInput/models';
import { getSearchSuggestionResponse } from 'src/utils/searchUtils';

const GlobalSearch = ({
  searchContent,
}: {
  searchContent: AppContent.SearchInput.Content;
}) => {
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
    getSearchSuggestionResponse(searchQuery, params)
      .then(values => {
        // const [recipeRes, articleRes] = values;
        const [recipeRes] = values; // @todo remove this line and uncomment the a line above when articles are there

        setSearchInputResults([
          ...recipeRes.hits.hits.map(item => item._source.title),
          // ...articleRes.hits.hits.map(item => item._source.title), // @todo uncomment this line when articles are there
        ]);
      })
      .catch(() => {});
  };

  return (
    <>
      <Button
        className="searchBar"
        onClick={openModal}
        attributes={{ 'aria-label': 'search' }}
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
          getSearchResults={getSearchSuggestionData}
          onClickSearchResultsItem={(value: string) => {
            navigate(`/procurar?searchQuery=${value}`); // get URL from Pages when search Page is there
            setModalState(false);
          }}
          content={searchContent}
          searchResults={searchInputResults}
          labelIcon={<SearchIcon />}
          buttonResetIcon={<ButtonCloseIcon />}
          buttonSubmitIcon={<SearchIcon />}
          onSubmit={async value => {
            navigate(`/procurar?searchQuery=${value}`); // get URL from Pages when search Page is there
            setModalState(false);
          }}
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
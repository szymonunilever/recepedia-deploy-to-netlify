import {
  NullResult,
  Button,
  ButtonViewType,
  Modal,
  RatingAndReviewsProvider,
  RecipeAddPlaceholderProps,
  CardLinkWrapper,
  CardLinkWrapperProps,
  RecipeListing,
  RecipeListViewType,
  ResultSection as WizardResultSection,
  SearchInput,
  SearchInputProps,
  SearchParams,
  TagName,
  Text,
  RecipeCard,
  RecipeAddPlaceholder,
  LoadMoreType,
} from 'gatsby-awd-components/src';
import React, {
  FunctionComponent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { IMAGE_SIZES } from '../../constants';
import theme from '../../staticPages/MealPlanner/mealPlanner.module.scss';
import { ReactComponent as PlaceholderAddButton } from '../../svgs/inline/plus-light.svg';
import { ReactComponent as SearchIcon } from '../../svgs/inline/search-icon.svg';
import { ReactComponent as Spinner } from '../../svgs/inline/spinner.svg';
import { ReactComponent as ButtonCloseIcon } from '../../svgs/inline/x-mark.svg';
import { ReactComponent as CheckMarkIcon } from 'src/svgs/inline/checkmark-bigger.svg';
import { removeRecipeCardButtonDefaults } from '../../themeDefaultComponentProps';
import { findPageComponentContent } from '../../utils';
import { getSearchSuggestionResponse } from '../../utils/searchUtils';
import { MealPannerResultsProps } from './models';
import cloneDeep from 'lodash/cloneDeep';
import { getCustomMPSearch } from './hepers';
import useMedia from '../../utils/useMedia';
import { getPagePath } from '../../utils/getPagePath';
import { esResponseHandler } from '../../utils/esResponseHandler';

export const MealPlannerResults: FunctionComponent<MealPannerResultsProps> = ({
  containerClass,
  resultsDefault,
  maxResults,
  components,
  refreshResults,
  changeResultSize,
  callback,
  isLoading,
  actionCallback,
  stepId,
  resultContentTitle,
}) => {
  const initialRecipesCount = useMedia();
  // Get Components Contents
  const componentContent = findPageComponentContent(components, 'Wizard');
  const [wizardResultSection, setWizardResultSection] = useState(
    cloneDeep(componentContent.wizardResultSection)
  );
  useEffect(() => {
    const newContentVal = { ...wizardResultSection };
    newContentVal.content.onResult.title = resultContentTitle;
    setWizardResultSection(newContentVal);
  }, [resultContentTitle]);

  const searchPagePath = getPagePath('Search');
  const removeFromMPConfirmationContent: AppContent.ConfirmationContent = findPageComponentContent(
    components,
    'Confirmation',
    'RemoveFromMPConfirmation'
  );
  const searchModalContent = findPageComponentContent(
    components,
    'SearchCustomRecipeModal'
  );
  const customSearchRecipeList: AppContent.RecipeListing.Content = findPageComponentContent(
    components,
    'RecipeListing',
    'MPCustomSearchResult'
  );
  const customSearchContent = findPageComponentContent(
    components,
    'SearchCustomRecipeResult'
  );
  const customSearchNullResult = findPageComponentContent(
    components,
    'NullResult',
    'SearchCustomRecipeResult'
  );

  // Define States
  const [recipeCards, setRecipeCards] = useState<
    | ReactElement<CardLinkWrapperProps>[]
    | ReactElement<RecipeAddPlaceholderProps>[]
  >([]);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [recipeToRemove, setRecipeToRemove] = useState();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCustomSelector, setShowCustomSelector] = useState(false);
  const [recipesToSelect, setRecipesToSelect] = useState<Internal.Recipe[]>([]);
  const [recipeSelected, setRecipeSelected] = useState<number>();
  const [customSearchInProcess, setCustomSearchInProcess] = useState(false);
  const [customSearchResultContent, setCustomSearchResultContent] = useState(
    customSearchContent
  );
  const [customSearchInitialCount, setCustomSearchInitialCount] = useState(
    initialRecipesCount
  );
  const [searchInputResults, setSearchInputResults] = useState<
    SearchInputProps['searchResults']
  >([]);

  const [lastCustomSearchQuery, setLastCustomSearchQuery] = useState();
  const [customResultsCount, setCustomResultsCount] = useState(0);

  // Define Callbacks
  const openCustomSearch = useCallback(() => {
    setShowSearchModal(true);
  }, []);
  const removeFromMP = useCallback(
    (manual: boolean) => {
      const recipeList = [...resultsDefault];
      setRecipesToSelect([]);
      if (manual) {
        openCustomSearch();
        setShowRemoveConfirmation(false);
      } else {
        const recipeIndex = recipeList.findIndex(
          recipe => recipe.recipeId === recipeToRemove
        );
        if (recipeList.length > maxResults) {
          recipeList.splice(recipeIndex, 1);
          refreshResults(recipeList);
          setShowRemoveConfirmation(false);
          setRecipeToRemove(undefined);
        } else {
          recipeList.splice(recipeIndex, 1);
          refreshResults(recipeList, true);
          setShowRemoveConfirmation(false);
          setRecipeToRemove(undefined);
        }
      }
    },
    [showRemoveConfirmation]
  );
  const openCustomRecipeSelector = useCallback(
    value => {
      setLastCustomSearchQuery(value);
      setCustomSearchInProcess(true);
      const exclude = resultsDefault.map(recipe => recipe.recipeId);
      getCustomMPSearch(
        value,
        { size: customSearchInitialCount },
        exclude
      ).then(res => {
        const { data, total } = esResponseHandler(res);
        const recipes: Internal.Recipe[] = [];
        if (total === 0) {
          const newSearchContent = {
            ...customSearchContent,
            noResult: { ...customSearchContent.noResult },
          };
          newSearchContent.noResult.subheading = newSearchContent.noResult.subheading
            .replace('{numRes}', 0)
            .replace('{searchInputValue}', value);
          setRecipesToSelect([]);
          setShowCustomSelector(true);
          setCustomSearchInProcess(false);
          setCustomSearchResultContent(newSearchContent);
          return;
        }
        data.forEach(resItem => {
          recipes.push(resItem as Internal.Recipe);
        });
        const newSearchContent = {
          ...customSearchContent,
          onResult: { ...customSearchContent.onResult },
        };
        newSearchContent.onResult.subheading = newSearchContent.onResult.subheading
          .replace('{numRes}', `${total}`)
          .replace('{searchInputValue}', value);
        setCustomResultsCount(total);
        setCustomSearchResultContent(newSearchContent);
        setRecipesToSelect(recipes);
        setCustomSearchInProcess(false);
      });
    },
    [resultsDefault, customSearchInitialCount]
  );

  const onLoadMoreRecipes = async (
    tags: Internal.Tag[],
    sorting: string,
    size: number
  ) => {
    const exclude = resultsDefault.map(recipe => recipe.recipeId);
    getCustomMPSearch(
      lastCustomSearchQuery,
      { from: recipesToSelect.length, size },
      exclude
    ).then(res => {
      const { data, total } = esResponseHandler(res);
      if (total > 0) {
        const recipes: Internal.Recipe[] = [];
        data.forEach(resItem => {
          recipes.push(resItem as Internal.Recipe);
        });
        setRecipesToSelect([...recipesToSelect, ...recipes]);
      }
    });
  };

  const onCustomRecipeSelected = useCallback(() => {
    setLastCustomSearchQuery(undefined);
    setCustomResultsCount(0);
    if (recipesToSelect && recipesToSelect.length > 0) {
      const recipeList = [...resultsDefault];
      setRecipeCards([]);

      const recipeShouldAdd =
        recipesToSelect &&
        recipesToSelect.find(recipe => recipe.recipeId === recipeSelected);

      if (recipeToRemove) {
        const recipeIndex = recipeList.findIndex(
          recipe => recipe.recipeId === recipeToRemove
        );
        recipeShouldAdd && recipeList.splice(recipeIndex, 1, recipeShouldAdd);
      } else {
        recipeShouldAdd && recipeList.push(recipeShouldAdd);
      }

      setShowCustomSelector(false);
      setRecipesToSelect([]);
      setRecipeSelected(undefined);
      setRecipeToRemove(undefined);
      refreshResults(recipeList);
    }
  }, [recipesToSelect, recipeSelected, resultsDefault]);
  const searchAgain = useCallback(() => {
    setLastCustomSearchQuery(undefined);
    setShowCustomSelector(false);
    setShowSearchModal(true);
    setRecipeSelected(undefined);
  }, []);

  const onBackFromCustomSearch = useCallback(() => {
    if (recipesToSelect.length === 0) {
      removeFromMP(false);
      setShowCustomSelector(false);
    } else {
      searchAgain();
    }
  }, [recipesToSelect]);

  const getSearchSuggestionData = useCallback(
    async (searchQuery: string, params: SearchParams) => {
      getSearchSuggestionResponse(searchQuery, params)
        .then(values => {
          const [recipeRes] = values;
          const { byField } = esResponseHandler(recipeRes, 'title');
          setSearchInputResults([...byField]);
        })
        .catch(() => {});
    },
    [showSearchModal]
  );

  // Define Effects
  useEffect(() => {
    if (recipesToSelect && recipesToSelect.length > 0) {
      changeResultSize && changeResultSize(recipesToSelect.length);
      setShowCustomSelector(true);
    }
  }, [recipesToSelect]);

  useEffect(() => {
    setCustomSearchInitialCount(initialRecipesCount);
  }, [initialRecipesCount]);

  useEffect(() => {
    const recipeListingChildren = resultsDefault
      ? resultsDefault.map(recipe => (
          <CardLinkWrapper
            cardKey={recipe.id}
            title={recipe.title}
            key={recipe.id}
            slug={recipe.fields.slug}
            isExternal={true}
          >
            <RecipeCard
              {...recipe}
              slug={recipe.fields.slug}
              ratingProvider={RatingAndReviewsProvider.inline}
              imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.STANDARD}
              content={{ title: recipe.title }}
            >
              <Button
                {...removeRecipeCardButtonDefaults}
                onClick={(e, recipeId) => {
                  setShowRemoveConfirmation(true);
                  setRecipeToRemove(recipeId);
                }}
              />
            </RecipeCard>
          </CardLinkWrapper>
        ))
      : [];
    if (recipeListingChildren && recipeListingChildren.length > 0) {
      while (recipeListingChildren.length < maxResults) {
        recipeListingChildren.push(
          <RecipeAddPlaceholder
            cardKey={'recipeAddPlaceholder_' + recipeListingChildren.length}
            key={'recipeAddPlaceholder_' + recipeListingChildren.length}
            onClick={openCustomSearch}
            Icon={PlaceholderAddButton}
          />
        );
      }
    }
    setRecipeCards(recipeListingChildren);
    changeResultSize && changeResultSize(recipeListingChildren.length);
  }, [resultsDefault]);

  // Define View Parts
  const removeFromMPConfirmationView = (
    <Modal
      className="confirmation__dialog remove-confirmation"
      isOpen={showRemoveConfirmation}
      close={() => {
        removeFromMP(false);
      }}
    >
      {removeFromMPConfirmationContent.text && (
        <Text
          className="remove-confirmation__text"
          tag={TagName.h2}
          text={removeFromMPConfirmationContent.text}
        />
      )}
      <div className="buttons">
        <Button
          className="remove-confirmation__approve button--medium"
          viewType={ButtonViewType.classic}
          content={removeFromMPConfirmationContent.yesButtonText}
          onClick={() => {
            removeFromMP(true);
          }}
          attributes={{ autoFocus: true }}
        />
        <Button
          className="remove-confirmation__approve button--medium"
          viewType={ButtonViewType.classic}
          content={removeFromMPConfirmationContent.noButtonText}
          onClick={() => {
            removeFromMP(false);
          }}
        />
      </div>
    </Modal>
  );
  const customSearchModalView = (
    <Modal
      className="modal--search"
      isOpen={showSearchModal}
      close={() => {
        recipeToRemove && removeFromMP(false);
        setShowSearchModal(false);
      }}
      closeBtn={<ButtonCloseIcon />}
    >
      <SearchInput
        getSearchResults={getSearchSuggestionData}
        onClickSearchResultsItem={(value: string) => {
          openCustomRecipeSelector(value);
          setShowSearchModal(false);
        }}
        content={searchModalContent}
        searchResults={searchInputResults}
        labelIcon={<SearchIcon />}
        buttonResetIcon={<ButtonCloseIcon />}
        buttonSubmitIcon={<SearchIcon />}
        onSubmit={async value => {
          openCustomRecipeSelector(value);
          setShowSearchModal(false);
        }}
        autoFocus
        searchPagePath={searchPagePath}
      />
    </Modal>
  );
  const customSearchResultChildrenView =
    recipesToSelect.length > 0 ? (
      <RecipeListing
        imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.MEAL_PLANNER}
        list={recipesToSelect}
        initialCount={customSearchInitialCount}
        content={customSearchRecipeList}
        loadMoreConfig={{
          type: LoadMoreType.async,
          onLoadMore: onLoadMoreRecipes,
          allCount: customResultsCount,
        }}
        brandLogoLink={searchPagePath}
        isExternalItemLink={true}
      >
        {recipesToSelect.map(recipe => (
          <RecipeCard
            className="custom-search_recipe-card"
            key={recipe.id}
            {...recipe}
            slug={recipe.fields.slug}
            ratingProvider={RatingAndReviewsProvider.inline}
            imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.STANDARD}
            content={{ title: recipe.title }}
          >
            <Button
              className="custom-search_check"
              isSelected={recipe.recipeId === recipeSelected}
              onClick={(val, recipeId) => {
                setRecipeSelected(recipeId);
              }}
              viewType={ButtonViewType.icon}
              Icon={CheckMarkIcon}
            />
          </RecipeCard>
        ))}
      </RecipeListing>
    ) : (
      <NullResult content={customSearchNullResult} />
    );
  const spinnerView = (
    <div className={theme.spinner}>
      <Spinner />
    </div>
  );

  return showCustomSelector ? (
    <div className="wizard-meal-planer--custom-search">
      <WizardResultSection
        content={customSearchResultContent}
        containerClass={containerClass}
        stepId="customNoResult"
        nextDisabled={recipesToSelect.length > 0 ? !recipeSelected : false}
        isLoading={false}
        resultSize={recipesToSelect.length}
        actionCallback={
          recipesToSelect.length === 0 ? searchAgain : onCustomRecipeSelected
        }
        callbacks={{
          back: onBackFromCustomSearch,
        }}
      >
        {!customSearchInProcess ? customSearchResultChildrenView : spinnerView}
      </WizardResultSection>
    </div>
  ) : (
    <WizardResultSection
      {...wizardResultSection}
      containerClass={containerClass}
      stepId={stepId}
      isLoading={isLoading}
      resultSize={resultsDefault.length}
      actionCallback={actionCallback}
      callbacks={{
        back: callback,
      }}
    >
      {!isLoading
        ? recipeCards &&
          resultsDefault.length > 0 && (
            <RecipeListing
              initialCount={
                recipeCards.length <= maxResults
                  ? recipeCards.length
                  : maxResults
              }
              content={findPageComponentContent(components, 'Wizard')}
              list={resultsDefault}
              ratingProvider={RatingAndReviewsProvider.inline}
              viewType={RecipeListViewType.Trivial}
              className="recipe-list--wizard"
              imageSizes={IMAGE_SIZES.RECIPE_LISTINGS.MEAL_PLANNER}
              brandLogoLink={searchPagePath}
              isExternalItemLink={true}
            >
              {recipeCards}
            </RecipeListing>
          )
        : spinnerView}
      {removeFromMPConfirmationView}
      {customSearchModalView}
    </WizardResultSection>
  );
};

export default MealPlannerResults;

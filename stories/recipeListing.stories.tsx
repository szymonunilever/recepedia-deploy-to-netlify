import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import React from 'react';
import {
  RecipeListing,
  RecipeListViewType,
} from '../src/components/lib/components/RecipeListing';
import dataSource from 'src/components/data/recipes.json';
import dataTags from 'src/components/data/allTags.json';
import { ReactComponent as FavoriteIcon } from 'src/svgs/inline/favorite.svg';
import { ReactComponent as OpenIcon } from 'src/svgs/inline/arrow-down.svg';
import { ReactComponent as RemoveTagIcon } from 'src/svgs/inline/x-mark.svg';
import { ReactComponent as FilterIcon } from 'src/svgs/inline/filter.svg';
const listing = dataSource.data.allRecipe.edges.map(item => item.node);

const contents: AppContent.RecipeListing.Content[] = [
  {
    title: 'Recipe listing Trivial without results',
    nullResult: {
      title: 'Oops! No results',
      subtitle: 'Maybe try the following:',
      textList: [
        `Don't use too many filters at once`,
        `Try using only filters`,
      ],
    },
  },
  {
    title: 'Recipe listing Trivial default 4 results',
    nullResult: {
      title: 'Oops! No results',
      subtitle: 'Maybe try the following:',
      textList: [
        `Don't use too many filters at once`,
        `Try using only filters`,
      ],
    },
  },
  {
    title: 'Recipe listing Trivial all Recipes',
    nullResult: {
      title: 'Oops! No results',
      subtitle: 'Maybe try the following:',
      textList: [
        `Don't use too many filters at once`,
        `Try using only filters`,
      ],
    },
  },
  {
    title: 'Recipe listing Trivial with Favorites',
    nullResult: {
      title: 'Oops! No results',
      subtitle: 'Maybe try the following:',
      textList: [
        `Don't use too many filters at once`,
        `Try using only filters`,
      ],
    },
  },
  {
    title: 'Recipe listing Base with Load More',
    cta: { label: 'Load More Button' },
    nullResult: {
      title: 'Oops! No results',
      subtitle: 'Maybe try the following:',
      textList: [
        `Don't use too many filters at once`,
        `Try using only filters`,
      ],
    },
  },
  {
    title: 'Recipe listing Base without results',
    nullResult: {
      title: 'Oops! No results',
      subtitle: 'Maybe try the following:',
      textList: [
        `Don't use too many filters at once`,
        `Try using only filters`,
      ],
    },
  },
  {
    title: 'Recipe listing Advanced',
    resultLabel: 'recipe',
    resultLabelPlural: 'recipes',
    sortSelectPlaceholder: 'Sort By',
    filtersPanel: {
      title: 'Filtros',
      ctas: {
        reset: { label: 'Limpar filtros' },
        apply: { label: 'Aplicar filtros' },
      },
    },
    cta: { label: 'Load More Button' },
    nullResult: {
      title: 'Oops! No results',
      subtitle: 'Maybe try the following:',
      textList: [
        `Don't use too many filters at once`,
        `Try using only filters`,
      ],
    },
    optionLabels: {
      preparationTime: 'Preparation time Test',
      cookingTime: 'Cooking time',
      averageRating: 'Average rating',
      newest: 'newest',
      recentlyUpdated: 'Recently updated',
      title: 'title',
    },
  },
];

storiesOf('Components/Recipe Listing', module)
  .add(
    'Recipe listing Trivial without results',
    () => (
      <RecipeListing
        list={[]}
        viewType={RecipeListViewType.Trivial}
        content={contents[0]}
        titleLevel={1}
        imageSizes={'(min-width: 768px) 25vw, 50vw'}
      />
    ),
    {
      info: { inline: false },
    }
  )
  .add(
    'Recipe listing Trivial default 4 results',
    () => (
      <RecipeListing
        // @ts-ignore
        list={listing}
        viewType={RecipeListViewType.Trivial}
        content={contents[1]}
        titleLevel={1}
        className="recipe-list"
        imageSizes={'(min-width: 768px) 25vw, 50vw'}
      />
    ),
    {
      info: { inline: false },
    }
  )
  .add(
    'Recipe listing Trivial all Recipes',
    () => (
      <RecipeListing
        // @ts-ignore
        list={listing}
        viewType={RecipeListViewType.Trivial}
        content={contents[2]}
        titleLevel={1}
        initialCount={0}
        imageSizes={'(min-width: 768px) 25vw, 50vw'}
      />
    ),
    {
      info: { inline: false },
    }
  )
  .add(
    'Recipe listing Trivial with Favorites',
    () => (
      <RecipeListing
        // @ts-ignore
        list={listing}
        viewType={RecipeListViewType.Trivial}
        FavoriteIcon={FavoriteIcon}
        content={contents[3]}
        withFavorite
        favorites={[]}
        onFavoriteChange={action('favorites were changed')}
        titleLevel={1}
        imageSizes={'(min-width: 768px) 25vw, 50vw'}
      />
    ),
    {
      info: { inline: false },
    }
  )
  .add(
    'Recipe listing Base with Load More',
    () => (
      <RecipeListing
        // @ts-ignore
        list={listing}
        viewType={RecipeListViewType.Base}
        FavoriteIcon={FavoriteIcon}
        content={contents[4]}
        withFavorite
        favorites={[]}
        onFavoriteChange={action('favorites were changed')}
        titleLevel={1}
      />
    ),
    {
      info: { inline: false },
    }
  )
  .add(
    'Recipe listing Base without results',
    () => (
      <RecipeListing
        list={[]}
        FavoriteIcon={FavoriteIcon}
        viewType={RecipeListViewType.Base}
        content={contents[5]}
        titleLevel={1}
        imageSizes={'(min-width: 768px) 25vw, 50vw'}
      />
    ),
    {
      info: { inline: false },
    }
  )
  .add(
    'Recipe listing Advanced',
    () => (
      <div className="container">
        <RecipeListing
          // @ts-ignore
          list={listing}
          FavoriteIcon={FavoriteIcon}
          OpenIcon={OpenIcon}
          FilterIcon={FilterIcon}
          viewType={RecipeListViewType.Advanced}
          RemoveTagIcon={RemoveTagIcon}
          favorites={[]}
          withFavorite
          content={contents[6]}
          titleLevel={1}
          // @ts-ignore
          tags={dataTags}
          imageSizes={'(min-width: 768px) 25vw, 50vw'}
        />
      </div>
    ),
    {
      info: { inline: false },
    }
  );

import { useElasticSearch } from '../utils';
import { SearchParams } from 'gatsby-awd-components/src';

const filteredRecipeSearchParams = (
  query: string,
  queryStringToExclude: number[] | undefined,
  params: SearchParams,
  getOnlyRecipeCount = false
) => {
  const queryString = {
    query,
    fields: ['tagGroups.tags.id'],
  };

  return {
    index: process.env['elasticSearch_recipeIndex'] as string,
    body: {
      ...params,
      query: getOnlyRecipeCount
        ? {
            // eslint-disable-next-line @typescript-eslint/camelcase
            query_string: queryString,
          }
        : {
            bool: {
              must: [
                {
                  // eslint-disable-next-line @typescript-eslint/camelcase
                  query_string: queryString,
                },
              ],
              // eslint-disable-next-line @typescript-eslint/camelcase
              must_not: [
                {
                  terms: {
                    recipeId: queryStringToExclude,
                  },
                },
              ],
            },
          },
    },
  };
};

const recipeSearchParams = (
  searchQuery: string,
  { from, size, _source }: SearchParams,
  filter: string
) => {
  const mustQuery = [
    {
      // eslint-disable-next-line @typescript-eslint/camelcase
      query_string: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        analyze_wildcard: true,
        query: `${searchQuery}*`,
        fields: [
          'title^5',
          'description^2',
          'tagGroups.tags.name^4',
          'ingredients.description^3',
        ],
      },
    },
  ];

  filter &&
    mustQuery.push({
      // eslint-disable-next-line @typescript-eslint/camelcase
      query_string: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        analyze_wildcard: true,
        query: filter,
        fields: ['tagGroups.tags.id'],
      },
    });

  return {
    index: process.env['elasticSearch_recipeIndex'] as string,
    body: {
      from,
      size,
      _source,
      query: {
        bool: {
          must: mustQuery,
        },
      },
    },
  };
};

const recipeIdSearchParams = (
  searchQuery: string,
  controlArray: number[],
  { from = 0, size = 8, sort = 'asc' }: SearchParams
) => ({
  index: process.env['elasticSearch_recipeIndex'] as string,
  body: {
    from,
    size,
    query: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      function_score: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        query: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          query_string: {
            query: searchQuery,
            fields: ['recipeId'],
          },
        },
        functions: [
          {
            filter: {
              terms: {
                recipeId: controlArray,
              },
            },
            // eslint-disable-next-line @typescript-eslint/camelcase
            script_score: {
              script: {
                lang: 'painless',
                params: {
                  recipeIds: controlArray,
                },
                inline: `for ( int i = 0; i < params.recipeIds.size(); i++) {if (params['_source']['recipeId'] == params.recipeIds[i]) { return (params.recipeIds.size() ${
                  sort === 'desc' ? '-' : '+'
                } i)*1000;} }`,
              },
            },
          },
        ],
        // eslint-disable-next-line @typescript-eslint/camelcase
        boost_mode: 'replace',
      },
    },
    sort: ['_score'],
  },
});

const articleSearchParams = (
  searchQuery: string,
  { from, size, _source }: SearchParams
) => ({
  index: process.env['elasticSearch_articleIndex'] as string,
  body: {
    from,
    size,
    _source,
    query: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      simple_query_string: {
        query: `${searchQuery}`,
        fields: ['title^5', 'articleText.text^2'],
      },
    },
  },
});

export const getRecipesByIdsResponse = async (
  searchQuery: string,
  controlArray: number[],
  params: SearchParams
) =>
  useElasticSearch<Internal.Recipe>(
    recipeIdSearchParams(searchQuery, controlArray, params)
  );

export const getRecipeResponse = async (
  searchQuery: string,
  params: SearchParams,
  filter: string = ''
) =>
  useElasticSearch<Internal.Recipe>(
    recipeSearchParams(searchQuery, params, filter)
  );

export const getArticleResponse = async (
  searchQuery: string,
  params: SearchParams
) =>
  useElasticSearch<Internal.Article>(articleSearchParams(searchQuery, params));

export const getSearchSuggestionResponse = async (
  searchQuery: string,
  { from, size }: SearchParams,
  filter: string = ''
) => {
  return Promise.all([
    useElasticSearch<Internal.Recipe>(
      recipeSearchParams(
        searchQuery,
        { from, size, _source: ['title'] },
        filter
      )
    ),
    // useElasticSearch<Internal.Article>(
    //   articleSearchParams(searchQuery, { from, size, _source: ['title'] })
    // ),
  ]);
};

export const getFilteredRecipeResponse = async (
  query: string,
  queryToExclude?: number[],
  params: SearchParams = {},
  getOnlyCount = false
) =>
  useElasticSearch<Internal.Recipe>(
    filteredRecipeSearchParams(query, queryToExclude, params, getOnlyCount)
  );

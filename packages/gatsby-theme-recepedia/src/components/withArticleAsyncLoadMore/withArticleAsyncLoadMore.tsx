import React, { useEffect, useState } from 'react';
import { useElasticSearch } from '../../utils';
import { esResponseHandler } from '../../utils/esResponseHandler';
import { SearchParams } from 'gatsby-awd-components/src/components/SearchListing';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withArticleAsyncLoadMore = <T extends any>(
  Component: React.ComponentType<T>
) => {
  const Composition = (props: T) => {
    const {
      data: { allArticle },
    } = props;
    const INIT_ARTICLE_LIST_LENGTH = 6;
    const isAsyncInitialDataLoading =
      allArticle.nodes && !allArticle.nodes.length;
    const [articleResultsList, setArticleResultsList] = useState<
      Internal.Article[]
    >([]);
    const [articleResultsCount, setArticleResultsCount] = useState<number>(
      isAsyncInitialDataLoading ? 0 : allArticle.totalCount
    );
    const [dataFetched, setDataFetched] = useState(false);
    const getArticleSearchData = async (params: SearchParams = {}) => {
      const searchParams = {
        index: process.env['elasticSearch_articleIndex'] as string,
        body: {
          ...params,
          query: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            query_string: {
              // eslint-disable-next-line @typescript-eslint/camelcase
              analyze_wildcard: true,
              query: '**',
              fields: ['title^5', 'content^2'],
            },
          },
        },
      };

      return useElasticSearch<Internal.Article>(searchParams);
    };

    const onLoadMoreArticles = (from: number, size: number) => {
      setDataFetched(false);
      getArticleSearchData({
        size,
        from,
      })
        .then(res => {
          const { data } = esResponseHandler(res);
          setArticleResultsList([...articleResultsList, ...data]);
        })
        .finally(() => {
          setDataFetched(true);
        });
    };

    useEffect(() => {
      if (articleResultsList.length) {
        return;
      }

      const setArticles = (list: Internal.Article[], count: number) => {
        setArticleResultsList(list.slice(0, INIT_ARTICLE_LIST_LENGTH));
        setArticleResultsCount(count);
        setDataFetched(true);
      };
      setArticles(allArticle.nodes, allArticle.totalCount);
    }, []);

    return (
      <Component
        {...props}
        articleResultsList={articleResultsList}
        articleResultsCount={articleResultsCount}
        onLoadMoreArticles={onLoadMoreArticles}
        dataFetched={dataFetched}
      />
    );
  };

  return Composition;
};

export default withArticleAsyncLoadMore;

import { useEffect } from 'react';
import useMedia from '../useMedia';

function useResponsiveScreenInitialSearch(
  searchQuery: (size: number) => Promise<void>,
  listSize = 0,
  statesToWatch: string[] = [],
  mediaQueries?: string[],
  values?: number[]
): number {
  const initialRecipesCount = useMedia(mediaQueries, values);

  useEffect(() => {
    if (initialRecipesCount) {
      searchQuery(initialRecipesCount);
    }
  }, [initialRecipesCount, ...statesToWatch]);

  return initialRecipesCount;
}

export default useResponsiveScreenInitialSearch;

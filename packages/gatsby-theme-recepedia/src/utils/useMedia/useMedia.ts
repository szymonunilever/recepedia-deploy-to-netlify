import { useState, useEffect } from 'react';

const useMedia = (
  queries: string[] = ['(min-width: 768px)', '(max-width: 767px)'],
  values: number[] = [8, 6],
  debounceTimeout = 200
) => {
  let timerId: number;

  const [value, setValue] = useState();

  const match = () => {
    const query = queries.findIndex(q => matchMedia(q).matches);

    return values[query];
  };

  const clearTimeout = () => window.clearTimeout(timerId);

  const onResizeHandler = () => {
    clearTimeout();

    timerId = window.setTimeout(() => {
      setValue(match);
    }, debounceTimeout);
  };

  useEffect(() => {
    setValue(match);

    window.addEventListener('resize', onResizeHandler);

    return () => {
      clearTimeout();
      window.removeEventListener('resize', onResizeHandler);
    };
  }, []);

  return value;
};

export default useMedia;

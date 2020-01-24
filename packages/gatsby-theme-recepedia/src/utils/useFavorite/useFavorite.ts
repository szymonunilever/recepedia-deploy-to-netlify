import { useState, useEffect } from 'react';

const useFavorite = (
  initFavorites: () => number[],
  updateFavorites: (favorites: number[]) => void
) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const updateFavoriteState = (val: boolean, recipeId: number) => {
    const index = favorites.indexOf(recipeId);
    const newFavorites = [...favorites];
    if (index !== -1 && !val) {
      newFavorites.splice(index, 1);
      setFavorites(newFavorites);
      updateFavorites(newFavorites);
    } else if (index === -1 && val) {
      newFavorites.push(recipeId);
      setFavorites(newFavorites);
      updateFavorites(newFavorites);
    }
  };

  useEffect(() => {
    setFavorites(initFavorites() || []);
  }, []);

  return { updateFavoriteState, favorites };
};

export default useFavorite;

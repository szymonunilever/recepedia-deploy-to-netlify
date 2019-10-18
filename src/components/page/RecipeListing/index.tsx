import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { RecipeListing as RecipeListingComponent } from '../../lib';

const RecipeListing = ({ content }: RecipeListingProps) => {
  let recipeList;

  switch (content.view) {
    case 'Latest':
    default: {
      recipeList = useStaticQuery(graphql`
        {
          allRecipe(limit: 2) {
            nodes {
              ...RecipeFields
            }
          }
        }
      `);
    }
  }

  return (
    <RecipeListingComponent
      list={recipeList.allRecipe.nodes}
      content={content}
      imageSizes={'(min-width: 768px) 500, 500px'}
    />
  );
};

export default RecipeListing;

interface RecipeListingProps {
  content: {
    view: string;
    [key: string]: string | number | boolean | object | null;
  };
}

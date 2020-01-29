import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { ReactComponent as OpenIcon } from 'src/svgs/inline/arrow-down.svg';
import { ReactComponent as ClosedIcon } from 'src/svgs/inline/arrow-up.svg';
import { ReactComponent as FilterIcon } from 'src/svgs/inline/filter.svg';
import {
  ReactComponent as RemoveTagIcon,
  ReactComponent as CloseSvg,
} from 'src/svgs/inline/x-mark.svg';
import { FilterIcons } from 'gatsby-awd-components/src/components/Filter';
import { RecipeListing as RecipeListingComponent } from 'gatsby-awd-components/src/components/RecipeListing';
export const icons: FilterIcons = {
  close: CloseSvg,
  closed: ClosedIcon,
  filter: FilterIcon,
  open: OpenIcon,
  removeTag: RemoveTagIcon,
};
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
      icons={icons}
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

const path = require('path');
const reject = require('lodash/reject');
const omit = require('lodash/omit');
const orderBy = require('lodash/orderBy');
const take = require('lodash/take');
const intersection = require('lodash/intersection');

const RecipeFields = `
    description
    fields {
      slug
    }
    id
    averageRating
    brand
    brandTheme
    imgTitle
    ingredients {
      title
      list {
        description
        measurementUnit
        multiple
        originalProductId
        productId
        quantity
      }

    }
    methods {
      title
      list {
        description
        position
      }
    }
    recipeDetails {
      preperationTime
      serves
      totalTime
      cookTime
      readyTime
    }
    recipeId
    tagGroups {
      label
      name
      tags {
        id
        name
      }
    }
    title
    nutrients {
      description
      displayUnit
      dv
      epercent
      isCore
      name
      position
      rawRiPercent
      rawDvPercent
      rawValue
      ri
      unit
      value
    }
    nutrientsPerServing {
      description
      displayUnit
      dv
      epercent
      isCore
      name
      position
      rawRiPercent
      rawDvPercent
      rawValue
      ri
      unit
      value
    }
    localImage {
      childImageSharp {
        fluid {
          base64
          aspectRatio
          width
          height
          src
          srcWebp
          srcSet
          srcSetWebp
          sizes
          url
          title
        }
      }
    }
    videos {
      url
      id
    }
`;

const component = path.resolve(`./src/templates/RecipePage/RecipePage.tsx`);

module.exports = async ({ graphql, createPage, page }) => {
  const result = await graphql(`
    {
      allRecipe {
        nodes {
          ${RecipeFields}
        }
      }
    }
  `);
  const allRecipe = result.data.allRecipe.nodes;
  const allRecipeWithTagIds = allRecipe.map(recipe => ({
    ...recipe,
    tagIds: recipe.tagGroups.reduce(
      (tagIdsList, tagGroup) =>
        tagGroup.tags
          ? [...tagIdsList, ...tagGroup.tags.map(({ id }) => id)]
          : tagIdsList,
      []
    ),
  }));

  allRecipeWithTagIds.forEach(node => {
    const RELATED_RECIPES_COUNT = 6;
    createPage({
      path: node.fields.slug,
      component,
      context: {
        title: node.title,
        page,
        recipe: omit(node, ['tagIds']),
        relatedRecipes: reject(
          take(
            orderBy(
              allRecipeWithTagIds,
              [recipe => intersection(node.tagIds, recipe.tagIds).length],
              ['desc']
            ),
            RELATED_RECIPES_COUNT + 1 // one if for rejecting the same recipe from result
          ),
          (recipe, i) =>
            recipe.recipeId === node.recipeId || i > RELATED_RECIPES_COUNT
        ),
        tagIds: node.tagIds,
      },
    });
  });
};

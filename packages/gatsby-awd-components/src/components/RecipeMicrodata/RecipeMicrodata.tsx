import React, { useCallback, FunctionComponent } from 'react';
import { RecipeMicrodataProps } from './index';
import flatten from 'lodash/flatten';
import get from 'lodash/get';

const minutesToISOTime = (minutes: number | undefined): string => {
  if (minutes) {
    // @ts-ignore
    const date = new Date(null);
    date.setMinutes(minutes);
    return date.toISOString().substr(11, 8);
  }
  return '';
};

const tagGroupsToCategories = [
  'dishes',
  'mainIngredient',
  'cuisines',
  'difficulties',
  'dietary',
  'budgets',
  'annualEvents',
];
const getCategoryByTags = (tagGroups: RMSData.TagGroupings[]) => {
  let category;
  for (let i = 0; i < tagGroupsToCategories.length; i++) {
    const group = tagGroups.find(
      tagGroup => tagGroup.label === tagGroupsToCategories[i]
    );
    if (group && group.tags) {
      category = (group.tags[0] || {}).name;
      break;
    }
  }
  return category;
};

const getTagsInStringFormat = (tagGroups: RMSData.TagGroupings[]) => {
  let count = 0;
  return tagGroups.map(tagGroup => {
      return tagGroup.tags.map(tag => {
        if (tag.name === '' || count === 9) return;
        count++;
        return tag.name;
      });
    })
    .toString().trim().replace(/,{1,}^,|,$|,(?=,)/g, '');
};

const RecipeMicrodata: FunctionComponent<RecipeMicrodataProps> = ({
  recipe,
  showAsText = false,
}) => {
  const getNutrientPropDescription = useCallback(
    (prop: string) =>
      // @ts-ignore
      (recipe.nutrients.find(item => item.name === prop) || {}).description,
    [recipe]
  );

  const ingredients = flatten(
    recipe.ingredients
      .filter(ingredientsGroup => ingredientsGroup.list.length)
      .map(ingredientsGroup =>
        ingredientsGroup.list.map(
          ingredientsGroup => ingredientsGroup.description
        )
      )
  );

  const instructions = flatten(
    recipe.methods
      .filter(methodsGroup => methodsGroup.list.length)
      .map(methodsGroup =>
        methodsGroup.list
          .sort((a, b) => a.position - b.position)
          .map(method => method.description)
      )
  );

  const nutritions = {
    '@type': 'NutritionInformation',
    calories: getNutrientPropDescription('energy_kcal'),
    carbohydrateContent: getNutrientPropDescription('carbohydrate_excl_fibre'),
    cholesterolContent: getNutrientPropDescription('cholesterol'),
    fatContent: getNutrientPropDescription('fat'),
    fiberContent: getNutrientPropDescription('fibre'),
    proteinContent: getNutrientPropDescription('protein'),
    saturatedFatContent: getNutrientPropDescription('saturated_fat'),
    sodiumContent: getNutrientPropDescription('sodium'),
    sugarContent: getNutrientPropDescription('sugar'),
    transFatContent: getNutrientPropDescription('trans_fat'),
    unsaturatedFatContent: getNutrientPropDescription('unsaturated_fat'),
  };

  const recipeData = {
    '@context': 'http://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    image: recipe.localImage.childImageSharp.fluid.src,
    datePublished: recipe.creationTime,
    description: recipe.description,
    recipeYield: recipe.recipeDetails.serves,
    cookTime: minutesToISOTime(
      recipe.recipeDetails.cookTime || recipe.recipeDetails.totalTime
    ),
    prepTime: minutesToISOTime(recipe.recipeDetails.preperationTime),
    recipeIngredient: ingredients,
    recipeInstructions: instructions,
    nutrition: nutritions,
    recipeCuisine: get(
      get(recipe, 'tagGroups', []).find(group => group.name === 'cuisines'),
      'tags[0]',
      {}
    ).name || 'null',
    recipeCategory: getCategoryByTags(recipe.tagGroups) || 'null',
    author:{ "@type": "Organization", "name": "Recepedia Team" },
    video: { "@type": "CreativeWork", "name": "null" },
    keywords: recipe.title + "," + getTagsInStringFormat(recipe.tagGroups),
  };

  return showAsText ? (
    <div>{JSON.stringify(recipeData)}</div>
  ) : (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeData) }} />
  );
};

export default RecipeMicrodata;

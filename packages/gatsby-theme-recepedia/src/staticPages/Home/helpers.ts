import { getUserProfileByKey } from '../../utils/browserStorage';
import { ProfileKey } from '../../utils/browserStorage/models';
import generateQuery from '../../utils/queryGenerator';
import { RecipePersonalizationFormula } from '../../constants';
import getPersonalizationSearchData, {
  FROM,
  RESULT_SIZE,
} from '../../utils/getPersonalizationSearchData';

export function isQuizesStored() {
  return !!Object.keys(getUserProfileByKey(ProfileKey.initialQuiz)).length;
  //TODO: if Quiz formula will contains mealPlaner results - next line should be use too.
  // || !!Object.keys(getUserProfileByKey(ProfileKey.mealPlannerAnswers)).length
}

export async function searchRecipes(
  i = 0,
  resultNumber = RESULT_SIZE,
  defaults: Internal.Recipe[],
  params: SearchParams = {}
): Promise<Internal.Recipe[]> {
  const param = {
    from: FROM,
    size: RESULT_SIZE,
    sort: [
      { averageRating: { order: 'desc' } },
      { creationTime: { order: 'desc' } },
    ],
    ...params,
  };

  let j = i;
  const maxTry = RecipePersonalizationFormula.template.length;
  const introQuizAnswers = getUserProfileByKey(ProfileKey.initialQuiz);
  const mealPlanerAnswers = getUserProfileByKey(ProfileKey.mealPlannerAnswers);
  const queryString = generateQuery(
    introQuizAnswers,
    mealPlanerAnswers,
    RecipePersonalizationFormula,
    i
  );

  const {
    body: { hits },
  } = await getPersonalizationSearchData(queryString, param);
  if (hits.hits.length < resultNumber && i < maxTry - 1) {
    j = i + 1;
    return searchRecipes(j, resultNumber, defaults, param);
  } else if (hits.hits.length < resultNumber && i >= maxTry - 1) {
    const res = hits.hits.map(hit => hit._source);
    return res.length > 0
      ? [...res, ...defaults].slice(0, RESULT_SIZE)
      : defaults;
  } else {
    return hits.hits.map(hit => hit._source);
  }
}

export async function getRecipes(
  defaults: Internal.Recipe[],
  params?: SearchParams
) {
  return isQuizesStored()
    ? await searchRecipes(0, RESULT_SIZE, defaults, params)
    : defaults;
}

export interface SearchParams {
  from?: number;
  size?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sort?: any[];
  exclude?: any[];
}

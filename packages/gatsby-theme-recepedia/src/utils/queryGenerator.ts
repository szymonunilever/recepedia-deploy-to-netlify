import map from 'lodash/map';
import compact from 'lodash/compact';

import { RecipePersonalizationFormulaProps } from '../constants';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const objectToArray = (obj: any): any[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const arr: any[] = [];
  map(obj, (item, key) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let str: any = key.match(/\d+/);
    str = str && str[0];
    const k = str && parseInt(str) - 1;
    arr[k] = item;
  });
  return arr;
};

const generateQueryString = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quiz: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mealPlaner: any,
  { template, searchAttributes }: RecipePersonalizationFormulaProps,
  indexTry = 0
) => {
  const delimiter = /;/g;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const arrayToQueryPart = (prop: any[]) => {
    for (const key in prop) {
      const [searchPath, value] = [
        searchAttributes[prop[key].filterPropName],
        prop[key].value,
      ];
      if (Array.isArray(value)) {
        prop[key] = `${searchPath}:(${compact(
          value
            .filter(item => item !== '')
            .join(';')
            .replace(';;', ';')
            .split(delimiter)
        ).join(' OR ')})`;
      } else if (delimiter.test(value)) {
        prop[key] = `${searchPath}:(${compact(value.split(delimiter)).join(
          ' OR '
        )})`;
      } else {
        prop[key] = `${searchPath}:${value}`;
      }
    }
    return prop;
  };

  const q = quiz && objectToArray(quiz);
  const mp = mealPlaner && objectToArray(mealPlaner);
  q && arrayToQueryPart(q);
  mp && arrayToQueryPart(mp);
  const operator = template[indexTry].match(/AND|OR/g);
  const parts = template[indexTry].replace(/[()]/g, '').split(/AND|OR/);

  const params: { param: any; weight: string }[] = parts.map(str => {
    const arr = str.split('^');
    return { param: arr[0], weight: arr[1] };
  });

  const formAnswer = (param: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let [quiz, mealPlaner]: [any, any] = [
      param.match(/Q#(.)/),
      param.match(/MP#(.)/),
    ];
    quiz && (quiz = parseInt(quiz[1]));
    mealPlaner && (mealPlaner = parseInt(mealPlaner[1]));
    quiz = q[quiz - 1];
    mealPlaner = mp[mealPlaner - 1];
    return quiz || mealPlaner;
  };

  return params.reduce((prev, { param, weight }, i, params) => {
    const realAnswer = formAnswer(param);
    const previousAnswer = params[i - 1]
      ? formAnswer(params[i - 1].param)
      : undefined;
    const nextAnswer = params[i + 1]
      ? formAnswer(params[i + 1].param)
      : undefined;

    const isUndefined = /undefined|\S+:\(\)/.test(realAnswer);
    const nextUndefined = /undefined|\S+:\(\)/.test(nextAnswer);
    const previousUndefined = /undefined|\S+:\(\)/.test(previousAnswer);

    if (!isUndefined && weight && operator && operator[i] && !nextUndefined) {
      return prev + `(${realAnswer})^${weight} ${operator[i]} `;
    } else if (!isUndefined && operator && operator[i] && !nextUndefined) {
      return prev + `(${realAnswer}) ${operator[i]} `;
    } else if (!isUndefined && weight) {
      return prev + `(${realAnswer})^${weight}`;
    } else if (!isUndefined) {
      return prev + `(${realAnswer})`;
    } else if (
      isUndefined &&
      !nextUndefined &&
      !previousUndefined &&
      operator &&
      operator[i]
    ) {
      return prev + `${operator[i]} `;
    } else {
      return prev;
    }
  }, '');
};

export default generateQueryString;

const Auth = require('@aws-amplify/auth').default;
const Amplify = require('aws-amplify').default;
const axios = require('axios');
const times = require('lodash/times');
const blocksToHtml = require('@sanity/block-content-to-html');

global['fetch'] = require('node-fetch');

const [
  region,
  userPoolId,
  userPoolWebClientId,
  buildUser,
  buildUserPassword,
  indexUrl,
  recipeIndex,
  articleIndex,
  productIndex,
] = [
  process.env['elasticSearch_region'],
  process.env['elasticSearch_userPoolId'],
  process.env['elasticSearch_userPoolWebClientId'],
  process.env['elasticSearch_buildUser'],
  process.env['elasticSearch_buildUserPassword'],
  process.env['elasticSearch_indexUrl'],
  process.env['elasticSearch_recipeIndex'],
  process.env['elasticSearch_articleIndex'],
  process.env['elasticSearch_productIndex'],
];

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region,
    userPoolId,
    userPoolWebClientId,
  },
});

async function signIn() {
  const user = await Auth.signIn(buildUser, buildUserPassword);
  return user
    .getSignInUserSession()
    .getIdToken()
    .getJwtToken();
}

const tokenPromis = signIn();

const BATCH_SIZE = 300;

const bulkPost = (data, url, token) => {
  return axios.post(`${url}/bulk`, data, {
    headers: { 'Content-Type': 'application/json', Authorization: token },
  });
};

const clearIndex = (url, index, token) => {
  axios.post(
    `${url}/${index}/clear`,
    {
      query: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        match_all: {},
      },
    },
    {
      headers: { 'Content-Type': 'application/json', Authorization: token },
    }
  );
};

const bulkBatchPost = (
  items,
  idField,
  esUrl,
  esIndex,
  fieldsToDelete,
  token
) => {
  const noOfBatches = Math.ceil(items.length / BATCH_SIZE);

  const promises = times(noOfBatches, i => {
    const startItem = BATCH_SIZE * i;
    const endItem = BATCH_SIZE * (i + 1);

    const bulkRows = items.slice(startItem, endItem).map(item => {
      if (item) {
        // each datarow requires a header row like the below
        const headerRow = {
          index: {
            _index: esIndex,
            _type: '_doc',
            _id: item[idField],
          },
        };

        // Delete unnecessary fields
        fieldsToDelete.forEach(field => delete item[field]);

        return `${JSON.stringify(headerRow)}\n${JSON.stringify(item)}`;
      }
    });

    // format required by ES needs newline at end of each row
    return bulkPost(bulkRows.join('\n') + '\n', esUrl, token);
  });

  return Promise.all(promises);
};

const updateRecipes = async recipes => {
  const index = recipeIndex;
  const token = await tokenPromis;
  await clearIndex(indexUrl, index, token);

  return bulkBatchPost(
    recipes,
    'recipeId',
    indexUrl,
    index,
    [
      'parent',
      'children',
      'internal',
      'methods',
      'nutrients',
      'nutrientsPerServing',
    ],
    token
  );
};

const updateArticles = async articles => {
  const index = articleIndex;
  const token = await tokenPromis;
  //if (await isIndexExists(indexUrl, index, token)) {
  await clearIndex(indexUrl, index, token);
  //}
  articles.map(article => {
    if (article.content) {
      article.content = blocksToHtml({
        blocks: JSON.parse(article.content),
      });
    }
  });

  return bulkBatchPost(
    articles,
    'id',
    indexUrl,
    index,
    ['parent', 'children', 'internal'],
    token
  );
};

const updateProducts = async products => {
  const index = productIndex;
  const token = await tokenPromis;
  await clearIndex(indexUrl, index, token);

  return bulkBatchPost(
    products,
    'id',
    indexUrl,
    index,
    ['parent', 'children', 'internal'],
    token
  );
};

module.exports = { updateRecipes, updateArticles, updateProducts };

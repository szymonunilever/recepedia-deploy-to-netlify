const axios = require('axios');
const createNodes = require('./createNodes');
const {
  createPagesNodes,
  createComponentsNodes,
  createArticleNodes,
} = createNodes;
const pagesMock = require('../../src/components/data/pages.json');

const fetchContent = (configOptions, contentType) => {
  return axios.get(
    configOptions.endpoint.replace('{contentType}', `${contentType}`),
    {
      headers: {
        'x-api-key': configOptions.key,
      },
    }
  );
};

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions;

  delete configOptions.plugins;

  const [
    pagesResponse,
    componentsResponse,
    articlesResponse,
  ] = await Promise.all([
    fetchContent(configOptions, 'pages'),
    fetchContent(configOptions, 'components'),
    fetchContent(configOptions, 'articles'),
  ]);

  // please add to pagesData local page json mocks for development purposes if page on BE does not exist or incorrect
  // e.g. const pagesData = [...pagesResponse.data.pages, newPageMock];
  const pagesData = [...pagesMock.pages];

  pagesData.forEach(page => {
    createPagesNodes(page, { createNodeId, createContentDigest, createNode });
  });

  componentsResponse.data.components.components.items.forEach(component => {
    createComponentsNodes(component, {
      createNodeId,
      createContentDigest,
      createNode,
    });
  });

  articlesResponse.data.articles.forEach(article => {
    createArticleNodes(article, {
      createNodeId,
      createContentDigest,
      createNode,
    });
  });
};

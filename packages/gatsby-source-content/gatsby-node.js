const axios = require('axios');
const createNodes = require('./createNodes');
const {
  createPagesNodes,
  createComponentsNodes,
  createArticleNodes,
  createCategoryNodes,
  createDictionaryNodes,
  createDisclaimerNodes,
} = createNodes;
const articlesMockMx = require('./data/articles-mx.json');
const pagesMockBr = require('./data/pages.json');
const componentsMockBr = require('./data/components.json');
const pagesMockMx = require('./data/pages-mx.json');
const componentsMockMx = require('./data/components-mx.json');
const categoriesMockMx = require('./data/categories-mx.json');
const categoriesMockBr = require('./data/categories.json');

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
  const isMx = () => configOptions.locale === 'es-mx';
  delete configOptions.plugins;

  const [
    // pagesResponse,
    // componentsResponse,
    articlesResponse,
    categoriesResponse,
  ] = await Promise.all([
    //fetchContent(configOptions, 'pages'),
    //fetchContent(configOptions, 'components'),
    isMx()? new Promise(resolve => resolve(articlesMockMx)) : fetchContent(configOptions, 'articles'),
    //isMx()? new Promise(resolve => resolve({data:categoriesMockMx})) : fetchContent(configOptions, 'aem/categories'),
    new Promise(resolve => resolve({data: isMx() ? categoriesMockMx : categoriesMockBr})),
  ]);
  // please add to pagesData local page json mocks for development purposes if page on BE does not exist or incorrect
  // e.g. const pagesData = [...pagesResponse.data.pages, newPageMock];
  const pagesMock = isMx() ? pagesMockMx : pagesMockBr;
  const componentsMock = isMx() ? componentsMockMx : componentsMockBr;
  const pagesData = [...pagesMock.pages];
  //TODO: remove next string when data for components will fixed on middleware
  const componentsData = componentsMock;
  pagesData.forEach(page => {
    createPagesNodes(page, { createNodeId, createContentDigest, createNode });
  });

  //TODO: modify next two functions when data for components will be fixed on middleware.
  componentsData.components.components.items.forEach(component => {
    createComponentsNodes(component, {
      createNodeId,
      createContentDigest,
      createNode,
    });
  });
  componentsData.dictionary &&
    createDictionaryNodes(componentsData.dictionary, {
      createNodeId,
      createContentDigest,
      createNode,
    });

  componentsData.disclaimer &&
    createDisclaimerNodes(componentsData.disclaimer, {
      createNodeId,
      createContentDigest,
      createNode,
    });

  //  componentsResponse.data.components.components.items.forEach(component => {
  //   createComponentsNodes(component, {
  //     createNodeId,
  //     createContentDigest,
  //     createNode,
  //   });
  // });

  const articlesList = isMx() ?
    articlesResponse.data.articleEntries.results :
    articlesResponse.data.articles;

  articlesList.forEach(article => {
    const { id, path, brand, section, articleName, articleContent, tags } = article;
    const articleNode = {
      id, path, brand, section,
      name: articleName,
      title: articleName,
      content: JSON.stringify(articleContent),
      assets: []
    };
    createArticleNodes(
      articleNode,
      isMx() ? articlesResponse.data.assets.results : [],
      {
        createNodeId,
        createContentDigest,
        createNode,
      }
    );
  });

  categoriesResponse.data.forEach(
    item =>
      item &&
      createCategoryNodes(item, {
        createNodeId,
        createContentDigest,
        createNode,
      })
  );
};

exports.createSchemaCustomization = ({ actions: { createTypes } }) => {
  const typeDefs = `
    type Category implements Node {
      id: Int!
      children: [Category]
      parentId: Int
      name: String!
      description: String
      title: String
      titlePlural: String
      seasonalPromo: [CategoryTag]
      image: CategoryImage
      recipeDetails: CategoryRecipeDetails
      inNavigation: Boolean
      inFooter: Boolean
      showOnHomePage: Int
      categoryOrder: Int
      tags: [CategoryTag]
      primaryTag: CategoryTag
    }
    
    type CategoryTag {
      id: Int!
      name: String!
    }
    type CategoryImage {
      base64: String
      aspectRatio: Float
      width: Float
      height: Float
      src: String
      srcWebp: String
      srcSet: String
      srcSetWebp: String
      sizes: String
    }
    type CategoryRecipeDetails {
      serves: String
      cookTime: String
    }
    
    type Article implements Node {
      id: String!
      title: String
      name: String!
      shortDescription: String
      content: String
      assets: [ArticleAsset]
      fields: ArticleSlugField
    }
    type ArticleAsset {
      filename: String!
      id: String!
      path: String!
    }
    type ArticleSlugField {
      slug: String!
    }
  `;
  createTypes(typeDefs);
};

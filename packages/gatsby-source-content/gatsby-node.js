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
const articlesMockBr = require('./data/articles-br.json');
const pagesMockBr = require('./data/pages.json');
const componentsMockBr = require('./data/components.json');
const pagesMockMx = require('./data/pages-mx.json');
const componentsMockMx = require('./data/components-mx.json');
const categoriesMockMx = require('./data/categories-mx.json');
const categoriesMockBr = require('./data/categories.json');
const brandNameUtils = require('./utils/brandNameUtils');

const fetchContent = (configOptions, contentType) => {
  return axios.get(
    configOptions.endpoint.replace('{contentType}', `${contentType}`),
    {
      headers: {
        'x-api-key': configOptions.key,
      },
    }
  ).catch(error =>
    console.error(
      'Fetch content error',
      configOptions.endpoint,
      contentType,
      error
    )
  );
};

const fetchImage = (endpoint, params) => {
  return axios.get(endpoint, { params })
    .catch(error => console.error(
      'Fetch image error',
      endpoint,
      params,
      error
    ));
};

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions;
  const isMx = () => configOptions.locale === 'es-mx';
  delete configOptions.plugins;

  const [
    pagesResponse,
    componentsResponse,
    articlesResponse,
    categoriesResponse,
  ] = await Promise.all([
      new Promise(resolve => resolve (isMx() ? pagesMockMx : pagesMockBr)),
      new Promise(resolve => resolve (isMx() ? componentsMockMx : componentsMockBr)),
      new Promise(resolve => resolve (isMx() ? articlesMockMx : articlesMockBr)),
      new Promise(resolve => resolve (isMx() ? categoriesMockMx : categoriesMockBr)
    ),
  ]);

  const pagesData = [...pagesResponse.pages];
  const componentsData = componentsResponse;
  pagesData.forEach(page => {
    createPagesNodes(page, { createNodeId, createContentDigest, createNode });
  });

  const createNodeParams = {
    createNodeId,
    createContentDigest,
    createNode,
  };
  componentsData.components.components.items.forEach(component => {
    createComponentsNodes(component, createNodeParams);
  });
  componentsData.dictionary &&
    createDictionaryNodes(componentsData.dictionary, createNodeParams);

  componentsData.disclaimer &&
    createDisclaimerNodes(componentsData.disclaimer, createNodeParams);

  const imagesKeys = [];
  articlesResponse.data.articleEntries.results.forEach(article =>
    article.articleHeroImage && imagesKeys.push(article.articleHeroImage)
  );
  categoriesResponse.forEach(category => {
    category.imageKey && imagesKeys.push(category.imageKey);
    category.categories && category.categories.forEach(subcat =>
      subcat.imageKey && imagesKeys.push(subcat.imageKey)
    );
  });

  const imagesCollection = await Promise.all(
    imagesKeys.map(imgKey => fetchImage(configOptions.imagesEndpoint,
      { keys: imgKey }
    ))
  );

  const imagesData = imagesCollection.reduce((response, item) => {
   response[item.data[0]['pk']] = { childImageSharp: { fluid: item.data[0] } };
   return response;
  }, {});

  const defaultImageKey = Object.keys(imagesData)[0];
  const getImage = (article, imagesData) => {
    return imagesData[article.articleHeroImage || defaultImageKey]
  };

  articlesResponse.data.articleEntries.results.forEach(article => {
    const { id, path, brand, section, articleName, articleContent, tags, creationTime } = article;
    const formattedBrand = brand ? brandNameUtils.brandNameHandler(brand) : '';
    const articleNode = {
      id, path, section, creationTime, tags,
      brand: formattedBrand,
      name: articleName,
      title: articleName,
      localImage: getImage(article, imagesData),
      content: JSON.stringify(articleContent),
      assets: [],
      brandTheme: isMx() ? formattedBrand : '',
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

  const enhanceCategoryItem = (category, imagesData) => ({
    ...category,
      image: category.image ? category.image :
        imagesData[category.imageKey].childImageSharp.fluid
  });
  categoriesResponse.forEach(
    item => {
      const categoryItem = {
        ...enhanceCategoryItem(item, imagesData),
        categories: item.categories ?
          item.categories.map(cat => enhanceCategoryItem(cat, imagesData)) :
          [],
      };

      createCategoryNodes(categoryItem, createNodeParams);
    }
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
      brand: String
      brandTheme: String
      section: String
      name: String!
      shortDescription: String
      creationTime: String
      content: String
      localImage: ArticleImage
      assets: [ArticleAsset]
      fields: ArticleSlugField
      brand: String
      tags: [Int]
    }
    type ArticleImage {
      childImageSharp: ArticleImageChild
    }
    type ArticleImageChild {
      fluid: ArticleImageChildFluid
    }
    type ArticleImageChildFluid {
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

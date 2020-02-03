const trim = require('lodash/trim');
const brandNameUtils = require('./utils/brandNameUtils');

exports.createRecipeNodes = (
  recipe,
  { createNodeId, createContentDigest, createNode }
) => {
  // Temporary solution to re-use existing components data structure
  // Should be reviewed as soon as we agree a common approach and data structures to work with images
  recipe.localImage = {
    childImageSharp: { fluid: recipe.assets.images.default },
  };

  const extractYoutubeIdFromUrl = urlString => {
    const urlObj = new URL(urlString);
    const idFromSearchParams = urlObj.searchParams.get('v');
    return idFromSearchParams ? idFromSearchParams : urlObj.pathname.slice(1);
  };

  recipe.videos = recipe.assets.videos
    ? Object.values(recipe.assets.videos).map(video => ({
        id: extractYoutubeIdFromUrl(video.url),
        url: video.url,
      }))
    : [];

  recipe.brand = recipe.featuredBrand
    ? brandNameUtils.brandNameHandler(recipe.featuredBrand)
    : '';

  delete recipe.assets;

  const nodeId = createNodeId(`recipe-${recipe.id}`);

  createNode({
    ...recipe,
    id: nodeId,
    recipeId: recipe.id,
    parent: null,
    children: [],
    internal: {
      type: 'Recipe',
      contentDigest: createContentDigest(recipe),
    },
  });
};

const processTag = (
  tag,
  parentNodeId,
  { createNodeId, createContentDigest, createNode },
  dictionary,
  disclaimerDict
) => {
  const nodeId = createNodeId(`tag-${tag.id}`);
  const name = tag.name;
  const title =
    dictionary && dictionary[name]
      ? dictionary[name]
      : trim(name.replace(/\s+/g, ' '))
          .toLowerCase()
          .replace(/[_-]/, ' ')
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, occ => occ.toUpperCase());
  const disclaimer =
    disclaimerDict && disclaimerDict[`${tag.id}`]
      ? disclaimerDict[`${tag.id}`]
      : null;
  createNode({
    ...tag,
    title,
    disclaimer,
    id: nodeId,
    tagId: tag.id,
    parent: parentNodeId,
    children: [],
    internal: {
      type: 'Tag',
      contentDigest: createContentDigest(tag),
    },
  });
  return nodeId;
};

exports.createTagGroupingsNodes = (
  tagGroupings,
  { createNodeId, createContentDigest, createNode },
  dictionary,
  disclaimer
) => {
  const nodeId = createNodeId(`tagGroupings-${tagGroupings.name}`);
  const tags = tagGroupings.tags.filter(tag => tag && tag.id);
  const { name } = tagGroupings;
  const label = dictionary && dictionary[name] ? dictionary[name] : null;
  createNode({
    ...tagGroupings,
    label,
    id: nodeId,
    parent: null,
    children: tags.map(tag =>
      processTag(
        tag,
        nodeId,
        {
          createNodeId,
          createContentDigest,
          createNode,
        },
        dictionary,
        disclaimer
      )
    ),
    internal: {
      type: 'TagGroupings',
      contentDigest: createContentDigest(tagGroupings),
    },
  });
};

/* eslint-disable no-console */
const url = require('url');
const fs = require('fs');
const get = require('lodash/get');
const path = require('path');
const utils = require('./scripts/utils');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const getPageTemplate = require('./scripts/build/getPageTemplate');
const createDefaultPages = require('./scripts/build/createDefaultPages');
const createRecipePages = require('./scripts/build/createRecipePages');
const createProductPages = require('./scripts/build/createProductPages');
const createArticlePages = require('./scripts/build/createArticlePages');
const createRemoteImageNode = require('./scripts/build/createRemoteImageNode');
const createContentHubPages = require('./scripts/build/createContentHubPages');
const createCategoryPages = require('./scripts/build/createCategoryPages');
const updateES = require('./scripts/build/updateElasticsearch');
const constants = require('./scripts/constants');
const getStaticLists = require('./scripts/build/getStaticLists');
const getRedirectRules = require('./scripts/build/getRedirectRules');
const generateRedirectMap = require('./scripts/build/generateRedirectMap');
const generateProductsFeed = require('./scripts/build/generateProductsFeed');

const urlPartialsByTypeMap = {
  Article: 'title',
  Recipe: 'title',
  Tag: 'title',
  Category: 'title',
  Product: 'productName',
};

const addTrailingSlash = path => {
  try {
    return path && path.endsWith('/') ? path : `${path}/`;
  } catch (err) {
    console.error(err);
  }
};

const findPageFromNodes = (pagesNodes, pageType) =>
  pagesNodes.find(pageNode => pageNode.type === pageType);

const formatUrlPartial = (partial = '') =>
  partial
    .normalize('NFD')
    .replace(/[^a-zA-Z0-9\s-]+/g, char => {
      let latinMap = {
        "Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","ẞ":"SS","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ß":"ss","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"
      };

      return latinMap[char] || '';
    })
    .replace(/[_-]/, ' ')
    .toLowerCase()
    .trim()
    .split(' ')
    .join('-')
    .replace(/(-)(?=\1)/g, ''); // replace same concurrent - with single one

const getSlugFromPath = (path, node, prependWithField = null) => {
  const urlPartial = urlPartialsByTypeMap[node.internal.type] || 'id';
  const itemPath = prependWithField
    ? `${node[prependWithField]}-${node[urlPartial]}`
    : node[urlPartial];

  return addTrailingSlash(
    url
      .resolve(path, formatUrlPartial(itemPath))
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  );
};

const createSlugFor = ({ path, node, createNodeField, prependWithField }) => {
  const slug = getSlugFromPath(path, node, prependWithField);

  createNodeField({
    node,
    name: 'slug',
    value: slug,
  });
};

exports.onCreateNode = async ({
  node,
  actions,
  store,
  cache,
  createNodeId,
  getNodesByType,
}) => {
  const getPagePath = pageType => {
    const path = get(
      findPageFromNodes(getNodesByType(constants.NODE_TYPES.PAGE), pageType),
      'relativePath',
      '/'
    );

    return addTrailingSlash(path);
  };

  const { createNodeField, createNode } = actions;

  switch (node.internal.type) {
    case constants.NODE_TYPES.RECIPE:
      {
        const dishGroup = node.tagGroups.find(({ name }) => name === 'dishes');
        const dishName = get(dishGroup, 'tags[0].name');

        createSlugFor({
          path: `${getPagePath(
            constants.TEMPLATE_PAGE_TYPES.RECIPE
          )}${addTrailingSlash(formatUrlPartial(dishName || 'dish'))}`,
          node,
          createNodeField,
          prependWithField: 'recipeId',
        });
      }
      break;
    case constants.NODE_TYPES.TAG:
      createSlugFor({
        path: getPagePath(constants.TEMPLATE_PAGE_TYPES.TAG),
        node,
        createNodeField,
      });
      break;
    case constants.NODE_TYPES.PRODUCT:
      {
        const brand = node.brand.toLowerCase();
        const productPageTemplate = getNodesByType(
          constants.NODE_TYPES.PAGE
        ).find(
          item =>
            item.type === constants.TEMPLATE_PAGE_TYPES.PRODUCT_DETAILS &&
            item.brand === brand
        );

        createSlugFor({
          path: addTrailingSlash(productPageTemplate.relativePath),
          node,
          createNodeField,
          prependWithField: 'productId',
        });
      }
      break;
    case constants.NODE_TYPES.CATEGORY:
      {
        createSlugFor({
          path: getPagePath(
            node.children && node.children.length > 0
              ? constants.TEMPLATE_PAGE_TYPES.CATEGORY_LANDING
              : constants.TEMPLATE_PAGE_TYPES.CATEGORY
          ),
          node,
          createNodeField,
        });
      }
      break;
    case constants.NODE_TYPES.ARTICLE: {
      createSlugFor({
        path: getPagePath(constants.TEMPLATE_PAGE_TYPES.ARTICLE),
        node,
        createNodeField,
      });

      await Promise.all(
        node.assets.map(async asset => {
          const { type, content } = asset;
          if (type === 'Image' && content.url) {
            const imgNode = await createRemoteImageNode(
              /*content.url*/ undefined,
              node.id,
              createNodeField,
              {
                store,
                cache,
                createNode,
                createNodeId,
              }
            );
            asset.content['localImage___NODE'] = imgNode.id;
          } else if (type === 'Video') {
            const imgNode = await createRemoteImageNode(
              undefined,
              node.id,
              createNodeField,
              {
                store,
                cache,
                createNode,
                createNodeId,
              }
            );
            asset.content.preview['previewImage___NODE'] = imgNode.id;
          }
          return asset;
        })
      );
      break;
    }

    case constants.NODE_TYPES.PAGE: {
      await Promise.all(
        node.components.items.map(async component => {
          const createRemoteImageCallback = async index => {
            let fileNode;
            const asset = component.assets[index];
            try {
              fileNode = await createRemoteImageNode(
                asset.url,
                node.id,
                createNodeField,
                {
                  store,
                  cache,
                  createNode,
                  createNodeId,
                }
              );
              asset[`localImage___NODE`] = fileNode.id;
            } catch (error) {
              console.error(error);
            }
          };

          for (let index = 0; index < component.assets.length; index++) {
            await createRemoteImageCallback(index);
          }
        })
      );
      break;
    }
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const createPageFromTemplate = (edge, page) => {
    const slug = addTrailingSlash(edge.node.fields.slug);
    createPage({
      path: slug,
      component: path.resolve(getPageTemplate(page.type)),
      context: {
        page,
        edge,
        slug,
        name: edge.node.name,
        title: get(edge, 'node.title'),
        nextSlug: addTrailingSlash(get(edge, 'next.fields.slug')),
        previousSlug: addTrailingSlash(get(edge, 'previous.fields.slug')),
      },
    });
  };

  const pages = await createDefaultPages({
    graphql,
    createPage: page => {
      const slug = addTrailingSlash(page.relativePath);
      createPage({
        path: slug,
        component: path.resolve(getPageTemplate(page.type)),
        context: {
          title: get(page, 'title'),
          brand: get(page, 'brand'),
          regexpBrand: get(page, 'brand')
            ? '/' + get(page, 'brand') + '/i'
            : '',
          slug,
          page,
          ...getStaticLists(page.components.items),
        },
      });
    },
  });

  // Get the page data for each page type
  const recipeDetailsData = findPageFromNodes(
    pages,
    constants.TEMPLATE_PAGE_TYPES.RECIPE
  );
  const productDetailsTemplates = pages.filter(
    pageNode => pageNode.type === constants.TEMPLATE_PAGE_TYPES.PRODUCT_DETAILS
  );
  const articleDetailsData = findPageFromNodes(
    pages,
    constants.TEMPLATE_PAGE_TYPES.ARTICLE
  );
  const recipeCategoryData = findPageFromNodes(
    pages,
    constants.TEMPLATE_PAGE_TYPES.CATEGORY
  );
  const categoryLandingData = findPageFromNodes(
    pages,
    constants.TEMPLATE_PAGE_TYPES.CATEGORY_LANDING
  );
  const contentHubData = findPageFromNodes(
    pages,
    constants.TEMPLATE_PAGE_TYPES.TAG
  );
  const pagesCreators = [
    createRecipePages({
      graphql,
      createPage,
      page: recipeDetailsData,
    }),
    createProductPages({
      graphql,
      createPage,
      pageTemplates: productDetailsTemplates,
    }),
    createCategoryPages({
      graphql,
      createPage,
      page: recipeCategoryData,
      landingPage: categoryLandingData,
    }),
    createContentHubPages({
      graphql,
      createPage: edge => {
        createPageFromTemplate(edge, contentHubData);
      },
    }),
  ];

  articleDetailsData &&
    pagesCreators.push(
      createArticlePages({
        graphql,
        createPage: edge => {
          createPageFromTemplate(edge, articleDetailsData);
        },
      })
    );

  await Promise.all(pagesCreators);
};

exports.onCreateWebpackConfig = ({
  actions,
  getConfig,
  stage,
  loaders,
  plugins,
}) => {
  const appConfig = require('./app-config')({
    locale: utils.parseArg('locale'),
  }).getConfig();

  // Create an object of all the variables in .env file
  const envKeys = Object.keys(appConfig).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(appConfig[next]);
    return prev;
  }, {});

  if (stage === 'build-javascript') {
    actions.setWebpackConfig({
      optimization: {
        splitChunks: {
          cacheGroups: {
            styles: {
              name: 'styles',
              test: /\.css$/,
              chunks: 'all',
              enforce: true,
            },
          },
        },
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
      },
      module: {
        rules: [
          {
            exclude: path.resolve(__dirname, 'node_modules'),
            include: path.resolve(
              __dirname,
              'src/_[A-Za-z]+\\.scss$|[A-Za-z]+\\.css$/'
            ),

            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
          },
        ],
      },
    });
  }

  actions.setWebpackConfig({
    plugins: [plugins.define(envKeys)],
  });

  const config = getConfig();
  config.resolve = {
    ...config.resolve,
    alias: { ...config.resolve.alias, lodash: 'lodash-es' },
  };
  const svgLoaderRule = config.module.rules.find(rule => {
    if (
      rule.test === /\.svg$/ && Array.isArray(rule.use)
        ? rule.use.length === 2
        : false
    ) {
      return rule;
    }
  });
  svgLoaderRule &&
    svgLoaderRule.use &&
    (svgLoaderRule.use[0].options.classIdPrefix = true);

  if (stage === 'develop') {
    config.module.rules.push({
      test: /react-hot-loader/,
      use: [loaders.js()],
    });
  }

  if (stage === 'build-html') {
    config.module.rules.push({
      test: /elasticsearch-browser/,
      use: loaders.null(),
    });
  }

  if (stage === `build-javascript`) {
    const cssExtractIndex = config.plugins.findIndex(
      pl => pl instanceof MiniCssExtractPlugin
    );

    config.plugins[cssExtractIndex] = new MiniCssExtractPlugin({
      filename: `[name].css`,
      chunkFilename: `[name].css`,
      ignoreOrder: true,
    });

    config.output = {
      filename: `[name].js`,
      chunkFilename: `[name].js`,
      path: getConfig().output.path,
      publicPath: getConfig().output.publicPath,
    };
  }

  actions.replaceWebpackConfig(config);
};

// TODO: As soon as a number of post build jobs will be increased the following part should be refactored
exports.onPostBuild = async ({ getNodes, graphql, getNodesByType }) => {
  // To run ES update pass `updateES=true` as a build param
  // To run redirects map generation pass `redirects-map=true` as a build param
  const args = process.argv.slice(2);
  if (!args) {
    return;
  }

  const checkParam = (argumentsList, paramName) =>
    argumentsList.some(item => {
      const argumentsList = item.split('=');
      return (
        argumentsList &&
        argumentsList.length &&
        argumentsList[0] === paramName &&
        argumentsList[1] === 'true'
      );
    });

  if (checkParam(args, 'redirects-map')) {
    // eslint-disable-next-line no-console
    console.log('Generating redirects map');

    const tstart = process.hrtime();

    // The config can be moved to AEM/config file or any place
    // Generation script works independently of the application and doesn't have any references outside
    const config = {
      newUrls: getNodesByType('SitePage').map(item => item.path),
      oldSitemapPath: [
        './old-sitemap/old-sitemap-1.xml',
        './old-sitemap/old-sitemap-2.xml',
      ],
      oldDomain: 'https://br.recepedia.com',
      JMESPathToUrls: `"ns1:urlset"."ns1:url"[]."ns1:loc"`,
      redirectRules: getRedirectRules(),
      otherwiseRedirectTo: '/',
    };

    await generateRedirectMap(config);

    // eslint-disable-next-line no-console
    console.log('Redirects map generation finished');

    const trend = process.hrtime(tstart);
    // eslint-disable-next-line no-console
    console.info('Execution time (hr): %ds %dms', trend[0], trend[1] / 1000000);
  }

  if (checkParam(args, 'updateES')) {
    // eslint-disable-next-line no-console
    console.log('updating ES');
    const hrstart = process.hrtime();
    const promises = [
      updateES.updateRecipes(getNodesByType(constants.NODE_TYPES.RECIPE)),
      updateES.updateArticles(getNodesByType(constants.NODE_TYPES.ARTICLE)),
      updateES.updateProducts(getNodesByType(constants.NODE_TYPES.PRODUCT)),
    ];
    await Promise.all(promises);
    const hrend = process.hrtime(hrstart);
    // eslint-disable-next-line no-console
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
  }

  if (checkParam(args, 'generateProductsFeed')) {
    const kritiqueProductsFeed = await generateProductsFeed(
      graphql,
      getNodesByType
    );
    console.log('Product feed generation');

    fs.writeFileSync('public/productsFeed.xml', kritiqueProductsFeed);
  }
};

/* eslint-disable @typescript-eslint/camelcase */

const path = require('path');
const utils = require('./scripts/utils');
const appConfig = require('./app-config')({ locale: utils.parseArg('locale') });
const { get } = require(`lodash`);

const siteMetadata = {
  title: appConfig.getByKey('meta_title'),
  brandName: appConfig.getByKey('meta_brandName'),
  author: appConfig.getByKey('meta_author'),
  description: appConfig.getByKey('meta_description'),
  siteUrl: appConfig.getByKey('meta_host'),
  lang: appConfig.getByKey('meta_lang'),
};

const productsQuery =
  appConfig.getByKey('locale').toLowerCase() === 'es-mx'
    ? `product {
  images {
    childImageSharp {
      fluid {
        src
      }
    }
  }
  productName
}`
    : '';

const sitemapQuery = `
{
  site {
    siteMetadata {
      siteUrl
    }
  }
  allSitePage {
    edges {
      node {
        path
        context {
          page {
            type
          }
          recipe {
            localImage {
              childImageSharp {
                fluid {
                  src
                }
              }
            }
            title
          }
          ${productsQuery}
        }
      }
    }
  }
}`;

const plugins = [
  'gatsby-transformer-sharp',
  'gatsby-plugin-sharp',
  {
    resolve: 'gatsby-plugin-zopfli',
  },
  {
    resolve: 'gatsby-plugin-svgr',
    options: {
      prettier: false,
      svgoConfig: {
        plugins: [
          { removeViewBox: false },
          { cleanupNumericValues: true },
          { prefixIds: true },
        ],
      },
    },
  },
  `gatsby-plugin-sass`,
  'gatsby-plugin-react-helmet',
  'gatsby-plugin-typescript',
  'gatsby-transformer-remark',
  {
    resolve: 'gatsby-plugin-root-import',
    options: {
      src: path.join(__dirname, 'src'),
      integrations: path.join(__dirname, 'integrations'),
      lib: path.join(__dirname, 'src/components/lib'),
      'app-config': path.resolve(__dirname, 'app-config'),
    },
  },
  {
    resolve: `gatsby-source-content`,
    options: {
      endpoint: appConfig.getByKey('middleware_contentEndpoint'),
      imagesEndpoint: appConfig.getByKey('middleware_imagesEndpoint'),
      key: appConfig.getByKey('middleware_key'),
      locale: appConfig.getByKey('locale'),
    },
  },
  {
    resolve: `gatsby-source-products`,
    options: {
      endpoint: appConfig.getByKey('middleware_productsEndpoint'),
      key: appConfig.getByKey('middleware_productsKey'),
      locale: appConfig.getByKey('locale'),
    },
  },
  {
    resolve: `gatsby-source-rms`,
    options: {
      endpoint: appConfig.getByKey('middleware_contentEndpoint'),
      key: appConfig.getByKey('middleware_key'),
      locale: appConfig.getByKey('locale'),
      imgTitle: appConfig.getByKey('recipe_image_title'),
    },
  },
  {
    resolve: 'gatsby-plugin-lodash',
    options: {
      disabledFeatures: [
        // 'shorthands',
        // 'currying',
        'deburring',
        'memoize',
        'coercions',
        'guards',
        'metadata',
        'flattening',
      ],
    },
  },
  {
    resolve: `gatsby-plugin-netlify`,
    options: {
      mergeSecurityHeaders: false,
      headers: {
        '/*': [
          `X-Frame-Options: DENY`,
          `X-XSS-Protection: 1; mode=block`,
          `X-Content-Type-Options: nosniff`,
          `Referrer-Policy: strict-origin-when-cross-origin`, // need to reqrite only this one to enable Kritique widget but because of plugin implemetation every security header is defined
        ],
      },
    },
  },
  {
    resolve: `gatsby-plugin-sitemap`,
    options: {
      query: sitemapQuery,
      serialize: ({ site, allSitePage }) =>
        allSitePage.edges.map(edge => {
          const pageData = {
            url: site.siteMetadata.siteUrl + edge.node.path,
            changefreq: `daily`,
            priority: 0.7,
            test: 'testvalue',
            testOption: 'fadfgsghsfhh',
          };
          const context = edge.node.context;
          let img;
          switch (context.page.type) {
            case 'RecipeDetail': //need to be updated if a recipe has an array of images instead of 1 image
              img = get(context, 'recipe.localImage.childImageSharp.fluid.src');
              if (img) {
                pageData.img = [
                  {
                    url: img,
                    title: context.recipe.title,
                  },
                ];
              }
              break;
            case 'ProductDetails':
              imgs = get(context, 'product.images');
              if (imgs && imgs.length) {
                pageData.img = imgs.map(img => ({
                  url: get(img, 'childImageSharp.fluid.src'),
                  title: context.product.productName,
                }));
              }
              break;
            default:
          }
          return pageData;
        }),
    },
  },
];

plugins.push({
  resolve: `gatsby-plugin-robots-txt`,
  options: {
    host: siteMetadata.siteUrl,
    sitemap: `${siteMetadata.siteUrl}sitemap.xml`,
    resolveEnv: () => process.env.CONTEXT,
    env: {
      development: {
        policy: [{ userAgent: '*', disallow: ['/'] }],
      },
      production: {
        policy: [{ userAgent: '*', allow: '/' }],
      },
    },
  },
});
module.exports = {
  siteMetadata,
  plugins,
};

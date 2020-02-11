const constants = require('../constants');
const builder = require('xmlbuilder');

module.exports = async (graphql, getNodesByType) => {
  const siteMetadata = await graphql(`
    {
      site {
        siteMetadata {
          siteUrl
          lang
          brandName
        }
      }
    }
  `);

  const {
    siteUrl: domain,
    lang: locale,
    brandName,
  } = siteMetadata.data.site.siteMetadata;

  const buildFullUrl = (domain, url) => `${domain.replace(/\/?$/, '/')}${url}`;

  const imgMock =
    'https://d3pch6cetztgjq.cloudfront.net/static/es/mx/categories/1851385-600.jpg';

  const feedObj = {
    Feed: {
      Brand: brandName,
      incremental: false,
      Categories: {
        Category: [],
      },
      Products: {
        Product: [],
      },
    },
  };

  const category = {
    SourceId: 'root-category',
    Names: {
      Name: [
        {
          locale,
          text: brandName,
        },
      ],
    },
    PageUrls: {
      PageUrl: [
        {
          locale,
          text: domain,
        },
      ],
    },
  };

  feedObj.Feed.Categories.Category.push(category);

  getNodesByType(constants.NODE_TYPES.PRODUCT).map(productNode =>
    feedObj.Feed.Products.Product.push({
      SourceId: {
        Active: true,
        text: productNode.productId,
      },
      Category: {
        PrimarySourceId: 'root-category',
      },
      Identifiers: {
        Identifier: {
          Type: 'EAN',
          text: productNode.productId,
        },
      },
      Descriptions: {
        Description: {
          locale,
          text: {
            '#cdata': productNode.shortProductDescription,
          },
        },
      },
      ImageUrls: {
        ImageUrl: {
          locale,
          text: productNode.images.length
            ? productNode.images[0].childImageSharp.fluid.src
            : imgMock,
        },
      },
      PageUrls: {
        PageUrl: {
          locale,
          text: buildFullUrl(domain, productNode.fields.slug),
        },
      },
      Names: {
        Name: {
          locale,
          text: {
            '#cdata': productNode.productName,
          },
        },
      },
    })
  );

  return builder.create(feedObj, { encoding: 'utf-8' }).end({ pretty: true });
};

const constants = require('../constants');
const builder = require('xmlbuilder');

module.exports = async (graphql, getNodesByType) => {
  const siteMetadata = await graphql(`
    {
      site {
        siteMetadata {
          siteUrl
          lang
          title
        }
      }
    }
  `);

  const {
    siteUrl: domain,
    lang: locale,
    title: brandName,
  } = siteMetadata.data.site.siteMetadata;

  const buildFullUrl = (domain, url) => `${domain}${url}`;

  const imgMock =
    'https://d3pch6cetztgjq.cloudfront.net/static/es/mx/categories/1851385-600.jpg';

  var feedObj = {
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

  let category = {
    SourceId: 'root-category',
    Names: {
      Name: [
        {
          locale,
          text: 'Recepedia Mexico',
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
          text: productNode.shortPageDescription,
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
          text: productNode.productName,
        },
      },
    })
  );

  return builder.create(feedObj, { encoding: 'utf-8' }).end({ pretty: true });
};

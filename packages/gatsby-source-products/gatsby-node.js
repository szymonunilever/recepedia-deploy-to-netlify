const axios = require('axios');
const createNodes = require('./createNodes');
const {
  createPagesNodes
} = createNodes;

const fetchContent = (configOptions) => {
  return axios.get(
    configOptions.endpoint,
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
  if (configOptions.key && configOptions.endpoint) {
    const { createNode } = actions;

    const [
      productsResponse,
    ] = await Promise.all([
      fetchContent(configOptions),
    ]);

    productsResponse.data.map(product => {
      product.productCategory = product.category;
      //temporary add image into images, it should be removed when we will have it on backend.
      product.images = product.images.filter(image => image);
      !product.images.length && product.images.push({
        "base64": "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAASABQDASIAAhEBAxEB/8QAGQABAAIDAAAAAAAAAAAAAAAAAAQGAwUH/8QAKRAAAQMDAwIFBQAAAAAAAAAAAQIDBAAFERIhMSJRBhMUQYEVIzJhcf/EABgBAQADAQAAAAAAAAAAAAAAAAMBBAUG/8QAIxEAAgEDAQkAAAAAAAAAAAAAAQIAAxExIRITFDJBgZHh8P/aAAwDAQACEQMRAD8Amy4si6XG2oShDDEuIJDyVqUvyjrUnCR7hWkqH6znipN48HzSpv6TeWm4yNYWDGTnoSDgEE9+DUOyymn58hXqpD851zWQ479x1OnTpQcAZGBgds4q1NwXAhuVNluQ2I7jb0h53IYS2FBSh7YV04IPJxgGsCujvSXh7bRySPOmL9fU6JQEU7xu32s4+q7Npx6l1RdI31dJ7bilJ1xhz7ncJjflNNSZTryEYBwlSyRnbnelKVUG0MOSLzX3zeyPOHdYAIUeR81U490uE9lpqfOlSW0JJSh55Swn+AmlKWjymRWyszs/j80pSllef//Z",
        "aspectRatio": 1.11,
        "width": 600,
        "height": 540.5405405405405,
        "src": "https://d37k6lxrz24y4c.cloudfront.net/v2/e9dc924f238fa6cc29465942875fe8f0/af00f87b-5351-4341-bfcc-66efcfb3547e-600.jpg",
        "srcWebp": "https://d37k6lxrz24y4c.cloudfront.net/v2/e9dc924f238fa6cc29465942875fe8f0/af00f87b-5351-4341-bfcc-66efcfb3547e-600.webp",
        "srcSet": "https://d37k6lxrz24y4c.cloudfront.net/v2/e9dc924f238fa6cc29465942875fe8f0/af00f87b-5351-4341-bfcc-66efcfb3547e-200.jpg 200w, https://d37k6lxrz24y4c.cloudfront.net/v2/e9dc924f238fa6cc29465942875fe8f0/af00f87b-5351-4341-bfcc-66efcfb3547e-300.jpg 300w, https://d37k6lxrz24y4c.cloudfront.net/v2/e9dc924f238fa6cc29465942875fe8f0/af00f87b-5351-4341-bfcc-66efcfb3547e-500.jpg 500w, https://d37k6lxrz24y4c.cloudfront.net/v2/e9dc924f238fa6cc29465942875fe8f0/af00f87b-5351-4341-bfcc-66efcfb3547e-600.jpg 600w, https://d37k6lxrz24y4c.cloudfront.net/v2/e9dc924f238fa6cc29465942875fe8f0/af00f87b-5351-4341-bfcc-66efcfb3547e-800.jpg 800w, https://d37k6lxrz24y4c.cloudfront.net/v2/e9dc924f238fa6cc29465942875fe8f0/af00f87b-5351-4341-bfcc-66efcfb3547e-900.jpg 900w",
        "srcSetWebp": "https://d37k6lxrz24y4c.cloudfront.net/v2/e9dc924f238fa6cc29465942875fe8f0/af00f87b-5351-4341-bfcc-66efcfb3547e-200.webp 200w, https://d37k6lxrz24y4c.cloudfront.net/v2/e9dc924f238fa6cc29465942875fe8f0/af00f87b-5351-4341-bfcc-66efcfb3547e-300.webp 300w, https://d37k6lxrz24y4c.cloudfront.net/v2/e9dc924f238fa6cc29465942875fe8f0/af00f87b-5351-4341-bfcc-66efcfb3547e-500.webp 500w, https://d37k6lxrz24y4c.cloudfront.net/v2/e9dc924f238fa6cc29465942875fe8f0/af00f87b-5351-4341-bfcc-66efcfb3547e-600.webp 600w, https://d37k6lxrz24y4c.cloudfront.net/v2/e9dc924f238fa6cc29465942875fe8f0/af00f87b-5351-4341-bfcc-66efcfb3547e-800.webp 800w, https://d37k6lxrz24y4c.cloudfront.net/v2/e9dc924f238fa6cc29465942875fe8f0/af00f87b-5351-4341-bfcc-66efcfb3547e-900.webp 900w",
        "sizes": "(max-width: 500px) 90vw, 500px",
        "url": "https://scm-assets.constant.co/scm/unilever/e9dc924f238fa6cc29465942875fe8f0/af00f87b-5351-4341-bfcc-66efcfb3547e.jpg",
        "title": "salada de quinoa com mana"
      });
      product.images = product.images.map(productImage => ({
        childImageSharp: {
          fluid: productImage
        }
      }));

      return product;
    });

    productsResponse.data.forEach(page => {
      createPagesNodes(page, { createNodeId, createContentDigest, createNode });
    });
  }
};

exports.createSchemaCustomization = ({ actions: { createTypes } }) => {
  const typeDefs = `
    type Product implements Node {
      id: ID!
      productId: ID!
      brand: String!
      productCategory: String!
      EANparent: String!
      productName: String!
      productLaunchDate: String
      shortPageDescription: String
      longPageDescription: String
      ingredients: String
      allergy: String
      nutritionFacts: String
      productTags: [String],
      images: [ProductImage]
      fields: Slug
    }
    
    type Slug {
      slug: String!
    }
    
    type ProductImage {
      childImageSharp: ProductImageSharp
    }
    
    type ProductImageSharp {
      fluid: ProductImageFluid
    }
    
    type ProductImageFluid {
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
  `;
  createTypes(typeDefs);
};

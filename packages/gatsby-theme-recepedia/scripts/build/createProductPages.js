const path = require('path');
const ProductFields = `
    id
    productId
    brand
    brandTheme
    productCategory
    productName
    longPageDescription
    ingredients
    allergy
    nutritionFacts
    productTags
    averageRating
    ratingCount
    images {
      childImageSharp {
        fluid {
          aspectRatio
          base64
          height
          sizes
          src
          srcSet
          srcSetWebp
          srcWebp
          width
        }
      }
    }
    fields {
      slug
    }
`;

const component = path.resolve(
  `./src/templates/BrandProductDetailsPage/BrandProductDetailsPage.tsx`
);

module.exports = async ({ graphql, createPage, pageTemplates }) => {
  const result = await graphql(`
    {
      allProduct {
        nodes {
          ${ProductFields}
        }
      }
    }
  `);
  const allProduct = result.data.allProduct.nodes;

  allProduct.forEach(node => {
    createPage({
      path: node.fields.slug,
      component,
      context: {
        title: node.productName,
        page: pageTemplates.find(
          t => t.brand.toLowerCase() === node.brand.toLowerCase()
        ),
        product: node,
        brand: node.brand,
        productCategory: node.productCategory,
      },
    });
  });
};

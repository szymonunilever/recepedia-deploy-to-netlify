import { graphql } from 'gatsby';

export const query = graphql`
  fragment ProductFields on Product {
    brand
    brandTheme
    id
    productId
    productName
    productLaunchDate
    shortPageDescription
    productTags
    productCategory
    fields {
      slug
    }
    images {
      childImageSharp {
        fluid {
          base64
          aspectRatio
          sizes
          src
          srcSet
          srcSetWebp
          srcWebp
        }
      }
    }
  }
`;

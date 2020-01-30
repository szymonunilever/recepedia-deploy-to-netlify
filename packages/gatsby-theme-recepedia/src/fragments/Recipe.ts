import { graphql } from 'gatsby';

export const query = graphql`
  fragment RecipeFields on Recipe {
    description
    fields {
      slug
    }
    id
    averageRating
    brand
    ingredients {
      title
      list {
        description
        measurementUnit
        multiple
        originalProductId
        productId
        quantity
      }
    }
    methods {
      title
      list {
        description
        position
      }
    }
    recipeDetails {
      preperationTime
      serves
      totalTime
      cookTime
    }
    recipeId
    tagGroups {
      label
      name
      tags {
        id
        name
      }
    }
    title
    nutrients {
      description
      displayUnit
      dv
      epercent
      isCore
      name
      position
      rawRiPercent
      rawDvPercent
      rawValue
      ri
      unit
      value
    }
    localImage {
      childImageSharp {
        fluid {
          base64
          aspectRatio
          width
          height
          src
          srcWebp
          srcSet
          srcSetWebp
          sizes
          url
          title
        }
      }
    }
  }
  fragment RecipeCardFields on Recipe {
    fields {
      slug
    }
    averageRating
    brand
    recipeId
    title
    localImage {
      childImageSharp {
        fluid {
          base64
          aspectRatio
          width
          height
          src
          srcWebp
          srcSet
          srcSetWebp
          sizes
          url
          title
        }
      }
    }
  }
`;

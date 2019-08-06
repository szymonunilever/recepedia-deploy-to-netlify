const parseComponents = components =>
  components.items.map(component => ({
    ...component,
    content: JSON.parse(component.content),
  }));

module.exports = async ({ graphql, createPage }) => {
  const result = await graphql(`
    {
      allPage {
        nodes {
          components {
            items {
              name
              content
              assets {
                url
                alt
                localImage {
                  id
                  childImageSharp {
                    fluid {
                      aspectRatio
                      base64
                      sizes
                      src
                      srcSet
                      srcSetWebp
                      srcWebp
                    }
                  }
                }
              }
            }
          }
          type
          relativePath
          seo {
            title
            description
            lang
            meta {
              name
              content
            }
          }
        }
      }
    }
  `);

  const pages = result.data.allPage.nodes.map(node => ({
    ...node,
    components: {
      items: parseComponents(node.components),
    },
  }));

  pages
    .filter(({ type }) =>
      [
        'Home',
        'AllRecipes',
        'Search',
        'ContactUs',
        'ContactForm',
        'UserProfile',
        'NotFound',
        'AboutUs',
        'MealPlanner',
      ].includes(type)
    )
    .forEach(pageNode => {
      console.log(pageNode);
      createPage(pageNode);
    });

  return pages;
};

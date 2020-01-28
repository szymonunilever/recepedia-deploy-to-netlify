const templatesMap = {
  RecipeCategory: './src/templates/RecipeCategoryPage/RecipeCategoryPage.tsx',
  ContentHub: './src/templates/ContentHubPage/ContentHubPage.tsx',
  RecipeDetail: './src/templates/RecipePage/RecipePage.tsx',
  ArticleDetail: './src/templates/ArticlePage/ArticlePage.tsx',
  BrandPromisePage: './src/templates/BrandPromisePage/BrandPromisePage.tsx',
  BrandProductsPage: './src/templates/BrandProductsPage/BrandProductsPage.tsx',
  ProductDetails: './src/templates/BrandProductDetailsPage/BrandProductDetailsPage.tsx',
  default: './src/templates/ContentPage/ContentPage.tsx',
};

module.exports = pageType => {

  const pageTypes = [
    'Home',
    'AllRecipes',
    'Search',
    'ContactUs',
    'ContactForm',
    'ContactUsThankYou',
    'UserProfile',
    'NotFound',
    'AboutUs',
    'MealPlanner',
    'Sitemap',
    'NewsletterSignUp',
    'TermsAndConditions',
    'FAQ',
    'ArticlesHub',
    'Search'
  ];

  if (pageTypes.indexOf(pageType) > -1) {
    return `./src/staticPages/${pageType}/index.tsx`;
  } else if (templatesMap[pageType]) {
    return templatesMap[pageType];
  }

  return templatesMap.default;
};

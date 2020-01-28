import capitalize from 'lodash/capitalize';
import remove from 'lodash/remove';
import groupBy from 'lodash/groupBy';
import values from 'lodash/values';
import uniqBy from 'lodash/uniqBy';
import flatten from 'lodash/flatten';
import { SitemapCategoryEntry } from 'gatsby-awd-components/src/components/Sitemap';

const ROOT_PATH = '/';
// @todo review do we need this section
const EXCLUDED_PATHS = [
  ROOT_PATH,
  '/procurar/',
  '/perfil/',
  '/mapa-do-site/',
  '/inscrever/',
  //these pages placed here because some recipes or tags urls could begin from 404 because id could be 404***
  '/dev-404-page/',
  '/404/',
  '/404.html',
];

export const getSitemapFromPaths = (
  pages: SiteMapRawData[]
): SitemapCategoryEntry[] => {
  remove(
    pages,
    page => page.path.startsWith('/artigos') // TODO: remove this line when articles will be needed.
  );

  remove(pages, (page: SiteMapRawData) => EXCLUDED_PATHS.includes(page.path));

  const pagesData: SiteMapCategoryRaw[][] = values(
    groupBy(
      pages.map(page => {
        return {
          path: page.path,
          title: page.context.title,
          type: page.context.page.type,
        };
      }),
      'type'
    )
  );

  const pageCategories: SiteMapCategoryRaw[] = uniqBy(
    pagesData
      .map((data, key) => ({
        path: `${ROOT_PATH}${data[0].path.split(ROOT_PATH)[1]}${ROOT_PATH}`,
        key,
        title:
          data[0].type !== 'ContentHub'
            ? data[0].path.split(ROOT_PATH)[1]
            : 'tags',
      }))
      .sort((a, b) => (a.key >= b.key ? -1 : 1)),
    'path'
  );

  const pageCategoriesWithHome: SiteMapCategoryRaw[] = flatten(
    pagesData.filter(data => data.length === 1) //TODO: maybe need change rule after new changes from CR will apply.
  );

  return pageCategories
    .map(pageCategoryData => {
      let mapped: SiteMapCategoryRaw = pageCategoryData;
      pageCategoriesWithHome.forEach(activePageCategory => {
        activePageCategory.path === pageCategoryData.path &&
          (mapped = { ...pageCategoryData, ...activePageCategory });
      });
      return mapped.type
        ? mapped
        : {
            ...mapped,
            path: null,
            title: capitalize(
              mapped.title.replace(/[\d -]+/g, ' ').replace(/^ +/gm, '')
            ),
          };
    })
    .map(data => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { key, type, ...other } = data;
      return {
        ...other,
        categoryItems:
          key && pagesData[key][0].path !== other.path
            ? pagesData[key].map(data => data as SitemapCategoryEntry)
            : [],
      };
    });
};

export interface SiteMapRawData {
  path: string;
  context: {
    page: {
      type: string;
    };
    title: string;
  };
}

export interface SiteMapCategoryRaw {
  path: string;
  title: string;
  type?: string;
  key?: number;
}

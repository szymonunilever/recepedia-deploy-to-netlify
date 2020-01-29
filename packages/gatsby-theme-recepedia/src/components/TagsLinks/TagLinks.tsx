import React, { useEffect, useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { getTagSlug } from 'src/utils';
import { Tags, TagVariant } from 'gatsby-awd-components/src/components/Tags';

const addSlugToTags = (path: string, tags: Internal.Tag[]) =>
  tags.map(tag => ({
    ...tag,
    fields: { ...tag.fields, slug: getTagSlug(path, tag) },
  }));

const TagLinks: React.SFC<TagLinksProps> = ({
  list,
  initialCount = 8,
  tagsPerLoad = 4,
  variant = TagVariant.link,
  content = {},
}) => {
  const data: TagsData = useStaticQuery(graphql`
    {
      allPage(filter: { type: { eq: "ContentHub" } }) {
        nodes {
          relativePath
        }
      }
    }
  `);

  const [tagList, setTagList] = useState(
    addSlugToTags(data.allPage.nodes[0].relativePath, list)
  );

  useEffect(() => {
    setTagList(addSlugToTags(data.allPage.nodes[0].relativePath, list));
  }, [list]);

  return (
    <Tags
      list={tagList}
      content={content}
      initialCount={initialCount}
      tagsPerLoad={tagsPerLoad}
      variant={variant}
    />
  );
};

interface TagsData {
  allPage: {
    nodes: {
      relativePath: string;
    }[];
  };
}

export interface TagLinksProps {
  list: Internal.Tag[];
  variant?: TagVariant;
  tagsPerLoad?: number;
  initialCount?: number | 'all';
  content: AppContent.TagsContent;
}

export default TagLinks;

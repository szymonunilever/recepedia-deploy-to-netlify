import React from 'react';
import { storiesOf } from '@storybook/react';
import { Tags } from '../index';
import tagsData from '../mocks/tags.json';
import { action } from '@storybook/addon-actions';
import { TagViewType, TagVariant } from '../components/Tags';
import { ReactComponent as RemoveIcon } from 'src/svgs/inline/x-mark.svg';
const content: AppContent.TagsContent = {
  title: 'Custom title text',
  loadMoreButton: {
    label: 'Custom button text',
  },
};
export const config = {
  content,
  isEditable: true,
  tagsPerLoad: 1,
  initialCount: 2,
  className: 'custom-class',
};

storiesOf('Recipe related/Tags', module)
  .add('Removable tags', () => {
    return (
      <Tags
        list={tagsData}
        RemoveIcon={RemoveIcon}
        handleTagRemove={action('tag was removed')}
        {...config}
        variant={TagVariant.removable}
      />
    );
  })
  .add('Links tags', () => {
    const newConfig = {
      ...config,
    };
    return <Tags list={tagsData} {...newConfig} variant={TagVariant.link} />;
  })
  .add('Toggle tags', () => {
    const newConfig = {
      ...config,
      viewType: TagViewType.filter,
      variant: 'toggle',
    };
    return (
      <Tags
        list={tagsData}
        {...newConfig}
        variant={TagVariant.toggle}
        handleTagToggle={action('tag click')}
      />
    );
  });

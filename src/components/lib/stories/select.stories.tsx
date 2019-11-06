import { storiesOf } from '@storybook/react';
import React from 'react';
import { Select } from '../index';
import selectOptions from './mocks/select.json';
import { action } from '@storybook/addon-actions';

const options = selectOptions.options;

storiesOf('Components/Form elements/Select', module).add(
  'select with custom options list styles',
  () => (
    <Select
      options={options}
      className="select"
      placeholder="How can we help?"
      changeHandler={action('option selected')}
    />
  ),
  {
    info: { inline: false },
  }
);
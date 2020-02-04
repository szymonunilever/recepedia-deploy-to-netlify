import { storiesOf } from '@storybook/react';
import React from 'react';
import { BrandLogo } from '../components/BrandLogo';

const brandList = ['knorr', 'hellmanns', 'maizena'];

storiesOf('Generic/BrandLogo', module).add('Default view', () => (
  <>
    {brandList.map(brand => (
      <BrandLogo brandTheme={brand} linkTo={'/'} key={brand} />
    ))}
  </>
));

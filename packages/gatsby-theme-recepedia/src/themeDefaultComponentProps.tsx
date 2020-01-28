import React from 'react';
import * as icons from './svgs/attributes';
import { ReactComponent as OpenIcon } from './svgs/inline/arrow-down.svg';
import { ReactComponent as ClosedIcon } from './svgs/inline/arrow-up.svg';
import { ReactComponent as FavoriteIcon } from './svgs/inline/favorite.svg';
import { ReactComponent as FilterIcon } from './svgs/inline/filter.svg';
import { ReactComponent as RemoveRecipeCard } from './svgs/inline/dash.svg';
import {
  ReactComponent as RemoveTagIcon,
  ReactComponent as CloseSvg,
} from './svgs/inline/x-mark.svg';
import { ButtonViewType } from 'gatsby-awd-components/src/components/Button';
import { FilterIcons } from 'gatsby-awd-components/src/components/Filter';
import { Icon } from 'gatsby-awd-components/src/models/globalModels';

export const favoriteButtonDefaults = {
  className: 'recipe-card__favorite',
  Icon: FavoriteIcon,
  isToggle: true,
  viewType: ButtonViewType.icon,
  attributes: { 'aria-label': 'favorite toggle' },
};
export const removeRecipeCardButtonDefaults = {
  className: 'recipe-card__remove action-button',
  Icon: RemoveRecipeCard,
  viewType: ButtonViewType.icon,
  attributes: { 'aria-label': 'remove' },
};

export const RecipeListingIcons: FilterIcons = {
  close: CloseSvg,
  closed: ClosedIcon,
  filter: FilterIcon,
  open: OpenIcon,
  removeTag: RemoveTagIcon,
};

export const dietaryEqual: { [key: string]: string } = {
  '12914': '1',
  '12942': '2',
  '12941': '3',
  '12886': '4',
  '13153': '10',
  '12909': '11',
};

export const dietaryAttributesIcons: {
  [key: string]: { active: Icon; inActive: Icon };
} = {
  '1': {
    active: <icons.DairyFreeActive />,
    inActive: <icons.DairyFreeInactive />,
  },
  '2': {
    active: <icons.EggFreeActive />,
    inActive: <icons.EggFreeInactive />,
  },
  '3': {
    active: <icons.GlutenFreeActive />,
    inActive: <icons.GlutenFreeInactive />,
  },
  '4': {
    active: <icons.LactoseFreeActive />,
    inActive: <icons.LactoseFreeInactive />,
  },
  '5': {
    active: <icons.NutFreeActive />,
    inActive: <icons.NutFreeInactive />,
  },
  '6': {
    active: <icons.PaleoDietActive />,
    inActive: <icons.PaleoDietInactive />,
  },
  '7': {
    active: <icons.PregnancySafeActive />,
    inActive: <icons.PregnancySafeInactive />,
  },
  '8': {
    active: <icons.RawFoodActive />,
    inActive: <icons.RawFoodInactive />,
  },
  '9': {
    active: <icons.WheatFreeActive />,
    inActive: <icons.WheatFreeInactive />,
  },
  '10': {
    active: <icons.VeganActive />,
    inActive: <icons.VeganInactive />,
  },
  '11': {
    active: <icons.VegeterianActive />,
    inActive: <icons.VegeterianInactive />,
  },
  '12595': {
    active: <icons.SeafoodFreeActive />,
    inActive: <icons.SeafoodFreeActive />,
  },
  '12628': {
    active: <icons.SoyFreeActive />,
    inActive: <icons.SoyFreeActive />,
  },
  '12913': {
    active: <icons.SugarFreeActive />,
    inActive: <icons.SugarFreeActive />,
  },
};

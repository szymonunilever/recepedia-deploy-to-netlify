import find from 'lodash/find';
import get from 'lodash/get';

export const findPageComponentContent = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: any,
  name: string,
  view?: string
) => {
  const component =
    find(
      components.items,
      ({ name: compName, content }) =>
        compName === name &&
        (!get(content, 'view') || get(content, 'view') === view)
    ) || {};
  const content = get(component, 'content', {});

  if (component.assets) {
    content.image = component.assets[0];
  }

  return content;
};

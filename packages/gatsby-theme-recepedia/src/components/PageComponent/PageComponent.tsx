import React from 'react';
import components from '../page';

const PageComponent = ({ name, content }: PageComponentProps) => {
  const component = null;

  //@ts-ignore
  if (components[name]) {
    // @ts-ignore
    const ComponentInstance = components[name];

    //@ts-ignore
    return <ComponentInstance content={content} />;
  }

  return component;
};

export default PageComponent;

interface PageComponentProps {
  name: string;
  content: object;
}

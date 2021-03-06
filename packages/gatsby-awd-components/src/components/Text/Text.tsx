import React from 'react';
import { TextProps } from './models';
import { TagName } from './models';

const Text = ({ className, tag, text, id }: TextProps) => {
  switch (tag) {
    case TagName.h1:
      return (
        <h1 id={id} className={className}>
          {text}
        </h1>
      );
    case TagName.h2:
      return (
        <h2 id={id} className={className}>
          {text}
        </h2>
      );
    case TagName.h3:
      return (
        <h3 id={id} className={className}>
          {text}
        </h3>
      );
    case TagName.h4:
      return (
        <h4 id={id} className={className}>
          {text}
        </h4>
      );
    case TagName.h5:
      return (
        <h5 id={id} className={className}>
          {text}
        </h5>
      );
    case TagName.h6:
      return (
        <h6 id={id} className={className}>
          {text}
        </h6>
      );
    case TagName.div:
      return (
        <div id={id} className={className}>
          {text}
        </div>
      );
    case TagName.p:
      return (
        <p id={id} className={className}>
          {text}
        </p>
      );
    default:
      return null;
  }
};

export default Text;

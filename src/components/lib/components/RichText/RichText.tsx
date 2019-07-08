import React from 'react';
import { RichTextProps } from './models';

export const RichText = (props: RichTextProps) => (
  <div
    data-componentname="richText"
    className={props.className}
    dangerouslySetInnerHTML={{ __html: props.content.html }}
  />
);

export default RichText;
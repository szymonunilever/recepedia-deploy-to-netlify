/* global describe, it, expect */
import { shallow } from 'enzyme';
import React from 'react';
import RichText from '../RichText';

const testHtml = `
<h1>Header 1</h1>
<h2>Header 2</h2>
<p>
Paragraph
<a href="http://test.html">Test link</a>
</p>
`;

const className = 'rich-text';

describe('RichText', () => {
  it('should render html from props', () => {
    const testContent = shallow(
      <RichText html={testHtml} className={className} />
    );
    expect(testContent.find('div.rich-text')).toBeTruthy();
    expect(testContent.find('h1')).toBeTruthy();
    expect(testContent.find('h2')).toBeTruthy();
    expect(testContent.find('p')).toBeTruthy();
    expect(testContent.find('a')).toBeTruthy();
  });
});

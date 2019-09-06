import React, { FunctionComponent } from 'react';
import { OptionProps } from './models';
import { ReactComponent as CheckMark } from '../../../../../../../../svgs/inline/checkmark-bigger.svg';
import OptionLabel from '../OptionLabel';
import AdaptiveImage from '../../../../../AdaptiveImage/AdaptiveImage';
import cx from 'classnames';

const Option: FunctionComponent<OptionProps> = ({ question, option }) => {
  const {
    type: { labelPosition },
  } = question;
  const containerClass = cx(
    'quiz__label-content',
    `quiz__label--${labelPosition}`
  );

  return (
    <div className={containerClass}>
      <div className="quiz__label-image-wrap">
        <div className="quiz__label-checkmark">
          <CheckMark />
          {labelPosition === 'inside' && (
            <OptionLabel label={option.label.text} />
          )}
        </div>

        {option.label.image && option.label.image.localImage && (
          // @ts-ignore
          <AdaptiveImage
            className="quiz__label-image"
            {...option.label.image}
            sizes="(min-width: 100px) 400w, 400px"
          />
        )}
      </div>
      {labelPosition === 'bottom' && <OptionLabel label={option.label.text} />}
    </div>
  );
};

export default Option;

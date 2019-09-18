import React from 'react';
import { HeroProps } from './models';
import cx from 'classnames';
import theme from './Hero.modules.scss';
import Text from '../Text/Text';
import { TagName } from '../Text';
import { navigate } from 'gatsby';
import get from 'lodash/get';
import { Button } from '../Button';
import AdaptiveImage from '../AdaptiveImage';
import getComponentDataAttrs from '../../utils/getComponentDataAttrs';

const Hero = (props: HeroProps) => {
  const titleLevel = props.titleLevel || 2;
  const containerStyles = cx('hero', props.className, theme.container);
  const imageStyles = cx('hero__image', theme.image);
  const copyStyles = cx('hero__copy', theme.copy);

  const goByPrimaryCTA = () => {
    const { primaryCta } = props.content;
    primaryCta && primaryCta.linkTo && navigate(primaryCta.linkTo);
  };

  const goBySecondaryCTA = () => {
    const { secondaryCta } = props.content;
    secondaryCta && secondaryCta.linkTo && navigate(secondaryCta.linkTo);
  };
  const image = get(props, 'content.image');

  return (
    <div
      {...getComponentDataAttrs('hero', props.content)}
      className={containerStyles}
    >
      {props.viewType === 'Image' && image.localImage && (
        <div className={imageStyles} onClick={goByPrimaryCTA}>
          <AdaptiveImage localImage={image.localImage} alt={image.alt} />
        </div>
      )}
      <div className={copyStyles}>
        <div className="hero__container">
          {props.content.header && (
            <div className="hero__header">
              <Text
                //@ts-ignore
                tag={TagName[`h${titleLevel}`]}
                text={props.content.header}
              />
            </div>
          )}

          {props.content.shortSubheader && (
            <div className="hero__short-subheader">
              <Text
                // @ts-ignore
                tag={TagName[`h${titleLevel + 1}`]}
                text={props.content.shortSubheader}
              />
            </div>
          )}

          {props.content.longSubheader && (
            <div className="hero__long-subheader">
              <Text tag={TagName.p} text={props.content.longSubheader} />
            </div>
          )}

          {props.content.primaryCta && (
            <div className="hero__cta-primary">
              <Button onClick={goByPrimaryCTA}>
                {props.content.primaryCta.label}
              </Button>
            </div>
          )}

          {props.content.secondaryCta && (
            <div className="hero__cta-secondary">
              <Button onClick={goBySecondaryCTA}>
                {props.content.secondaryCta.label}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;

import React from 'react';
import { HeroProps } from './models';
import cx from 'classnames';
import theme from './Hero.modules.scss';
import Text from '../Text/Text';
import { TagName } from '../Text';
import { navigate } from 'gatsby';
import { get } from 'lodash';
import { Button } from '../common/Button';
import AdaptiveImage from '../AdaptiveImage';

const Hero = (props: HeroProps) => {
  const titleLevel = props.titleLevel || 2;
  const containerStyles = cx('hero', props.className, theme.container);
  const imageStyles = cx('hero__image', theme.image);
  const copyStyles = cx('hero__copy', theme.copy);

  const goByPrimaryCTA = () => {
    const { primaryCTA } = props.content;
    primaryCTA && primaryCTA.linkTo && navigate(primaryCTA.linkTo);
  };

  const goBySecondaryCTA = () => {
    const { secondaryCTA } = props.content;
    secondaryCTA && secondaryCTA.linkTo && navigate(secondaryCTA.linkTo);
  };
  const image = get(props, 'content.image');

  return (
    <div data-componentname="hero" className={containerStyles}>
      {props.viewType === 'Image' && image.localImage && (
        <div className={imageStyles} onClick={goByPrimaryCTA}>
          <AdaptiveImage localImage={image.localImage} alt={image.alt} />
        </div>
      )}

      <div className={copyStyles}>
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

        {props.content.primaryCTA && (
          <div className="hero__cta-primary">
            <Button onClick={goByPrimaryCTA}>
              {props.content.primaryCTA.label}
            </Button>
          </div>
        )}

        {props.content.secondaryCTA && (
          <div className="hero__cta-secondary">
            <Button onClick={goBySecondaryCTA}>
              {props.content.secondaryCTA.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
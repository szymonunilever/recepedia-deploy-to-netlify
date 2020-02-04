import React from 'react';
import { HeroProps } from './models';
import cx from 'classnames';
import theme from './Hero.module.scss';
import Text from '../Text/Text';
import { TagName } from '../Text';
import { navigate, Link } from 'gatsby';
import get from 'lodash/get';
import { Button } from '../Button';
import AdaptiveImage from '../AdaptiveImage';
import getComponentDataAttrs from '../../utils/getComponentDataAttrs';
import BrandLogo from '../BrandLogo';

const Hero = ({
  imageIsLink = true,
  imageSizes,
  content,
  brandTheme,
  titleLevel = 2,
  className,
  brandLink,
  viewType ,
}: HeroProps) => {
  const containerStyles = cx('hero', className, theme.hero);
  const imageStyles = cx('hero__image', theme.image);
  const copyStyles = cx('hero__copy', theme.hero__copy);
  const headerStyles = cx('hero__header', theme.hero__header);
  const brandLogoClass = cx(
    theme.hero__containerBrand,
    brandLink && theme.hero__containerBrandLinked,
    'hero__container-brand'
  );
  const shortSubheaderStyles = cx(
    'hero__short-subheader ',
    theme.hero__shortSubheader
  );
  const longSubheaderStyles = cx(
    'hero__long-subheader ',
    theme.hero__longSubheader
  );
  const ctaLinkStyles = cx('hero__cta-link ', theme.hero__ctaLink);
  const { primaryCta, secondaryCta } = content;
  const primaryCtaLink = primaryCta && primaryCta.linkTo;
  const secondaryCtaLink = secondaryCta && secondaryCta.linkTo;
  const goByPrimaryCTA = () => primaryCtaLink && navigate(primaryCtaLink);
  const goBySecondaryCTA = () => secondaryCtaLink && navigate(secondaryCtaLink);
  const image = get(content, 'image');

  return (
    <div
      {...getComponentDataAttrs('hero', content)}
      className={containerStyles}
    >
      {viewType === 'Image' && image && image.localImage && (
        <div
          className={imageStyles}
          onClick={imageIsLink ? goByPrimaryCTA : () => {}}
        >
          <AdaptiveImage
            localImage={image.localImage}
            sizes={imageSizes}
            alt={image.alt}
          />
          <BrandLogo brandTheme={brandTheme} linkTo={brandLink} className={brandLogoClass} />
        </div>
      )}
      <div className={copyStyles}>
        <div className={cx(theme.hero__container, 'hero__container')}>
          {content.header && (
            <div className={headerStyles}>
              <Text
                //@ts-ignore
                tag={TagName[`h${titleLevel}`]}
                text={content.header}
              />
            </div>
          )}

          {content.shortSubheader && (
            <div className={shortSubheaderStyles}>
              <Text
                // @ts-ignore
                tag={TagName[`h${titleLevel + 1}`]}
                text={content.shortSubheader}
              />
            </div>
          )}

          {content.longSubheader && (
            <div className={longSubheaderStyles}>
              <Text tag={TagName.p} text={content.longSubheader} />
            </div>
          )}

          {primaryCta && (
            <div className={cx(theme.hero__ctaPrimary, 'hero__cta-primary')}>
              {primaryCtaLink ? (
                <Link className={ctaLinkStyles} to={primaryCtaLink}>
                  {primaryCta.label}
                </Link>
              ) : (
                <Button onClick={goByPrimaryCTA}>{primaryCta.label}</Button>
              )}
            </div>
          )}

          {secondaryCta && (
            <div
              className={cx(theme.hero__ctaSecondary, 'hero__cta-secondary')}
            >
              {secondaryCtaLink ? (
                <Link className={theme.hero__ctaLink} to={secondaryCtaLink}>
                  {secondaryCta.label}
                </Link>
              ) : (
                <Button onClick={goBySecondaryCTA}>{secondaryCta.label}</Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;

import cx from 'classnames';
import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';
import theme from './BrandHero.module.scss';
import { BrandHeroProps } from './models';
import { IMAGE_SIZES } from 'src/constants';
import { iconNormalize } from 'gatsby-awd-components/src';
import { Text, TagName } from 'gatsby-awd-components/src/components/Text';
import { AdaptiveImage } from 'gatsby-awd-components/src/components/AdaptiveImage';

const BrandHero: FunctionComponent<BrandHeroProps> = ({
  className,
  content,
  titleLevel = 1,
  brandLogo,
  prefix,
  imageSizes = IMAGE_SIZES.FULL_WIDTH,
}) => {
  const { title, image, links } = content;
  const headingTitle = prefix ? (
    <>
      <span>{prefix}</span>
      <br /> {title}
    </>
  ) : (
    title
  );
  // @ts-ignore
  return (
    <>
      <div className={cx(theme.brandHero, className, 'brand-hero')}>
        <AdaptiveImage
          {...image}
          sizes={imageSizes}
          className="brand-hero__image"
        />
        <div className="wrapper brand-hero__content">
          {iconNormalize(brandLogo, 'brand-hero__logo')}
          <Text
            // @ts-ignore */
            tag={TagName[`h${titleLevel}`]}
            className="brand-hero__title"
            text={headingTitle}
          />
          <div className="brand-hero__links">
            {links.map((link, index: number) => (
              <Link
                className={`brand-hero__link brand-hero__link-${index}`}
                activeClassName="active"
                partiallyActive={true}
                to={link.path}
                key={`brand-hero__link-${index}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandHero;

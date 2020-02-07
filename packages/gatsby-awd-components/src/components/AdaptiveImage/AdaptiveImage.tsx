import React, {
  ReactNode,
  useState,
  useEffect,
  FunctionComponent,
} from 'react';
import theme from './AdaptiveImage.module.scss';
// @ts-ignore
import Img from 'gatsby-image';
//fix for IE related to gatsby-image downgrade has been made with css. Polifill for IE wass not stable https://www.gatsbyjs.org/packages/gatsby-image/#polyfilling-object-fitobject-position-for-ie with downgraded version. Use following import when gatsby-image is updated.
// import Img from "gatsby-image/withIEPolyfill"
import { AdaptiveImageProps } from './models';
import cx from 'classnames';
import WithLink from './partials/WithLink';
import getComponentDataAttrs from '../../utils/getComponentDataAttrs';

const ImageContainer: FunctionComponent<ImageContainerProps> = ({
  classNames,
  view,
  children,
}) => {
  return (
    <div
      className={classNames}
      {...getComponentDataAttrs('adaptive-image', { view })}
    >
      {children}
    </div>
  );
};

const AdaptiveImage: FunctionComponent<AdaptiveImageProps> = ({
  className,
  alt,
  localImage,
  sizes,
  view,
  critical,
  title = alt,
}) => {
  const isSvg =
    localImage &&
    localImage.ext === '.svg' &&
    localImage.fields &&
    localImage.fields.publicURL;

  const classNames = cx(
    'adaptive-image',
    isSvg ? theme.adaptiveImageSvg : theme.adaptiveImage,
    className,
    {
      'adaptive-image-svg': isSvg,
    }
  );

  if (isSvg) {
    return (
      <ImageContainer classNames={classNames} view={view}>
        <img
          className="adaptive-image__image"
          src={localImage.fields && localImage.fields.publicURL}
          alt={alt}
          title={title}
        />
      </ImageContainer>
    );
  }

  if (!localImage || !localImage.childImageSharp) {
    return <></>;
  }

  const [docLoaded, setDocLoaded] = useState(false);

  let fluid = { ...localImage.childImageSharp.fluid };
  if (sizes) {
    fluid.sizes = sizes;
  }

  const baseFluid = { ...fluid };
  baseFluid.src = '';
  baseFluid.srcSet = '';
  baseFluid.srcWebp = '';
  baseFluid.srcSetWebp = '';

  useEffect(() => {
    if (document.readyState === 'complete') {
      setDocLoaded(true);
    } else {
      window.addEventListener('load', () => {
        setDocLoaded(true);
      });
    }
  }, []);

  return (
    <ImageContainer classNames={classNames} view={view}>
      <Img
        className="adaptive-image__image"
        fluid={docLoaded ? fluid : baseFluid}
        {...{ alt, critical, title }}
      />
    </ImageContainer>
  );
};

interface ImageContainerProps {
  classNames?: string;
  view?: string;
  children: ReactNode | ReactNode[];
}
export default WithLink(AdaptiveImage);

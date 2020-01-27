import React, { useEffect, useState } from 'react';
import { iconNormalize } from '../../../utils';
import { SocialSharingBaseProps } from './models';
import theme from './SocialSharingBase.module.scss';
import cx from 'classnames';
import AdaptiveImage from '../../AdaptiveImage';

export const SocialSharingBase = ({
  buttonClassName,
  buttons,
  handleSocialButtonClick,
  handleSocialDialogClose,
  icons,
  showTextLabels,
  addThisReady = false,
  brand = '',
}: SocialSharingBaseProps) => {
  const serviceCodes: { [key: string]: string } = {
    facebook: process.env['addThis_serviceCodes_facebook'] as string,
    twitter: process.env['addThis_serviceCodes_twitter'] as string,
    bitly: process.env['addThis_serviceCodes_bitly'] as string,
    link: process.env['addThis_serviceCodes_copyLink'] as string,
    email: process.env['addThis_serviceCodes_email'] as string,
    linkedIn: process.env['addThis_serviceCodes_linkedIn'] as string,
    pinterest: process.env['addThis_serviceCodes_pinterest'] as string,
    tumblr: process.env['addThis_serviceCodes_tumblr'] as string,
    line: process.env['addThis_serviceCodes_line'] as string,
    whatsapp: process.env['addThis_serviceCodes_whatsUp'] as string,
  };
  const [state, setState] = useState({ href: '', loaded: false });
  useEffect(() => {
    const initSocial = () => {
      setState({ href: window.location.href, loaded: true });
      // @ts-ignore
      const addThis = window.addthis;

      addThis.share({
        // eslint-disable-next-line @typescript-eslint/camelcase
        container_selector: `.${theme.socialSharing}`,
        // eslint-disable-next-line @typescript-eslint/camelcase
        button_selector: `.${theme.socialSharingButton}`,
        click: handleSocialButtonClick ? handleSocialButtonClick : null,
        close: handleSocialDialogClose ? handleSocialDialogClose : null,
      });
    };
    if (!state.loaded && addThisReady) initSocial();
  });

  const socialButtons = buttons.map((item, key) => {
    const { name, label, linkDescriptionToShare, linkTitleToShare } = item;
    const classWrapperButton = cx(
      theme.socialSharingButton,
      buttonClassName,
      brand
    );
    const props = {
      type: 'button' as 'button',
      className: classWrapperButton,
      'data-url': state.href,
      'data-title': linkTitleToShare,
      'data-description': linkDescriptionToShare,
      title: label,
    };
    const iconProps = {
      className: 'social-sharing-button__icon',
      alt: label,
      disabled: true,
    };

    const Icon =
      // @ts-ignore
      icons && name && icons[name] && !icons[name].childImageSharp
        ? iconNormalize(icons[name], 'social-sharing-button__icon')
        : null;
    return (
      <button key={key} data-service={serviceCodes[name]} {...props}>
        {Icon ? (
          Icon
        ) : icons && typeof icons[name] != 'undefined' ? (
          <AdaptiveImage
            localImage={icons[name] as Internal.LocalImage}
            alt={iconProps.alt}
            className={iconProps.className}
          />
        ) : (
          label
        )}
        {showTextLabels ? (
          <span className="social-sharing-button__label">{label}</span>
        ) : null}
      </button>
    );
  });

  return <div className={theme.socialSharing}>{socialButtons}</div>;
};

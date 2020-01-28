import React, { FunctionComponent, useEffect } from 'react';
import { ModalProps } from './models';
import cx from 'classnames';
import ReactModal from 'react-modal';
import theme from './Modal.module.scss';
import { Button, ButtonViewType } from '../Button';
import { Text, TagName } from '../Text';

const Modal: FunctionComponent<ModalProps> = ({
  isOpen,
  className,
  close,
  closeBtn,
  titleLevel = 2,
  title = '',
  ...props
}) => {
  const wrapClasses = cx(className, 'modal');
  useEffect(() => {
    document.getElementById('___gatsby') &&
      ReactModal.setAppElement('#___gatsby'); // for adding to app wrapper aria-hidden=true when modal is open
  });

  return (
    <ReactModal
      {...props}
      isOpen={isOpen}
      portalClassName={wrapClasses}
      onRequestClose={close}
      overlayClassName={cx(theme.modal__overlay, 'modal__overlay')}
      className={cx(theme.modal__content, 'modal__content')}
      bodyOpenClassName="modal--open"
      aria={{
        modal: 'true',
        labelledby: 'modal__heading',
        describedby: 'modal__description',
      }}
    >
      {title && (
        <div className={cx(theme.modal__header, 'modal__header')}>
          <Text
            //@ts-ignore
            tag={TagName[`h${titleLevel}`]}
            text={title}
            className={cx(theme.modal__title, 'modal__title')}
            id="modal__heading"
          />
        </div>
      )}
      <div id="modal__description">{props.children}</div>
      {closeBtn && (
        <Button
          onClick={close}
          aria-label="Close"
          className={cx(theme.modal__btnClose, 'modal__btn-close')}
          viewType={ButtonViewType.icon}
        >
          {closeBtn}
        </Button>
      )}
    </ReactModal>
  );
};

export default Modal;

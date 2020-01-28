import React, { FunctionComponent, useEffect, useState } from 'react';
import { MealPlannerRenameDialogProps } from './models';
import { ReactComponent as CloseBtn } from '../../svgs/inline/x-mark.svg';
import Modal from 'gatsby-awd-components/src/components/Modal';
import GeneratedForm from 'gatsby-awd-components/src/components/GeneratedForm';

export const MealPlannerRenameDialog: FunctionComponent<MealPlannerRenameDialogProps> = ({
  callback,
  isOpen = false,
  className,
  ...props
}) => {
  const [open, setOpen] = useState(isOpen);
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);
  const onClose = (val?: any) => {
    callback(val ? val.mealPlannerTitle : undefined);
    setOpen(false);
  };
  return (
    <Modal
      isOpen={open}
      close={onClose}
      closeBtn={<CloseBtn />}
      className={className}
    >
      <GeneratedForm
        onSubmit={onClose}
        {...props}
        hasCaptcha={false}
        shouldValidate={false}
        titleLevel={2}
      />
    </Modal>
  );
};

export default MealPlannerRenameDialog;

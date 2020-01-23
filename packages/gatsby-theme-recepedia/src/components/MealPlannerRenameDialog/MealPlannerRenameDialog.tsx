import { GeneratedForm, Modal } from 'gatsby-awd-components/src';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { MealPlannerRenameDialogProps } from './models';
import { ReactComponent as CloseBtn } from '../../svgs/inline/x-mark.svg';

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

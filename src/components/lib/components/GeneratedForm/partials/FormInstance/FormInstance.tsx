import React, { FormEvent } from 'react';
import { Form } from '../../../Form';
import { GeneratedFormProps } from '../../models';
import { TagName, Text } from '../../../Text';
import groupBy from 'lodash/groupBy';
import findIndex from 'lodash/findIndex';
import GeneratedField from '../GeneratedField';
import cx from 'classnames';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const GeneratedFormInstance = ({
  className,
  hasCaptcha,
  recaptchaAction = 'formSubmit',
  content: { title, subtitle, fields, submitButton, resetButton },
  onSubmit,
  shouldValidate = false,
  titleLevel,
}: GeneratedFormProps) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const classWrapper = cx('generated-form', className);
  const Title = title ? (
    <Text
      // @ts-ignore
      tag={TagName[titleLevel ? `h${titleLevel}` : `div`]}
      className="generated-form__title"
      text={title}
    />
  ) : null;
  const Subtitle = subtitle ? (
    // @ts-ignore
    <Text
      tag={TagName[`div`]}
      className="generated-form__subtitle"
      text={subtitle}
    />
  ) : null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formFields: { [key: string]: any[] } = groupBy(
    fields,
    field => field.fieldset
  );
  for (let fieldsetName in formFields) {
    const checkableIndex = findIndex(
      formFields[fieldsetName],
      item => item.type === 'radio' || item.type === 'checkbox'
    );

    if (checkableIndex > -1) {
      const name = formFields[fieldsetName][checkableIndex].name;
      const lengthGroup = formFields[fieldsetName].filter(
        item => item.name === name
      ).length;
      if (lengthGroup > 1) {
        formFields[name] = formFields[fieldsetName].splice(
          checkableIndex,
          lengthGroup,
          {
            type: 'group',
            name,
          }
        );
      }
    }
  }

  const view =
    formFields.undefined &&
    formFields.undefined.map((item, key) => {
      let innerItems: JSX.Element[] | undefined = undefined;
      if (item.type === 'fieldset') {
        innerItems = formFields[item.name].map((item, key) => {
          if (item.type === 'group') {
            innerItems = formFields[item.name].map((item, key) => {
              return (
                <GeneratedField
                  shouldValidate={shouldValidate}
                  content={item}
                  key={key}
                  className="generated-form__item"
                  innerContent={innerItems}
                />
              );
            });
          }
          return (
            <GeneratedField
              shouldValidate={shouldValidate}
              content={item}
              key={key}
              className="generated-form__item"
              innerContent={innerItems}
            />
          );
        });
      }
      if (item.type === 'group') {
        innerItems = formFields[item.name].map((item, key) => {
          return (
            <GeneratedField
              shouldValidate={shouldValidate}
              content={item}
              key={key}
              className="generated-form__item"
              innerContent={innerItems}
            />
          );
        });
      }
      return (
        <GeneratedField
          shouldValidate={shouldValidate}
          content={item}
          key={key}
          className="generated-form__item"
          innerContent={innerItems}
        />
      );
    });

  const preSubmit = async (val: object) => {
    if (hasCaptcha) {
      if (!executeRecaptcha) {
        return;
      }
      const token = await executeRecaptcha(recaptchaAction);
      const formObj = { ...val, reCaptchaToken: token };
      onSubmit(formObj);
    } else {
      onSubmit(val);
    }
  };

  return (
    <Form
      className={classWrapper}
      onSubmit={preSubmit}
      subscription={{
        submitting: true,
      }}
      render={({ handleSubmit, submitting, form }) => {
        const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
          const promise = handleSubmit(e);
          promise &&
            promise.then(() => {
              form.reset();
            });
          return promise;
        };
        return (
          <form
            onSubmit={onSubmitHandler}
            className={classWrapper}
            noValidate={shouldValidate}
          >
            <div className="generated-form__container">
              {Title}
              {Subtitle}
              {view && <div className="generated-form__fields">{view}</div>}
              <div className="buttons">
                <button
                  type="submit"
                  disabled={submitting}
                  className="generated-form__button--primary"
                >
                  {submitButton.label}
                </button>

                {resetButton ? (
                  <button
                    type="reset"
                    disabled={submitting}
                    className="generated-form__button--secondary"
                    onClick={form.reset}
                  >
                    {resetButton.label}
                  </button>
                ) : null}
              </div>
            </div>
          </form>
        );
      }}
    />
  );
};

export default GeneratedFormInstance;

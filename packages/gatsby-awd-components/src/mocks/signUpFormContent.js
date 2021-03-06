export const formContentMock = {
  title: 'Easy & healthy recipes every week',
  fields: [
    {
      name: 'email input',
      type: 'email',
      placeholder: 'Your email address',
      validationRules: [
        {
          type: 'required',
          errorMessage: 'This field is required.',
        },
        {
          type: 'maxLength',
          value: 20,
          errorMessage: 'This field is too long.',
        },
        {
          type: 'minLength',
          value: 4,
          errorMessage: 'This field is too short.',
        },
        {
          type: 'email',
          errorMessage: 'Should be a valid email.',
        },
      ],
    },
  ],
  submitButton: {
    label: 'Sign Up!',
  },
};

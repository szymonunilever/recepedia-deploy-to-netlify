const TransactionalServiceAdapter = ({ url, host }: FormServiceProps) => {
  if (!url) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (
    commonProps: any,
    sections: any,
    reCaptchaToken: string
  ): Promise<any> => {
    const payload: object = {
      ...commonProps,
      ...sections,
      g: {
        recaptcha: {
          type: 'recaptcha',
          response: reCaptchaToken || 'perfskip1234134',
        },
      },
    };

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Connection: 'keep-alive',
        'Content-Length': '1007',
        Host: host,
      },
      body: JSON.stringify(payload),
    }).then(response => response.json());
  };
};

export default TransactionalServiceAdapter({
  url: process.env['formService_url'],
  host: process.env['formService_host'] as string,
});

export interface FormServiceProps {
  url?: string;
  host: string;
}

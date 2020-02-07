export const getBrandFontUrls = (brand: string | undefined) => {
  switch (brand?.toLowerCase()) {
    case 'hellmanns':
      return [
        `https://fast.fonts.net/dv2/14/f2c6415f-9bf2-4714-8c9e-98f1215e4f24.woff2?d44f19a684109620e4841471af90e81876e4447fbd9dcaf33ed27ddb0be7bf67bf1d1b817cb838e94894397783d7429286a18aa0ec34734551a88281fec7dbc78d4712bfe7ee8d91905f9643de38b47a136eee3f6b7131c2&projectId=edfce55d-c08a-4747-abae-708a93049a25`,
      ];
    case 'knorr':
      return [
        `https://fast.fonts.net/dv2/14/2357f2d2-9956-4320-a9f2-b8e9d0919130.woff2?d44f19a684109620e4841471af90e81876e4447fbd9dcaf33ed27ddb0be7bf67bf1d1b817cb838e94894397783d7429286a18aa0ec34734551a88281fec7dbc78d4712bfe7ee8d91905f9643de38b47a136eee3f6b7131c2&projectId=0f8e076f-205b-4ca7-b9b8-129b6defa1a6`,
      ];
    case 'maizena':
      return [
        `https://use.typekit.net/af/557425/000000000000000000013039/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3`,
      ];
    default:
      return [];
  }
};

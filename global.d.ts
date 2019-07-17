declare var __PATH_PREFIX__: string;

/*
 * For remove typescript errors in case importing scss module
 * https://github.com/s-panferov/awesome-typescript-loader/issues/146#issuecomment-248808206
 * */
declare module '*.scss' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}

declare module '*.svg' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}

declare module 'smart-outline' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}

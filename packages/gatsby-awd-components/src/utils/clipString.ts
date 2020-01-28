export default function clipString(str: string, maxLength: number) {
  let newString: string;
  if (str.length <= maxLength) {
    newString = str;
  } else {
    const clippedString = str.slice(0, maxLength - 3);
    newString = clippedString.slice(0, clippedString.lastIndexOf(' ')) + '...';
  }
  return newString;
}

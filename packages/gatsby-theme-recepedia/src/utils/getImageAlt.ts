import capitalize from 'lodash-es/capitalize';

const getImageAlt = (title: string, slug: string) =>
  title.split(' ').length > 1
    ? title
    : slug
        .split('/')
        .reduce((reducer: string[], fieldWord, index, array) => {
          const matchedWord = fieldWord.replace('-', ' ').match(/[A-z]+/g);
          let word = '';

          if (matchedWord !== null) {
            word = capitalize(matchedWord.join(' '));
          }
          if (word.trim().length) {
            reducer.push(index === array.length - 1 ? `- ${word}` : word);
          }
          return reducer;
        }, [])
        .join(' ')
        .trim();

export default getImageAlt;

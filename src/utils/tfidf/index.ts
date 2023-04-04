import { tokenize, tfidf } from './lib/index';
import base from './lib/base';
import { stopwords } from './lib/stopwords';

export function generateTrending(content: string) {
  // pra cada post, salva o id como chave e esse objeto em stringify como valor, então já ganha tempo de processamento e tem apenas a busca no banco

  const textlist = [...base, content];
  // @ts-ignore
  let final = [];

  textlist.forEach((t, index) => {
    var scores = {};
    // const punctuation = [",", '"', ".", ";", ":", "!", "-", "/", "(", ")", "$", "*", ""]
    const formatted =
      t
        .replaceAll('e-mail', 'email')
        .replaceAll(',', '')
        .replaceAll("'", '')
        .replaceAll(".", '')
        .replaceAll(";", '')
        .replaceAll(":", '')
        .replaceAll("!", '')
        .replaceAll("?", '')
        .replaceAll("-", ' ')
        .replaceAll("—", ' ')
        .replaceAll("(", '')
        .replaceAll(")", '')
        .replaceAll("$", '')
        .replaceAll("\n", ' ')
        .split(' ')
        .map(e => e.toLowerCase())
        .filter(e => !stopwords.includes(e))
        .join(' ');

    tokenize(formatted).forEach((word) => {
      if(word !== '')
        scores[word] = tfidf(word, t, textlist);
    });

    scores = Object.keys(scores).map((word) => (
      {
        word: word,
        score: scores[word]
      }
    ));

    // @ts-ignore
    scores.sort((a, b) => a.score < b.score ? 1 : -1);
    
    // @ts-ignore
    // console.log(scores.splice(0, 5).map(e => e.word));
    // console.log(scores.splice(0, 5));
    // console.log(scores);
    // @ts-ignore
    if(index === 3) final = scores.splice(0, 10).map(e => ({ word: e.word, score: e.score.toFixed(3) }))
    // @ts-ignore
  });
  
  return final;
}

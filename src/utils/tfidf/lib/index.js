export function tokenize(text) {
  return text
    .replace(/'/g, '')
    .replace(/[0-9]/g, ' ')
    .replace(/\s\s+/g, ' ')
    .replaceAll('á', 'a')
    .replaceAll('Á', 'a')
    .replaceAll('à', 'a')
    .replaceAll('À', 'a')
    .replaceAll('â', 'a')
    .replaceAll('Â', 'a')
    .replaceAll('ã', 'a')
    .replaceAll('Ã', 'a')
    .replaceAll('é', 'e')
    .replaceAll('É', 'e')
    .replaceAll('è', 'e')
    .replaceAll('È', 'e')
    .replaceAll('ê', 'e')
    .replaceAll('Ê', 'e')
    .replaceAll('í', 'i')
    .replaceAll('Í', 'i')
    .replaceAll('ó', 'o')
    .replaceAll('Ó', 'o')
    .replaceAll('ô', 'o')
    .replaceAll('Ô', 'o')
    .replaceAll('ò', 'o')
    .replaceAll('Ò', 'o')
    .replaceAll('õ', 'o')
    .replaceAll('Õ', 'o')
    .replaceAll('ú', 'u')
    .replaceAll('Ú', 'u')
    .replaceAll('ç', 'c')
    .replaceAll('Ç', 'c')
    .replace(/[^A-Za-zА-Яа-яçÇğĞıİöÖşŞüÜ0-9_]/g, ' ')
    .split(' ').map(function (s) {
      return s.toLowerCase();
    });
}

export function extractDictionary(textArray) {
  var dict = {},
    keys = [],
    words;
  textArray = Array.isArray(textArray) ? textArray : [textArray];
  textArray.forEach(function (text) {
    words = tokenize(text);
    words.forEach(function (word) {
      word = word.toLowerCase();
      if (!dict[word] && word !== '') {
        dict[word] = 1;
        keys.push(word);
      } else {
        dict[word] += 1;
      }
    });
  });

  return {
    words: keys,
    dict: dict
  };
}

export function bow(text, vocabulary) {
  var dict = extractDictionary([text]).dict,
    vector = [];

  vocabulary.words.forEach(function (word) {
    vector.push(dict[word] || 0);
  });
  return vector;
}

function tf(word, text) {
  var input = word.toLowerCase();
  var dict = extractDictionary(text).dict;
  return dict[input] / tokenize(text).length;
}

function wordInDocsCount(word, textlist) {
  var sum = 0;
  textlist.forEach(function (text) {
    sum += tokenize(text).indexOf(word) > -1 ? 1 : 0;
  });
  return sum;
}

function idf(word, textlist) {
  return Math.log(textlist.length / (1 + wordInDocsCount(word, textlist)));
}

export function tfidf(word, text, textlist) {
  return tf(word, text) * idf(word, textlist);
}

module.exports = {
  dict: extractDictionary,
  bow: bow,
  tfidf: tfidf,
  tokenize: tokenize
};

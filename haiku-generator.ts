var fs = require("fs");

/**
 * Methods
 */

// Returns number of syllables in a given line
// (array of phonemes); increment count if contains a number
function countSyllables(phonemes: string[]): number {
  let count: number = 0;
  phonemes.forEach((pho: string) => {
    if (pho.match(/\d/)) {
      count++;
    }
  });
  return count;
}

// Returns object where key is the number of syllables
// and the value is an array of words that contain the
// number of syllables equal to the key.
// const syllableMap = {
//   1: ['fat', 'trap', 'dog'],
//   2: ['bottom', 'data', 'measure']
// }
function createSyllableMap(data: string): Object {
  const lines: string[] = data.split("\n");
  return lines.reduce((syllableMap: Object, line: string) => {
    const [word, ...phonemes] = line.split(" ");
    let count: number = 0;
    if (phonemes && phonemes.length) {
      count = countSyllables(phonemes);
    }
    if (syllableMap[count] === undefined) {
      syllableMap[count] = [word];
    } else {
      syllableMap[count].push(word);
    }
    return syllableMap;
  }, {});
}

// Returns a random word with specific number of syllables
function getWordWithNumSyllables(
  numSyllables: number,
  syllableMap: Object
): string {
  const matchingWords: string[] = syllableMap[numSyllables];
  let randNum: number = Math.floor(Math.random() * matchingWords.length);

  //Restricts alternative pronouciantions from introducing numbers
  while (containsInteger(matchingWords[randNum])) {
    randNum = Math.floor(Math.random() * matchingWords.length);
  }
  return matchingWords[randNum];
}

function generateHaiku(
  haikuStructure: number[][],
  sylllableMap: Object
): string {
  const haiku = haikuStructure.map((lineStructure) => {
    const haikuLine = lineStructure
      .map((wordStructure) => {
        return getWordWithNumSyllables(wordStructure, sylllableMap);
      })
      .join(" ");
    return haikuLine;
  });
  return haiku.join("\n");
}

// returns true if string contains an integer
// else false
function containsInteger(word) {
  return /\d/.test(word);
}

/**
 *   Program loop
 */

// Get text data from CMU dictionary
console.log("Creating Syllable Map...");
const rawData: string = fs.readFileSync("./cmudict-0.7b.txt").toString();

// Format raw data into JS object keyed by number of syllables
const syllableMap: Object = createSyllableMap(rawData);
console.log("...Syllable Map Created!");

// Create haiku
// 2 params:
// - array describing num syllable of each word per line
// - syllable map
const haiku: string = generateHaiku(
  [
    [3, 2],
    [1, 2, 2, 2],
    [1, 4],
  ],
  syllableMap
);

console.log(haiku);

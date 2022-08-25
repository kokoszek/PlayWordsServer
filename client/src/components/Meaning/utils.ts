export function newWord() {
  return {
    word: '',
    origin: 'web-interface'
  }
}

export function newMeaning() {
  return {
    meaning_lang1_desc: '-',
    meaning_lang1_language: 'pl',
    meaning_lang2_desc: '',
    meaning_lang2_language: 'en',
    words_lang1: [newWord()],
    words_lang2: [],
  }
}

export default {}


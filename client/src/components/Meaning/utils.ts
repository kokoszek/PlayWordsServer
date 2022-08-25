export function newWord(lang: string) {
  return {
    word: '',
    lang,
    origin: 'web-interface'
  }
}

export function newMeaning() {
  return {
    meaning_lang1_desc: '_',
    meaning_lang1_language: 'pl',
    meaning_lang2_desc: '',
    meaning_lang2_language: 'en',
    words_lang1: [newWord('pl')],
    words_lang2: [],
  }
}

export default {}


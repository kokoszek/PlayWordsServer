export function newLinkWithEmptyWord() {
  return {
    level: "",
    word: {
      word: "",
      origin: "web-interface",
      isPhrasalVerb: false,
      isIdiom: false
    }
  };
}

export function newMeaning(partOfSpeech: string | undefined, category: string | undefined) {
  return {
    meaning_lang1_desc: "",
    meaning_lang1_language: "pl",
    meaning_lang2_desc: "",
    meaning_lang2_language: "en",
    partOfSpeech,
    category,
    words_lang1: [],
    words_lang2: [newLinkWithEmptyWord()]
  };
}

export default {};

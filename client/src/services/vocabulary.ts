import type { Lemma } from "../utils/lemmatize";

export const VocabularyService = {
  save: (lemmas: Lemma[]) => {
    const currentVocabulary = VocabularyService.getAll();
    const vocabularyMap = new Map(
      currentVocabulary.map((lemma) => [lemma.lemma, lemma]),
    );
    lemmas.forEach((lemma) => {
      vocabularyMap.set(lemma.lemma, lemma);
    });
    const newVocabulary = Array.from(vocabularyMap.values());
    localStorage.setItem("vocabulary", JSON.stringify(newVocabulary));
  },
  getAll: (): Lemma[] => {
    const vocabulary = localStorage.getItem("vocabulary");
    return vocabulary ? JSON.parse(vocabulary) : [];
  },
};

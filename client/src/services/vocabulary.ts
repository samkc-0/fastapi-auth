import type { Lemma } from '../types'

export const VocabularyService = {
  save: (lemmas: Lemma[]) => {
    // for saving from a source text
    const currentVocabulary = VocabularyService.getAll()
    const vocabularyMap = new Map(
      currentVocabulary.map((lemma) => [lemma.lemma, lemma]),
    )
    lemmas.forEach((lemma) => {
      if (vocabularyMap.has(lemma.lemma)) {
        const existing = vocabularyMap.get(lemma.lemma)
        existing.sourceCount++
        return
      }
      lemma.exposureCount = 0
      lemma.sourceCount = 1
      vocabularyMap.set(lemma.lemma, lemma)
    })
    const newVocabulary = Array.from(vocabularyMap.values())
    localStorage.setItem('vocabulary', JSON.stringify(newVocabulary))
  },
  updateProgress: (lemmas: Lemma[]) => {
    const currentVocabulary = VocabularyService.getAll()
    const vocabularyMap = new Map(
      currentVocabulary.map((lemma) => [lemma.lemma, lemma]),
    )
    lemmas.forEach((lemma) => {
      if (vocabularyMap.has(lemma.lemma)) {
        const existing = vocabularyMap.get(lemma.lemma)
        existing.exposureCount++
        return
      }
      lemma.sourceCount = 0
      lemma.exposureCount = 1
      vocabularyMap.set(lemma.lemma, lemma)
    })
    const newVocabulary = Array.from(vocabularyMap.values())
    localStorage.setItem('vocabulary', JSON.stringify(newVocabulary))
  },
  getAll: (): Lemma[] => {
    const vocabulary = localStorage.getItem('vocabulary')
    return vocabulary ? JSON.parse(vocabulary) : []
  },
  getLeastSeen: (n: number): Lemma[] => {
    return VocabularyService.getAll()
      .sort((a, b) => a.exposureCount - b.exposureCount)
      .slice(0, n)
  },
}

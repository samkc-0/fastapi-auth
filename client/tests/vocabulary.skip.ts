import { VocabularyService } from '../src/services/vocabulary'
import type { Lemma } from '../src/utils/lemmatize'
import { mockLocalStorage } from './mockLocalStorage'

describe('VocabularyService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should save lemmas to local storage', () => {
    const lemmas: Lemma[] = [
      { lemma: 'test', pos: 'noun', language: 'english' },
      { lemma: 'run', pos: 'verb', language: 'english' },
    ]

    VocabularyService.save(lemmas)

    const storedVocabulary = localStorage.getItem('vocabulary')
    expect(storedVocabulary).toBe(JSON.stringify(lemmas))
  })

  it('should get all lemmas from local storage', () => {
    const lemmas: Lemma[] = [
      { lemma: 'test', pos: 'noun', language: 'english' },
      { lemma: 'run', pos: 'verb', language: 'english' },
    ]

    localStorage.setItem('vocabulary', JSON.stringify(lemmas))

    const result = VocabularyService.getAll()

    expect(result).toEqual(lemmas)
  })

  it('should return an empty array if no lemmas are in local storage', () => {
    const result = VocabularyService.getAll()

    expect(result).toEqual([])
  })

  it('should not save duplicate lemmas', () => {
    const lemmas: Lemma[] = [
      { lemma: 'test', pos: 'noun', language: 'english' },
      { lemma: 'run', pos: 'verb', language: 'english' },
    ]
    const duplicateLemmas: Lemma[] = [
      { lemma: 'test', pos: 'noun', language: 'english' },
      { lemma: 'walk', pos: 'verb', language: 'english' },
    ]

    VocabularyService.save(lemmas)
    VocabularyService.save(duplicateLemmas)

    const storedVocabulary = localStorage.getItem('vocabulary')
    const expectedVocabulary = [
      { lemma: 'test', pos: 'noun', language: 'english' },
      { lemma: 'run', pos: 'verb', language: 'english' },
      { lemma: 'walk', pos: 'verb', language: 'english' },
    ]
    expect(JSON.parse(storedVocabulary!)).toEqual(expectedVocabulary)
  })
})

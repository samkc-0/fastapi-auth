import { VocabularyService } from '../src/services/vocabulary'
import type { Lemma } from '../src/types'
import { mockLocalStorage } from './mockLocalStorage'

mockLocalStorage()

describe('VocabularyService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should save lemmas with count initialized to 1', () => {
    const input = [
      { lemma: 'test', pos: 'noun', language: 'english' },
      { lemma: 'run', pos: 'verb', language: 'english' },
    ]

    VocabularyService.save(input)

    const stored = JSON.parse(localStorage.getItem('vocabulary')!)
    expect(stored).toEqual([
      { ...input[0], sourceCount: 1 },
      { ...input[1], sourceCount: 1 },
    ])
  })

  it('should increment count for duplicate lemmas', () => {
    const first = [{ lemma: 'test', pos: 'noun', language: 'english' }]
    const second = [{ lemma: 'test', pos: 'noun', language: 'english' }]

    VocabularyService.save(first)
    VocabularyService.save(second)

    const stored = JSON.parse(localStorage.getItem('vocabulary')!)
    expect(stored).toEqual([
      {
        lemma: 'test',
        pos: 'noun',
        language: 'english',
        sourceCount: 2,
        exposureCount: 0,
      },
    ])
  })

  it('should add new lemmas and update existing ones', () => {
    const first = [{ lemma: 'run', pos: 'verb', language: 'english' }]
    const second = [
      { lemma: 'run', pos: 'verb', language: 'english' },
      { lemma: 'walk', pos: 'verb', language: 'english' },
    ]

    VocabularyService.save(first)
    VocabularyService.save(second)

    const stored = JSON.parse(localStorage.getItem('vocabulary')!)
    expect(stored).toEqual([
      {
        lemma: 'run',
        pos: 'verb',
        language: 'english',
        sourceCount: 2,
        exposureCount: 0,
      },
      {
        lemma: 'walk',
        pos: 'verb',
        language: 'english',
        sourceCount: 1,
        exposureCount: 0,
      },
    ])
  })

  it("updates exposureCount when 'updateProgress()' is called instead of 'save()'", () => {
    const first = [{ lemma: 'run', pos: 'verb', language: 'english' }]
    const second = [
      { lemma: 'run', pos: 'verb', language: 'english' },
      { lemma: 'walk', pos: 'verb', language: 'english' },
    ]

    VocabularyService.save(first)
    VocabularyService.updateProgress(second)
    VocabularyService.updateProgress(first)

    const stored = JSON.parse(localStorage.getItem('vocabulary')!)
    expect(stored).toEqual([
      {
        lemma: 'run',
        pos: 'verb',
        language: 'english',
        sourceCount: 1,
        exposureCount: 2,
      },
      {
        lemma: 'walk',
        pos: 'verb',
        language: 'english',
        sourceCount: 0,
        exposureCount: 1,
      },
    ])
  })

  it('should return empty array if nothing is stored', () => {
    const result = VocabularyService.getAll()
    expect(result).toEqual([])
  })
  it('should be able to choose a selection of n least-exposed lemmas', () => {
    const toInsert = [
      { lemma: 'one', language: 'english', pos: 'noun' },
      { lemma: 'two', language: 'english', pos: 'noun' },
      { lemma: 'three', language: 'english', pos: 'noun' },
      { lemma: 'four', language: 'english', pos: 'noun' },
      { lemma: 'five', language: 'english', pos: 'noun' },
      { lemma: 'six', language: 'english', pos: 'noun' },
      { lemma: 'seven', language: 'english', pos: 'noun' },
      { lemma: 'eight', language: 'english', pos: 'noun' },
      { lemma: 'nine', language: 'english', pos: 'noun' },
      { lemma: 'ten', language: 'english', pos: 'noun' },
      { lemma: 'eleven', language: 'english', pos: 'noun' },
    ]
    VocabularyService.save(toInsert)
    toInsert.forEach((item, i) => {
      for (let k = i; k >= 0; k++) {
        VocabularyService.updateProgress([{ ...item }])
      }
    })
    const result = VocabularyService.getLeastSeen(5)
    result.forEach((item) => {
      expect(item.lemma).toBeDefined()
      expect(item.language).toBe('english')
    })
    expect(result[0].lemma).toBe('seven')
    expect(result[4].lemma).toBe('eleven')
    expect(result.length).toBe(5)
  })
})

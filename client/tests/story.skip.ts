import { StoryService } from '../src/services/story'
import { VocabularyService } from '../src/services/vocabulary'
import type { Lemma } from '../src/utils/lemmatize'
import { mockLocalStorage } from './mockLocalStorage'
import { vi, describe, it, beforeEach, expect } from 'vitest'

mockLocalStorage()

describe('StoryService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should generate a story with the specified number of least used and random lemmas', async () => {
    const mockLemmas: Lemma[] = [
      { lemma: 'cat', pos: 'noun', language: 'english', count: 5 },
      { lemma: 'dog', pos: 'noun', language: 'english', count: 2 },
      { lemma: 'run', pos: 'verb', language: 'english', count: 10 },
      { lemma: 'jump', pos: 'verb', language: 'english', count: 1 },
      { lemma: 'sleep', pos: 'verb', language: 'english', count: 7 },
      { lemma: 'eat', pos: 'verb', language: 'english', count: 3 },
      { lemma: 'play', pos: 'verb', language: 'english', count: 8 },
      { lemma: 'read', pos: 'verb', language: 'english', count: 4 },
    ]
    VocabularyService.save(mockLemmas)

    // Mock the fetch call for the Gemini API
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ story: 'This is a generated story.' }),
      }),
    ) as any

    const n = 2 // least used
    const m = 2 // random
    const story = await StoryService.generateStory(n, m)

    expect(story).toBe('This is a generated story.')
    expect(fetch).toHaveBeenCalledTimes(1)
    const fetchArgs = (fetch as any).mock.calls[0][1]
    const body = JSON.parse(fetchArgs.body)
    expect(body.prompt).toContain(
      'Generate a short story of approximately 8 words using the following words:',
    )
    expect(body.prompt).toContain('jump') // least used
    expect(body.prompt).toContain('dog') // least used
    // Check for two other random words from the mockLemmas
    const wordsInPrompt = body.prompt.match(/words: (.*)\./)[1].split(', ')
    expect(wordsInPrompt.length).toBe(n + m)
  })
})

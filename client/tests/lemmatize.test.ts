import { expect, test } from 'vitest'
import { lemmatize, Lemma } from '../src/utils/lemmatize'

test('lemmatizes an Italian paragraph', async () => {
  const paragraph =
    'Nel mezzo del cammin di nostra vita mi ritrovai per una selva oscura, ché la diritta via era smarrita.'
  const lemmas = await lemmatize(paragraph, 'italian')

  expect(lemmas.length).toBeGreaterThan(1)
  expect(lemmas).toBeInstanceOf(Array)
  lemmas.forEach((lemma) => {
    expect(lemma).toHaveProperty('lemma')
    expect(lemma).toHaveProperty('pos')
    expect(lemma).toHaveProperty('language')
    expect(lemma).toHaveProperty('count')
    expect(typeof lemma.count).toBe('number')
    expect(lemma.count).toBeGreaterThan(0)
    expect(lemma.language).toBe('it')
  })
})

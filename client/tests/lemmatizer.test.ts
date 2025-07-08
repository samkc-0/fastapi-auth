import { describe, expect, test } from 'vitest'
import { lemmatize } from '@/services/lemmatizer'

describe('lemmatize()', () => {
  test('returns expected lemmas from italian input', async () => {
    const input = 'Ho sempre trovato i racconti di Calvino affascinanti.'
    const result = await lemmatize(input, 'italian')

    const lemmas = result.map((item) => item.lemma)
    expect(lemmas).toContain('avere')
    expect(result.length).toBeGreaterThan(1)
    expect(result[0].language).toBe('it')
  })

  test('throws error on non-italian input', async () => {
    const input = 'this is definitely not italian'

    await expect(lemmatize(input, 'italian')).rejects.toThrow(
      /must be in italian/i,
    )
  })

  test('throws if backend is unreachable', async () => {
    // temporarily monkeypatch the env var
    const oldUrl = import.meta.env.LEMMATIZER_API_URL
    // @ts-ignore
    import.meta.env.VITE_LEMMATIZER_URL = 'https://localhost:9999'

    await expect(lemmatize('ciao', 'italian')).rejects.toThrow(
      /lemmatizer error/i,
    )

    // restore env
    // @ts-ignore
    import.meta.env.LEMMATIZER_API_URL = oldUrl
  })

  test('throws on input longer than 140 characters', async () => {
    const longText =
      "Questo è un testo italiano molto lungo pensato per superare il limite dei centoquaranta caratteri imposto dall'API del lemmatizzatore di prova."

    expect(longText.length).toBeGreaterThan(140)

    await expect(lemmatize(longText)).rejects.toThrow(/text too long/i)
  })
})

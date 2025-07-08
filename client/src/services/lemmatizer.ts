type Lemma = {
  text: string
  lemma: string
  pos: string
}

type LanguageName = 'italian'

const BASE_URL = import.meta.env.LEMMATIZER_API_URL

export async function lemmatize(
  text: string,
  language: LanguageName,
): Promise<Lemma[]> {
  if (!BASE_URL) throw new Error('lemmatizer base url not set')
  const url = `${BASE_URL}/${language}`
  console.log('fetching from:', url)
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`lemmatizer error: ${res.status} — ${err}`)
  }
  return res.json()
}

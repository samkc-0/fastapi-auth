type Lemma = {
  text: string
  lemma: string
  pos: string
}

type LanguageName = 'italian'

export async function lemmatize(
  text: string,
  language: LanguageName,
): Promise<Lemma[]> {
  if (language == undefined)
    throw new Error(
      'second argument to lemmatizer should be a  language, e.g. "italian"',
    )
  const url = `api/lemmatize/${language}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  let data: unknown

  try {
    data = await res.json()
  } catch (e) {
    const fallback = await res.text()
    throw new Error(`failed to parse response: ${fallback}`)
  }

  if (!res.ok) {
    const detail =
      (data as any)?.detail || (data as any)?.error || 'unknown error'
    throw new Error(`lemmatizer error: ${res.status} — ${detail}`)
  }

  if (!Array.isArray(data)) {
    throw new Error('invalid lemmatizer response: expected array')
  }

  return data as Lemma[]
}

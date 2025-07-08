export interface Lemma {
  lemma: string
  pos: string
  language: string
  count: number
}

export async function lemmatize(
  text: string,
  model: 'italian',
): Promise<Lemma[]> {
  const lemmas = await _lemmatize(text, model)
  return lemmas
}
async function _lemmatize(text: string, model = 'italian'): Promise<Lemma[]> {
  const res = await fetch(
    'https://lindat.mff.cuni.cz/services/udpipe/api/process',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        model: model,
        tokenizer: '',
        tagger: '',
        lemmatizer: '',
        data: text,
      }),
    },
  )
  const out = await res.json()
  if (!out.result) {
    return []
  }
  const lines: string[] = out.result.split('\n')

  const posMapping: { [key: string]: string } = {
    ADP: 'PRE',
    NOUN: 'NOM',
    DET: 'ART',
    VERB: 'VER',
    ADJ: 'ADJ',
    SCONJ: 'CON',
    CCONJ: 'CON',
    PROPN: 'NOM',
    PRON: 'PRO',
    AUX: 'VER',
  }

  const lemmaMap = new Map<string, Lemma>()

  lines
    .filter((l) => /^\d/.test(l))
    .filter((l) => {
      const parts = l.split('\t')
      const universalPos = parts[3]
      return universalPos !== 'PUNCT'
    })
    .forEach((l) => {
      const parts = l.split('\t')
      const universalPos = parts[3]
      const lemmaKey = `${parts[2]}-${posMapping[universalPos] || universalPos}`
      
      if (lemmaMap.has(lemmaKey)) {
        const existingLemma = lemmaMap.get(lemmaKey)!
        existingLemma.count++
      } else {
        lemmaMap.set(lemmaKey, {
          lemma: parts[2],
          pos: posMapping[universalPos] || universalPos,
          language: model === 'italian' ? 'it' : 'unknown',
          count: 1,
        })
      }
    })
  return Array.from(lemmaMap.values())
}

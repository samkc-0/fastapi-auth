const WORDS = [
  'alba',
  'brezza',
  'cascata',
  'destino',
  'miraggio',
  'frammento',
  'galassia',
  'impresa',
  'illusione',
  'giada',
  'caleidoscopio',
  'luminescenza',
  'mistico',
  'nexus',
  'ottico',
  'pendolo',
  'chimera',
  'retablo',
  'sentiero',
  'viaggio',
  'ombra',
  'vertigine',
  'zigzag',
  'aurora',
  'pozzo',
  'canto',
  'dedalo',
  'effimero',
  'fugace',
  'crepa',
  'soffio',
  'icona',
  'giardino',
  'karma',
  'tela',
  'margine',
  'madreperla',
  'oddio',
  'portico',
  'fantasmagorico',
  'rintocco',
  'sinfonia',
  'trama',
  'ululato',
  'vortice',
  'zefiro',
  'epifania',
  'fragranza',
  'gorgo',
  'idillio',
  'labirinto',
  'melodia',
  'nota',
  'occhio',
  'polvere',
  'quadro',
  'raggio',
  'suono',
  'tremore',
  'urlo',
]

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateRandomStory(): string {
  const wordCount = randomInt(100, 140)
  const words: string[] = []
  for (let i = 0; i < wordCount; i++) {
    words.push(WORDS[randomInt(0, WORDS.length - 1)])
  }
  const sentences: string[] = []
  let idx = 0
  while (idx < words.length) {
    const len = randomInt(20, 30)
    const slice = words.slice(idx, idx + len)
    const sentence = slice.join(' ').replace(/^./, (s) => s.toUpperCase()) + '.'
    sentences.push(sentence)
    idx += len
  }
  return sentences.join(' ')
}

// generate 5 stories up front
const STORIES: string[] = Array.from({ length: 5 }, () => generateRandomStory())

/**
 * returns a promise resolving to an array of stories.
 * later this can fetch from backend instead.
 * stories are in italian.
 */
export function getStories(): Promise<string[]> {
  return Promise.resolve(STORIES)
}

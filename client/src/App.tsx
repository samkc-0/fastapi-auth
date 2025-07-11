import { useState, useCallback } from 'react'
import  { lemmatize } from "./services/lemmatizer.ts"
import { VocabularyService } from "./services/vocabulary"
import type { Lemma } from './types/index.ts'

function App() {

  const [lemmas, setLemmas] = useState<Lemma[]>([])
  const onSubmit = (t) => {
      lemmatize(t, "italian").then((result) => {
        VocabularyService.save(result)
        setLemmas(result)
    })
  }

  if (lemmas.length === 0) {
    return <TextSubmit onSubmit={onSubmit} />
  }

  return (
    <>
     <ul>
       {lemmas.map(({ lemma, pos, language }) => {
          return <li key={lemma}>{lemma} / {pos} / {language}</li>
       })}
     </ul>
    </>
  )
}

export default App

type TextSubmitProps = {
  onSubmit: (text: string) => void
}

export function TextSubmit({ onSubmit }: TextSubmitProps) {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <textarea
        className="w-full text-lime-500 bg-black border p-2 rounded-sm resize-y"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="type something..."
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        disabled={!text.trim()}
      >
        submit
      </button>
    </form>
  )
}
function SubmitText(): JSX.Element {
  <form>
    <input type="textarea" />
    <button type="submit">Subtmit</button>
  </form>
}

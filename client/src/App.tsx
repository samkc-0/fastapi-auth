import { useState } from 'react'
import  { lemmatize } from "./utils/lemmatize.ts"
import type { Lemma } from "./utils/lemmatize.ts"
import { VocabularyService } from "./services/vocabulary"

function App() {

  const [lemmas, setLemmas] = useState<Lemma[]>([])


  return (
    <>
      <TextSubmit onSubmit={(t) => {
        lemmatize(t, "italian").then((result) => {
          VocabularyService.save(result)
        })
      }} />
      <div>
      <ul>
        {lemmas.map(lemma => <li key={lemma.lemma}>{lemma.lemma} / {lemma.pos} / {lemma.language}</li>)}
      </ul>
      </div>
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
        className="w-full border p-2 rounded resize-y"
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

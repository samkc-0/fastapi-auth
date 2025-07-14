import { useState, useCallback, useEffect, ReactNode } from 'react'
import  { lemmatize } from "./services/lemmatizer.ts"
import { VocabularyService } from "./services/vocabulary"
import { getStories } from "./services/story"
import type { Lemma } from './types/index.ts'
import { AxisCarousel } from "./components/AxisCarousel.tsx"
import { Card } from "./components/Card.tsx"

export function App() {
  const [stories, setStories] = useState<string[]>([])
  const [theme, setTheme] = useState('dark')

  const toggleTheme = () => { setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    getStories().then(setStories)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'd') {
        
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  if (stories.length === 0)
    return <div className="animate-spin">⏳</div>
  return (
    <AxisCarousel axis="x" className={theme === 'dark' ? 'bg-black' : 'bg-white'}>
      <AxisCarousel axis="y">
        {stories.map((story, i) => <Card key={i} theme={theme}>{story}</Card>)}          
      </AxisCarousel>
      <Dashboard theme={theme}>
        <ThemeToggle theme={theme} onToggle={toggleTheme}/>
      </Dashboard>
    </AxisCarousel>
  )
}

export default App

function Dashboard({ theme, children }: { theme: string, children: ReactNode }) {
  return <div>{children}</div>
}

function ThemeToggle({theme, onToggle}: { theme: "dark" | "light", onToggle: () => void}) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
    >
      {theme == "dark" ? '☀️' : '🌙'}
    </button>
  )
}


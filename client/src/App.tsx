import { useState, useCallback, useEffect, ReactNode } from 'react'
import  { lemmatize } from "./services/lemmatizer.ts"
import { VocabularyService } from "./services/vocabulary"
import { getStories } from "./services/story"
import type { Lemma } from './types/index.ts'
import { AxisCarousel } from "./components/AxisCarousel.tsx"
import { Card } from "./components/Card.tsx"
import { useTheme } from "./contexts/ThemeContext"

export default function App() {
  const [stories, setStories] = useState<string[]>([])
  const { theme } = useTheme()

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
        {stories.map((story, i) => <Card key={i}>{story}</Card>)}          
      </AxisCarousel>
      <Dashboard>
      {"This is the dashboard"}
      </Dashboard>
    </AxisCarousel>
  )
}

function Dashboard({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}


import { useState, createContext , useContext } from "react"

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeContext = createContext<ThemeContextType|undefined>(undefined)

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>("dark")

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
  
export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
    return ctx
}
  

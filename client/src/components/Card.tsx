import { ReactNode, useContext } from "react"
import { useTheme } from "../contexts/ThemeContext"

interface CardProps {
  children: ReactNode
}

export function Card({ children }: CardProps) {
  const { theme } = useTheme()
  return (
    <div className={`mx-auto p-6 font-serif text-base leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-black'} bg-transparent max-w-sm sm:max-w-md lg:max-w-lg`}>
      <p className="text-justify">
        {children}
      </p>
    </div>
  )
}

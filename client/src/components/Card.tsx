import { ReactNode } from "react"

interface CardProps {
  children: ReactNode
}

export function Card({ children }: CardProps) {
  return (
    <div className="text-white font-serif">
      {children}
    </div>
  )
}


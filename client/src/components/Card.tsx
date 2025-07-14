import { ReactNode } from "react"

interface CardProps {
  children: ReactNode
}

export function Card({ children }: CardProps) {
  return (
    <div className="mx-auto p-6 font-serif text-base leading-relaxed text-white bg-transparent max-w-sm sm:max-w-md lg:max-w-lg">
      <p className="text-justify">
        {children}
      </p>
    </div>
  )
}

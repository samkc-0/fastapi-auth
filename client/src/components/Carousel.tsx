// VerticalCarousel.tsx
import { ReactNode, Children } from "react"

interface VerticalCarouselProps {
  children: ReactNode
}

export function VerticalCarousel({ children }: VerticalCarouselProps) {
  return (
    <div
      className="
        h-screen
        overflow-y-auto
        snap-y snap-mandatory
        [-webkit-overflow-scrolling:touch] /* inertia ios */
      "
    >
      {Children.map(children, (child, i) => (
        <div
          key={i}
          className="
            snap-start snap-always
            h-screen
            flex items-center justify-center
          "
        >
          {child}
        </div>
      ))}
    </div>
  )
}


export { VerticalCarousel as Carousel }

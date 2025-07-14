import React, { ReactNode, Children, HTMLAttributes } from 'react'

type Axis = 'x' | 'y'

interface AxisCarouselProps extends HTMLAttributes<HTMLDivElement> {
  axis?: Axis
  children: ReactNode
}

export function AxisCarousel({
  axis = 'x',
  children,
  className,
  ...rest
}: AxisCarouselProps) {
  const isHorizontal = axis === 'x'
  const overflowClass = isHorizontal ? 'overflow-x-auto' : 'overflow-y-auto'
  const snapAxis = isHorizontal ? 'snap-x' : 'snap-y'
  const flexDir = isHorizontal ? 'flex-row' : 'flex-col'

  return (
    <div
      className={`
        h-screen w-screen
        flex ${flexDir}
        ${overflowClass}
        ${snapAxis} snap-mandatory
        [-webkit-overflow-scrolling:touch]
        ${className ?? ''}
      `}
      {...rest}
    >
      {Children.map(children, (child, i) => (
        <div
          key={i}
          className="
            snap-start snap-always
            flex-shrink-0
            h-screen w-screen
            flex items-center justify-center
          "
        >
          {child}
        </div>
      ))}
    </div>
  )
}

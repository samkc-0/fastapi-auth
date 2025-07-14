import { ReactNode } from "react"
import { Caroursel } from "
export function DashboardSwitcher({ stories, dashboard }: { stories: ReactNode; dashboard: ReactNode }) {
  return (
    <div className="w-screen h-screen overflow-x-auto snap-x snap-mandatory flex [-webkit-overflow-scrolling:touch]">
      <div className="snap-start snap-always w-screen h-screen flex-shrink-0">
        <VerticalCarousel>{stories}</VerticalCarousel>
      <div className="snap-start snap-always w-screen h-screen flex-shrink-0 flex items-center justify-center">
        {dashboard}
      </div>
    </div>
  )
}

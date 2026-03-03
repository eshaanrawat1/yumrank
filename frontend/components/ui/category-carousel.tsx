"use client"

import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CategorySection } from "@/components/ui/category-section"
import { type CategoryWithRestaurants, type Restaurant } from "@/lib/api"

interface CategoryCarouselProps {
  categories: CategoryWithRestaurants[]
  onDeleteCategory: (categoryId: number) => void
  onRestaurantsChange: (categoryId: number, restaurants: Restaurant[]) => void
}

export function CategoryCarousel({
  categories,
  onDeleteCategory,
  onRestaurantsChange,
}: CategoryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const safeActiveIndex = Math.min(activeIndex, Math.max(0, categories.length - 1))

  const goLeft = useCallback(() => {
    setActiveIndex((previous) => Math.max(0, previous - 1))
  }, [])

  const goRight = useCallback(() => {
    setActiveIndex((previous) => Math.min(categories.length - 1, previous + 1))
  }, [categories.length])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") goLeft()
      if (event.key === "ArrowRight") goRight()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goLeft, goRight])

  if (categories.length === 0) return null

  const current = categories[safeActiveIndex]
  const hasLeft = safeActiveIndex > 0
  const hasRight = safeActiveIndex < categories.length - 1

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex w-full max-w-md items-center justify-center gap-4">
        <button
          onClick={goLeft}
          disabled={!hasLeft}
          aria-label="Previous category"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-border/60 disabled:hover:bg-card disabled:hover:text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-2 py-1">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to ${category.name}`}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                index === safeActiveIndex
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <button
          onClick={goRight}
          disabled={!hasRight}
          aria-label="Next category"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-border/60 disabled:hover:bg-card disabled:hover:text-foreground"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        {safeActiveIndex + 1} of {categories.length}
      </p>

      <div className="w-full transition-all duration-300">
        {current && (
          <CategorySection
            key={current.id}
            id={current.id}
            name={current.name}
            restaurants={current.restaurants}
            onDeleteCategory={onDeleteCategory}
            onRestaurantsChange={onRestaurantsChange}
          />
        )}
      </div>

      {categories.length > 1 && (
        <div className="flex items-center gap-1.5">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to ${category.name}`}
              className={`rounded-full transition-all duration-300 ${
                index === safeActiveIndex
                  ? "h-2.5 w-2.5 bg-primary"
                  : "h-2 w-2 bg-border hover:bg-primary/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

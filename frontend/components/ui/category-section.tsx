"use client"

import { useCallback, useLayoutEffect, useRef, useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { apiFetch, type Restaurant } from "@/lib/api"
import { RestaurantCard } from "./restaurant-card"

interface CategorySectionProps {
  id: number
  name: string
  restaurants: Restaurant[]
  onDeleteCategory: (categoryId: number) => void
  onRestaurantsChange: (categoryId: number, restaurants: Restaurant[]) => void
}

export function CategorySection({
  id,
  name,
  restaurants: initialRestaurants,
  onDeleteCategory,
  onRestaurantsChange,
}: CategorySectionProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants)
  const [newRestaurant, setNewRestaurant] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const listRef = useRef<HTMLDivElement>(null)
  const positionsRef = useRef<Map<number, DOMRect>>(new Map())

  useEffect(() => {
    setRestaurants(initialRestaurants)
  }, [initialRestaurants])

  const capturePositions = useCallback(() => {
    if (!listRef.current) return

    const map = new Map<number, DOMRect>()
    const children = listRef.current.querySelectorAll("[data-restaurant-id]")
    children.forEach((child) => {
      const restaurantId = child.getAttribute("data-restaurant-id")
      if (!restaurantId) return
      map.set(Number(restaurantId), child.getBoundingClientRect())
    })

    positionsRef.current = map
  }, [])

  const refreshRestaurants = useCallback(async () => {
    const fresh = await apiFetch<Restaurant[]>(`/restaurants/?category_id=${id}`)
    setRestaurants(fresh)
    onRestaurantsChange(id, fresh)
  }, [id, onRestaurantsChange])

  useLayoutEffect(() => {
    if (!listRef.current) return

    const previousPositions = positionsRef.current
    if (previousPositions.size === 0) return

    const children = listRef.current.querySelectorAll("[data-restaurant-id]")
    children.forEach((child) => {
      const element = child as HTMLElement
      const restaurantId = element.getAttribute("data-restaurant-id")
      if (!restaurantId) return

      const previous = previousPositions.get(Number(restaurantId))
      if (!previous) return

      const current = element.getBoundingClientRect()
      const deltaY = previous.top - current.top
      if (Math.abs(deltaY) < 1) return

      element.style.transition = "none"
      element.style.transform = `translateY(${deltaY}px)`
      element.style.zIndex = "10"

      element.getBoundingClientRect()

      element.style.transition = "transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1)"
      element.style.transform = ""

      const handleEnd = () => {
        element.style.zIndex = ""
        element.style.transition = ""
        element.removeEventListener("transitionend", handleEnd)
      }
      element.addEventListener("transitionend", handleEnd)
    })

    positionsRef.current = new Map()
  }, [restaurants])

  async function handleAdd() {
    const trimmed = newRestaurant.trim()
    if (!trimmed) return

    try {
      await apiFetch<Restaurant>("/restaurants/", {
        method: "POST",
        body: JSON.stringify({ name: trimmed, category_id: id }),
      })
      await refreshRestaurants()
      setNewRestaurant("")
      setIsAdding(false)
    } catch (error) {
      console.error("Failed to add restaurant", error)
    }
  }

  async function handleRemove(restaurantId: number) {
    capturePositions()
    try {
      await apiFetch(`/restaurants/${restaurantId}`, { method: "DELETE" })
      await refreshRestaurants()
    } catch (error) {
      console.error("Failed to remove restaurant", error)
    }
  }

  async function handleMove(restaurantId: number, direction: "up" | "down") {
    capturePositions()
    try {
      await apiFetch<Restaurant>(`/restaurants/${restaurantId}/move_${direction}`, {
        method: "POST",
      })
      await refreshRestaurants()
    } catch (error) {
      console.error(`Failed to move restaurant ${direction}`, error)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") handleAdd()
    if (event.key === "Escape") {
      setNewRestaurant("")
      setIsAdding(false)
    }
  }

  return (
    <div className="rounded-3xl border border-border/40 bg-card/60 p-5 shadow-sm backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2
          className="text-lg font-bold text-foreground"
          style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif" }}
        >
          {name}
        </h2>
        <button
          onClick={() => onDeleteCategory(id)}
          aria-label={`Delete ${name} category`}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {restaurants.length === 0 && !isAdding && (
        <p className="mb-3 text-sm italic text-muted-foreground">No restaurants yet. Add your first one!</p>
      )}

      <div ref={listRef} className="mb-3 flex flex-col gap-2">
        {restaurants.map((restaurant, index) => (
          <div key={restaurant.id} data-restaurant-id={restaurant.id}>
            <RestaurantCard
              name={restaurant.name}
              rank={index + 1}
              isFirst={index === 0}
              isLast={index === restaurants.length - 1}
              onMoveUp={() => handleMove(restaurant.id, "up")}
              onMoveDown={() => handleMove(restaurant.id, "down")}
              onRemove={() => handleRemove(restaurant.id)}
            />
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Restaurant name..."
            value={newRestaurant}
            onChange={(event) => setNewRestaurant(event.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={handleAdd}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Add
          </button>
          <button
            onClick={() => {
              setIsAdding(false)
              setNewRestaurant("")
            }}
            className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
        >
          <Plus className="h-4 w-4" />
          Add Restaurant
        </button>
      )}
    </div>
  )
}

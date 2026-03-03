"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Header } from "@/components/ui/header"
import {
  deleteCategory,
  listCategories,
  listRestaurants,
  type Category,
  type CategoryWithRestaurants,
  type Restaurant,
} from "@/lib/api"
import { CategoryCarousel } from "@/components/ui/category-carousel"
import { AddCategoryForm } from "@/components/ui/add-category-form"
import { SearchBar } from "@/components/ui/search-bar"
import { EmptyState } from "@/components/ui/empty-state"

export default function Home() {
  const [categories, setCategories] = useState<CategoryWithRestaurants[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const apiCategories = await listCategories()
      const restaurantsByCategory = await Promise.all(
        apiCategories.map(async (category) => ({
          categoryId: category.id,
          restaurants: await listRestaurants(category.id),
        }))
      )
      const restaurantsMap = new Map(
        restaurantsByCategory.map((entry) => [entry.categoryId, entry.restaurants])
      )

      setCategories(
        apiCategories.map((category) => ({
          ...category,
          restaurants: restaurantsMap.get(category.id) ?? [],
        }))
      )
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load categories")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadCategories()
  }, [loadCategories])

  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return categories

    return categories
      .map((category) => {
        const categoryMatch = category.name.toLowerCase().includes(q)
        const matchingRestaurants = category.restaurants.filter((restaurant) =>
          restaurant.name.toLowerCase().includes(q)
        )

        if (categoryMatch) return category
        if (matchingRestaurants.length > 0) {
          return { ...category, restaurants: matchingRestaurants }
        }
        return null
      })
      .filter((category): category is CategoryWithRestaurants => category !== null)
  }, [categories, search])

  function handleCategoryCreated(category: Category) {
    setCategories((previous) => {
      if (previous.some((existing) => existing.id === category.id)) {
        return previous
      }
      return [...previous, { ...category, restaurants: [] }]
    })
  }

  function handleRestaurantsChanged(categoryId: number, restaurants: Restaurant[]) {
    setCategories((previous) =>
      previous.map((category) =>
        category.id === categoryId ? { ...category, restaurants } : category
      )
    )
  }

  async function handleCategoryDeleted(categoryId: number) {
    try {
      await deleteCategory(categoryId)
      setCategories((previous) => previous.filter((category) => category.id !== categoryId))
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete category")
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 pb-16">
        <Header />

        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center py-12 text-center">
            <p className="text-sm text-muted-foreground">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <EmptyState />
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No results found for &quot;{search}&quot;
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <CategoryCarousel
            categories={filteredCategories}
            onDeleteCategory={handleCategoryDeleted}
            onRestaurantsChange={handleRestaurantsChanged}
          />
        )}

        <div className="mt-8">
          <AddCategoryForm onCategoryCreated={handleCategoryCreated} />
        </div>
      </div>
    </main>
  )
}

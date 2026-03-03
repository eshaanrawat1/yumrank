"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { createCategory, type Category } from "@/lib/api"

interface AddCategoryFormProps {
  onCategoryCreated?: (category: Category) => void
}

export function AddCategoryForm({ onCategoryCreated }: AddCategoryFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    const trimmed = name.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)

    try {
      const createdCategory = await createCategory(trimmed)

      onCategoryCreated?.(createdCategory)
      setName("")
      setIsOpen(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create category")
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") handleSubmit()
    if (event.key === "Escape") {
      setName("")
      setIsOpen(false)
      setError(null)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-border/60 bg-card/30 px-6 py-8 text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
      >
        <Plus className="h-5 w-5" />
        <span className="text-sm font-semibold">Add Category</span>
      </button>
    )
  }

  return (
    <div className="rounded-3xl border-2 border-primary/30 bg-card/60 p-5 shadow-sm backdrop-blur-sm">
      <label htmlFor="category-name" className="mb-2 block text-sm font-semibold text-foreground">
        Category Name
      </label>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            id="category-name"
            type="text"
            placeholder="e.g. Chinese Food, Pizza, Sushi..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>
          <button
            onClick={() => {
              setIsOpen(false)
              setName("")
              setError(null)
            }}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  )
}

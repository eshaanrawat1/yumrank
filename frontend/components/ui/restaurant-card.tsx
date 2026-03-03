"use client"

import { ChevronUp, ChevronDown, X } from "lucide-react"

interface RestaurantCardProps {
  name: string
  rank: number
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
}

export function RestaurantCard({
  name,
  rank,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRemove,
}: RestaurantCardProps) {
  return (
    <div className="group flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md border border-border/60">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
        {rank}
      </span>

      <span className="flex-1 truncate text-sm font-medium text-card-foreground">
        {name}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          aria-label={`Move ${name} up`}
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          aria-label={`Move ${name} down`}
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
        <button
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

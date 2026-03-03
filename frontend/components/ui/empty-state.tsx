import { Utensils } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Utensils className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3
        className="mb-2 text-lg font-bold text-foreground"
        style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif" }}
      >
        No categories yet
      </h3>
      <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
        Start by adding a food category like &quot;Chinese Food&quot; or &quot;Pizza&quot;, then rank your favorite spots!
      </p>
    </div>
  )
}

import { UtensilsCrossed } from "lucide-react"

export function Header() {
  return (
    <header className="text-center py-10">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <UtensilsCrossed className="h-6 w-6" />
        </div>
        <h1
          className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl"
          style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif" }}
        >
          Yumrank
        </h1>
      </div>
      <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
        Organize and rank your favorite restaurants by category. Your personal food guide.
      </p>
    </header>
  )
}

export interface Category {
  id: number
  name: string
}

export interface Restaurant {
  id: number
  name: string
  rank: number
  category_id: number
}

export type CategoryWithRestaurants = Category & {
  restaurants: Restaurant[]
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000").replace(/\/$/, "")

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: init?.cache ?? "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const errorMessage = await readErrorMessage(response)
    throw new Error(errorMessage)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: string }
    return body.detail || `Request failed with ${response.status}`
  } catch {
    return `Request failed with ${response.status}`
  }
}

export function listCategories() {
  return apiFetch<Category[]>("/categories/")
}

export function createCategory(name: string) {
  return apiFetch<Category>("/categories/", {
    method: "POST",
    body: JSON.stringify({ name }),
  })
}

export function deleteCategory(categoryId: number) {
  return apiFetch<Category>(`/categories/${categoryId}`, {
    method: "DELETE",
  })
}

export function listRestaurants(categoryId?: number) {
  const params = categoryId === undefined ? "" : `?category_id=${categoryId}`
  return apiFetch<Restaurant[]>(`/restaurants/${params}`)
}

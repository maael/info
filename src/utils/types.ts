export interface Drink {
  id: string
  name: string
  description: string
  steps: string[]
  ingredients: { name: string; type: string; amount: string }[]
  addedBy: string
  inStock: boolean
}

export interface Stock {
  name: string
  type: string
  inStock: boolean
  alcoholType?: string
}

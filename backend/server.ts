import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

type GroceryRequest = {
  budget: number
  mealsPerWeek: number
}

type GroceryItem = {
  name: string
  price: number
  servings: number
  category: 'protein' | 'carb' | 'fruit' | 'vegetable' | 'dairy' | 'other'
}

const groceryDatabase: GroceryItem[] = [
  { name: 'Rice', price: 4, servings: 10, category: 'carb' },
  { name: 'Pasta', price: 2, servings: 6, category: 'carb' },
  { name: 'Bread', price: 3, servings: 8, category: 'carb' },
  { name: 'Oats', price: 4, servings: 8, category: 'carb' },
  { name: 'Tortillas', price: 3, servings: 8, category: 'carb' },

  { name: 'Eggs', price: 4, servings: 6, category: 'protein' },
  { name: 'Chicken Breast', price: 10, servings: 6, category: 'protein' },
  { name: 'Ground Turkey', price: 8, servings: 5, category: 'protein' },
  { name: 'Beans', price: 2, servings: 5, category: 'protein' },
  { name: 'Greek Yogurt', price: 5, servings: 5, category: 'dairy' },
  { name: 'Peanut Butter', price: 4, servings: 8, category: 'protein' },

  { name: 'Bananas', price: 3, servings: 6, category: 'fruit' },
  { name: 'Apples', price: 5, servings: 6, category: 'fruit' },
  { name: 'Frozen Berries', price: 6, servings: 5, category: 'fruit' },

  { name: 'Frozen Vegetables', price: 4, servings: 6, category: 'vegetable' },
  { name: 'Spinach', price: 3, servings: 4, category: 'vegetable' },
  { name: 'Carrots', price: 3, servings: 5, category: 'vegetable' },
  { name: 'Broccoli', price: 4, servings: 4, category: 'vegetable' },

  { name: 'Milk', price: 4, servings: 6, category: 'dairy' },
  { name: 'Cheese', price: 5, servings: 6, category: 'dairy' },

  { name: 'Olive Oil', price: 7, servings: 12, category: 'other' },
]

app.post('/api/grocery-list', (req, res) => {
  const { budget, mealsPerWeek } = req.body as GroceryRequest

  if (
    typeof budget !== 'number' ||
    typeof mealsPerWeek !== 'number' ||
    budget <= 0 ||
    mealsPerWeek <= 0
  ) {
    return res.status(400).json({
      error: 'Please provide a valid budget and mealsPerWeek.',
    })
  }

  const selectedItems: GroceryItem[] = []
  let totalCost = 0
  let totalServings = 0

  function tryAddItem(item: GroceryItem) {
    if (totalCost + item.price <= budget) {
      selectedItems.push(item)
      totalCost += item.price
      totalServings += item.servings
      return true
    }
    return false
  }

  // Start with a basic balanced set
  const starterItems = [
    'Rice',
    'Eggs',
    'Beans',
    'Frozen Vegetables',
    'Bananas',
    'Oats',
  ]

  for (const name of starterItems) {
    const item = groceryDatabase.find((g) => g.name === name)
    if (item) {
      tryAddItem(item)
    }
  }

  // Keep adding food until we cover the meal target or run out of budget
  const sortedByValue = [...groceryDatabase].sort((a, b) => {
    const aValue = a.servings / a.price
    const bValue = b.servings / b.price
    return bValue - aValue
  })

  while (totalServings < mealsPerWeek) {
    let addedSomething = false

    for (const item of sortedByValue) {
      const alreadySelected = selectedItems.some(
        (selected) => selected.name === item.name
      )

      if (!alreadySelected && tryAddItem(item)) {
        addedSomething = true
      }

      if (totalServings >= mealsPerWeek) {
        break
      }
    }

    if (!addedSomething) {
      break
    }
  }

  const estimatedCostPerMeal = (totalCost / mealsPerWeek).toFixed(2)

  return res.json({
    budget,
    mealsPerWeek,
    totalEstimatedCost: totalCost,
    estimatedCostPerMeal,
    totalEstimatedServings: totalServings,
    groceryList: selectedItems,
    message:
      totalServings >= mealsPerWeek
        ? 'Generated a grocery list that should roughly cover your meals.'
        : 'Generated the best grocery list possible within your budget, but it may not cover all meals.',
  })
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
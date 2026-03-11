import { useState } from 'react'

type GroceryItem = {
  name: string
  price: number
  servings: number
  category: string
}

type GroceryResponse = {
  budget: number
  mealsPerWeek: number
  totalEstimatedCost: number
  estimatedCostPerMeal: string
  totalEstimatedServings: number
  groceryList: GroceryItem[]
  message: string
}

export default function App() {
  const [budget, setBudget] = useState(100)
  const [mealsPerWeek, setMealsPerWeek] = useState(21)
  const [results, setResults] = useState<GroceryResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const costPerMeal =
    mealsPerWeek > 0 ? (budget / mealsPerWeek).toFixed(2) : '0.00'

  async function handleGenerateList() {
    setLoading(true)
    setError('')
    setResults(null)

    try {
      const response = await fetch('http://localhost:3001/api/grocery-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          budget,
          mealsPerWeek,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate grocery list')
      }

      const data: GroceryResponse = await response.json()
      setResults(data)
    } catch (err) {
      setError('Something went wrong while getting your grocery list.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="title">Budget Bite</h1>
        <p className="subtitle">
          Plan your weekly groceries based on your budget and dietary needs
        </p>

        <div className="card">
          <h2 className="cardTitle">Grocery List Generator</h2>

          <div className="inputRow">
            <div className="field">
              <label>Weekly Budget ($)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
              />
            </div>

            <div className="field">
              <label>Meals per Week</label>
              <input
                type="number"
                value={mealsPerWeek}
                onChange={(e) => setMealsPerWeek(Number(e.target.value))}
              />
            </div>
          </div>

          <p className="helpText">Estimated budget per meal: ${costPerMeal}</p>

          <button className="generateButton" onClick={handleGenerateList}>
            Generate Grocery List
          </button>

          {loading && <p className="resultsText">Loading...</p>}
          {error && <p className="resultsText">{error}</p>}

          {results && (
            <div className="resultsCard">
              <h3 className="resultsTitle">Your Grocery List</h3>

              <p className="resultsText">{results.message}</p>
              <p className="resultsText">Budget: ${results.budget}</p>
              <p className="resultsText">
                Total estimated cost: ${results.totalEstimatedCost}
              </p>
              <p className="resultsText">
                Estimated cost per meal: ${results.estimatedCostPerMeal}
              </p>
              <p className="resultsText">
                Total estimated servings: {results.totalEstimatedServings}
              </p>

              <ul className="resultsList">
                {results.groceryList.map((item) => (
                  <li key={item.name}>
                    {item.name} — ${item.price} — about {item.servings} servings
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

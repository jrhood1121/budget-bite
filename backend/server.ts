import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

type GroceryRequest = {
  budget: number
  mealsPerWeek: number
  dietaryPreferences?: {
    vegetarian?: boolean
    vegan?: boolean
    glutenFree?: boolean
    dairyFree?: boolean
  }
  religiousPreferences?: {
    halal?: boolean
    kosher?: boolean
  }
  avoidFoods?: string
  nutritionGoal?: string
  itemsInFridge?: string
}

type MealIdeasRequest = {
  groceryList: string[]
  dietaryPreferences?: {
    vegetarian?: boolean
    vegan?: boolean
    glutenFree?: boolean
    dairyFree?: boolean
  }
  religiousPreferences?: {
    halal?: boolean
    kosher?: boolean
  }
  avoidFoods?: string
}

type GroceryCategory =
  | 'protein'
  | 'carb'
  | 'fruit'
  | 'vegetable'
  | 'dairy'
  | 'other'
  | 'snacks'

type GroceryItem = {
  name: string
  price: number
  servings: number
  category: GroceryCategory
  tags?: string[]
  allergens?: string[]
}

type SelectedGroceryItem = GroceryItem & {
  quantity: number
}

type RecipeCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'

type Recipe = {
  title: string
  category: RecipeCategory
  description: string
  time: string
  servings: string
  ingredients: string[]
  tags?: string[]
  allergens?: string[]
}

const groceryDatabase: GroceryItem[] = [
  {
    name: 'Rice',
    price: 4,
    servings: 10,
    category: 'carb',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Brown Rice',
    price: 5,
    servings: 10,
    category: 'carb',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Pasta',
    price: 2,
    servings: 6,
    category: 'carb',
    tags: ['vegetarian', 'vegan'],
    allergens: ['wheat', 'gluten'],
  },
  {
    name: 'Whole Wheat Pasta',
    price: 3,
    servings: 6,
    category: 'carb',
    tags: ['vegetarian', 'vegan'],
    allergens: ['wheat', 'gluten'],
  },
  {
    name: 'Bread',
    price: 3,
    servings: 8,
    category: 'carb',
    tags: ['vegetarian', 'vegan'],
    allergens: ['wheat', 'gluten'],
  },
  {
    name: 'Whole Grain Bread',
    price: 4,
    servings: 8,
    category: 'carb',
    tags: ['vegetarian', 'vegan'],
    allergens: ['wheat', 'gluten'],
  },
  {
    name: 'Oats',
    price: 4,
    servings: 8,
    category: 'carb',
    tags: ['vegetarian', 'vegan', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Tortillas',
    price: 3,
    servings: 8,
    category: 'carb',
    tags: ['vegetarian', 'vegan'],
    allergens: ['wheat', 'gluten'],
  },
  {
    name: 'Potatoes',
    price: 4,
    servings: 8,
    category: 'carb',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Sweet Potatoes',
    price: 5,
    servings: 6,
    category: 'carb',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Quinoa',
    price: 6,
    servings: 6,
    category: 'carb',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher', 'high-protein'],
    allergens: [],
  },

  {
    name: 'Eggs',
    price: 4,
    servings: 6,
    category: 'protein',
    tags: ['vegetarian', 'gluten-free', 'halal', 'kosher', 'high-protein'],
    allergens: ['egg'],
  },
  {
    name: 'Chicken Breast',
    price: 10,
    servings: 6,
    category: 'protein',
    tags: ['gluten-free', 'halal', 'kosher', 'high-protein'],
    allergens: [],
  },
  {
    name: 'Ground Turkey',
    price: 8,
    servings: 5,
    category: 'protein',
    tags: ['gluten-free', 'halal', 'high-protein'],
    allergens: [],
  },
  {
    name: 'Salmon',
    price: 12,
    servings: 4,
    category: 'protein',
    tags: ['gluten-free', 'dairy-free', 'halal', 'kosher', 'high-protein'],
    allergens: ['fish'],
  },
  {
    name: 'Tuna',
    price: 7,
    servings: 4,
    category: 'protein',
    tags: ['gluten-free', 'dairy-free', 'halal', 'kosher', 'high-protein'],
    allergens: ['fish'],
  },
  {
    name: 'Tofu',
    price: 4,
    servings: 4,
    category: 'protein',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher', 'high-protein'],
    allergens: ['soy'],
  },
  {
    name: 'Tempeh',
    price: 5,
    servings: 4,
    category: 'protein',
    tags: ['vegetarian', 'vegan', 'dairy-free', 'halal', 'kosher', 'high-protein'],
    allergens: ['soy'],
  },
  {
    name: 'Beans',
    price: 2,
    servings: 5,
    category: 'protein',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Black Beans',
    price: 2,
    servings: 5,
    category: 'protein',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Chickpeas',
    price: 2,
    servings: 5,
    category: 'protein',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Lentils',
    price: 3,
    servings: 6,
    category: 'protein',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher', 'high-protein'],
    allergens: [],
  },
  {
    name: 'Greek Yogurt',
    price: 5,
    servings: 5,
    category: 'dairy',
    tags: ['vegetarian', 'gluten-free', 'halal', 'kosher', 'high-protein'],
    allergens: ['milk', 'dairy'],
  },
  {
    name: 'Cottage Cheese',
    price: 5,
    servings: 5,
    category: 'dairy',
    tags: ['vegetarian', 'gluten-free', 'halal', 'kosher', 'high-protein'],
    allergens: ['milk', 'dairy'],
  },
  {
    name: 'Peanut Butter',
    price: 4,
    servings: 8,
    category: 'protein',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher'],
    allergens: ['peanut', 'peanuts', 'nuts'],
  },
  {
    name: 'Almond Butter',
    price: 7,
    servings: 8,
    category: 'protein',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: ['tree nuts', 'nuts', 'almond'],
  },

  {
    name: 'Bananas',
    price: 3,
    servings: 6,
    category: 'fruit',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Apples',
    price: 5,
    servings: 6,
    category: 'fruit',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Oranges',
    price: 5,
    servings: 6,
    category: 'fruit',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Frozen Berries',
    price: 6,
    servings: 5,
    category: 'fruit',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Grapes',
    price: 6,
    servings: 5,
    category: 'fruit',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Strawberries',
    price: 5,
    servings: 4,
    category: 'fruit',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },

  {
    name: 'Frozen Vegetables',
    price: 4,
    servings: 6,
    category: 'vegetable',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Spinach',
    price: 3,
    servings: 4,
    category: 'vegetable',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Carrots',
    price: 3,
    servings: 5,
    category: 'vegetable',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Broccoli',
    price: 4,
    servings: 4,
    category: 'vegetable',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Bell Peppers',
    price: 5,
    servings: 4,
    category: 'vegetable',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Cucumbers',
    price: 3,
    servings: 4,
    category: 'vegetable',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Tomatoes',
    price: 4,
    servings: 5,
    category: 'vegetable',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Onions',
    price: 3,
    servings: 6,
    category: 'vegetable',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Avocados',
    price: 6,
    servings: 4,
    category: 'vegetable',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },

  {
    name: 'Milk',
    price: 4,
    servings: 6,
    category: 'dairy',
    tags: ['vegetarian', 'gluten-free', 'halal', 'kosher'],
    allergens: ['milk', 'dairy'],
  },
  {
    name: 'Cheese',
    price: 5,
    servings: 6,
    category: 'dairy',
    tags: ['vegetarian', 'gluten-free', 'halal', 'kosher'],
    allergens: ['milk', 'dairy'],
  },
  {
    name: 'Yogurt',
    price: 4,
    servings: 5,
    category: 'dairy',
    tags: ['vegetarian', 'gluten-free', 'halal', 'kosher'],
    allergens: ['milk', 'dairy'],
  },
  {
    name: 'Almond Milk',
    price: 4,
    servings: 6,
    category: 'dairy',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: ['tree nuts', 'nuts', 'almond'],
  },
  {
    name: 'Oat Milk',
    price: 4,
    servings: 6,
    category: 'dairy',
    tags: ['vegetarian', 'vegan', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },

  {
    name: 'Olive Oil',
    price: 7,
    servings: 12,
    category: 'other',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Hummus',
    price: 5,
    servings: 5,
    category: 'snacks',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: ['sesame'],
  },
  {
    name: 'Salsa',
    price: 4,
    servings: 6,
    category: 'snacks',
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    name: 'Dark Chocolate',
    price: 4,
    servings: 4,
    category: 'snacks',
    tags: ['vegetarian', 'vegan'],
    allergens: [],
  },
]

const recipes: Recipe[] = [
  {
    title: 'Hummus Veggie Wrap',
    category: 'Lunch',
    description: 'Whole wheat wrap filled with hummus and fresh vegetables',
    time: '10 mins',
    servings: '1 serving',
    ingredients: ['Tortillas', 'Hummus', 'Carrots', 'Spinach', 'Tomatoes'],
    tags: ['vegetarian', 'vegan'],
    allergens: ['wheat', 'gluten', 'sesame'],
  },
  {
    title: 'Tofu Stir-Fry',
    category: 'Dinner',
    description: 'Asian-inspired tofu with vegetables',
    time: '20 mins',
    servings: '2 servings',
    ingredients: ['Tofu', 'Broccoli', 'Carrots', 'Onions'],
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: ['soy'],
  },
  {
    title: 'Greek Yogurt Berry Bowl',
    category: 'Breakfast',
    description: 'Greek yogurt with oats and berries',
    time: '5 mins',
    servings: '1 serving',
    ingredients: ['Greek Yogurt', 'Frozen Berries', 'Oats'],
    tags: ['vegetarian', 'gluten-free', 'halal', 'kosher'],
    allergens: ['milk', 'dairy'],
  },
  {
    title: 'Peanut Butter Banana Toast',
    category: 'Breakfast',
    description: 'Toast topped with peanut butter and bananas',
    time: '5 mins',
    servings: '1 serving',
    ingredients: ['Bread', 'Peanut Butter', 'Bananas'],
    tags: ['vegetarian', 'vegan'],
    allergens: ['peanut', 'peanuts', 'nuts', 'wheat', 'gluten'],
  },
  {
    title: 'Black Bean Rice Bowl',
    category: 'Dinner',
    description: 'Rice bowl with beans and vegetables',
    time: '15 mins',
    servings: '2 servings',
    ingredients: ['Rice', 'Black Beans', 'Tomatoes', 'Onions'],
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    title: 'Apple Peanut Butter Snack',
    category: 'Snack',
    description: 'Apple slices with peanut butter',
    time: '5 mins',
    servings: '1 serving',
    ingredients: ['Apples', 'Peanut Butter'],
    tags: ['vegetarian', 'vegan', 'gluten-free'],
    allergens: ['peanut', 'peanuts', 'nuts'],
  },
  {
    title: 'Rustic Chicken and Potato Skillet',
    category: 'Dinner',
    description: 'A hearty one-pan meal with diced chicken breast, crispy potatoes, and sweet bell peppers.',
    time: '35 mins',
    servings: '3 servings',
    ingredients: ['Chicken Breast', 'Potatoes', 'Bell Peppers', 'Onions', 'Olive Oil'],
    tags: ['gluten-free', 'dairy-free', 'halal', 'kosher', 'high-protein'],
    allergens: [],
  },
  {
    title: 'Tuna & White Bean Salad',
    category: 'Lunch',
    description: 'A protein-packed, no-cook salad tossing flaky tuna with beans, cucumbers, and olive oil.',
    time: '10 mins',
    servings: '2 servings',
    ingredients: ['Tuna', 'Beans', 'Cucumbers', 'Tomatoes', 'Olive Oil'],
    tags: ['gluten-free', 'dairy-free', 'halal', 'kosher', 'high-protein'],
    allergens: ['fish'],
  },
  {
    title: 'Smashed Chickpea & Avocado Sandwich',
    category: 'Lunch',
    description: 'A vegan-friendly sandwich filling made by mashing chickpeas and avocado together with fresh spinach.',
    time: '10 mins',
    servings: '1 serving',
    ingredients: ['Whole Grain Bread', 'Chickpeas', 'Avocados', 'Spinach'],
    tags: ['vegetarian', 'vegan', 'dairy-free', 'halal', 'kosher'],
    allergens: ['wheat', 'gluten'],
  },
  {
    title: 'Chocolate Strawberry Oatmeal',
    category: 'Breakfast',
    description: 'A sweet and comforting breakfast bowl of oats cooked in milk with fresh strawberries and dark chocolate chunks.',
    time: '10 mins',
    servings: '1 serving',
    ingredients: ['Oats', 'Milk', 'Strawberries', 'Dark Chocolate'],
    tags: ['vegetarian', 'halal', 'kosher'],
    allergens: ['milk', 'dairy'],
  },
  {
    title: 'Turkey Bolognese over Pasta',
    category: 'Dinner',
    description: 'Lean ground turkey simmered in a savory garlic and tomato sauce, served over your favorite pasta.',
    time: '30 mins',
    servings: '4 servings',
    ingredients: ['Ground Turkey', 'Pasta', 'Canned Tomatoes', 'Garlic', 'Carrots'],
    tags: ['dairy-free', 'halal', 'high-protein'],
    allergens: ['wheat', 'gluten'],
  },
  {
    title: 'Hummus & Quinoa Power Bowl',
    category: 'Lunch',
    description: 'A filling grain bowl loaded with quinoa, fresh cucumbers, tomatoes, spinach, and a scoop of hummus.',
    time: '15 mins',
    servings: '1 serving',
    ingredients: ['Quinoa', 'Hummus', 'Cucumbers', 'Tomatoes', 'Spinach'],
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: ['sesame'],
  },
  {
    title: 'Pan-Seared Tofu & Zucchini',
    category: 'Dinner',
    description: 'Crispy pan-seared tofu tossed with sliced zucchini in a savory soy-garlic glaze.',
    time: '20 mins',
    servings: '2 servings',
    ingredients: ['Tofu', 'Zucchini', 'Soy Sauce', 'Garlic', 'Olive Oil'],
    tags: ['vegetarian', 'vegan', 'dairy-free', 'halal', 'kosher', 'high-protein'],
    allergens: ['soy', 'wheat', 'gluten'],
  },
  {
    title: 'Peanut Butter Banana Oat Smoothie',
    category: 'Snack',
    description: 'A thick, creamy dairy-free smoothie perfect for post-workout or a midday energy boost.',
    time: '5 mins',
    servings: '1 serving',
    ingredients: ['Bananas', 'Peanut Butter', 'Oat Milk'],
    tags: ['vegetarian', 'vegan', 'dairy-free', 'halal', 'kosher'],
    allergens: ['peanut', 'peanuts', 'nuts'],
  },
  {
    title: 'Cheesy Potato Breakfast Casserole',
    category: 'Breakfast',
    description: 'A warm, oven-baked breakfast casserole featuring diced potatoes, eggs, onions, and melted cheese.',
    time: '45 mins',
    servings: '4 servings',
    ingredients: ['Potatoes', 'Eggs', 'Cheese', 'Onions'],
    tags: ['vegetarian', 'gluten-free', 'halal', 'kosher', 'high-protein'],
    allergens: ['egg', 'milk', 'dairy'],
  },
  {
    title: 'Garlic Salmon & Sweet Potato Mash',
    category: 'Dinner',
    description: 'Flaky garlic-rubbed salmon served alongside creamy mashed sweet potatoes and a side of spinach.',
    time: '25 mins',
    servings: '2 servings',
    ingredients: ['Salmon', 'Sweet Potatoes', 'Spinach', 'Garlic', 'Olive Oil'],
    tags: ['gluten-free', 'dairy-free', 'halal', 'kosher', 'high-protein'],
    allergens: ['fish'],
  },
  {
    title: 'Beef and Broccoli Stir-Fry',
    category: 'Dinner',
    description: 'A classic and quick stir-fry using ground beef, fresh broccoli, and soy sauce over warm rice.',
    time: '20 mins',
    servings: '2 servings',
    ingredients: ['Ground Beef', 'Broccoli', 'Rice', 'Soy Sauce', 'Garlic'],
    tags: ['dairy-free', 'halal', 'high-protein'],
    allergens: ['soy', 'wheat', 'gluten'],
  },
  {
    title: 'Vegan Lentil Shepherd\'s Pie',
    category: 'Dinner',
    description: 'A comforting, plant-based skillet topped with mashed potatoes over a hearty lentil and carrot base.',
    time: '45 mins',
    servings: '4 servings',
    ingredients: ['Lentils', 'Carrots', 'Potatoes', 'Onions', 'Olive Oil'],
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher', 'high-protein'],
    allergens: [],
  },
  {
    title: 'Tomato & Chickpea Skillet',
    category: 'Dinner',
    description: 'A rich and savory tomato base simmered with chickpeas and spinach, perfect with flatbread or rice.',
    time: '20 mins',
    servings: '2 servings',
    ingredients: ['Chickpeas', 'Canned Tomatoes', 'Spinach', 'Onions', 'Garlic'],
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    title: 'Cheesy Garlic Mushroom Pasta',
    category: 'Dinner',
    description: 'A comforting bowl of pasta tossed with sautéed garlic mushrooms and melted cheese.',
    time: '20 mins',
    servings: '2 servings',
    ingredients: ['Pasta', 'Mushrooms', 'Garlic', 'Cheese', 'Olive Oil'],
    tags: ['vegetarian', 'halal', 'kosher'],
    allergens: ['wheat', 'gluten', 'milk', 'dairy'],
  },
  {
    title: 'Breakfast Tofu Scramble',
    category: 'Breakfast',
    description: 'A protein-packed vegan breakfast scramble using tofu, bell peppers, and spinach.',
    time: '15 mins',
    servings: '2 servings',
    ingredients: ['Tofu', 'Spinach', 'Bell Peppers', 'Onions', 'Olive Oil'],
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher', 'high-protein'],
    allergens: ['soy'],
  },
  {
    title: 'Sweet Potato & Black Bean Tacos',
    category: 'Dinner',
    description: 'Roasted sweet potato cubes and warm black beans wrapped in tortillas and topped with avocado.',
    time: '30 mins',
    servings: '3 servings',
    ingredients: ['Sweet Potatoes', 'Black Beans', 'Tortillas', 'Avocados', 'Olive Oil'],
    tags: ['vegetarian', 'vegan', 'dairy-free', 'halal', 'kosher'],
    allergens: ['wheat', 'gluten'],
  },
  {
    title: 'Apple Cinnamon Protein Oats',
    category: 'Breakfast',
    description: 'Warm oatmeal mixed with sliced apples and a generous scoop of peanut butter for lasting energy.',
    time: '10 mins',
    servings: '1 serving',
    ingredients: ['Oats', 'Apples', 'Peanut Butter'],
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: ['peanut', 'peanuts', 'nuts'],
  },
  {
    title: 'Almond Butter & Banana Wrap',
    category: 'Snack',
    description: 'A quick, on-the-go snack featuring a tortilla spread with almond butter and wrapped around a banana.',
    time: '5 mins',
    servings: '1 serving',
    ingredients: ['Tortillas', 'Almond Butter', 'Bananas'],
    tags: ['vegetarian', 'vegan', 'dairy-free', 'halal', 'kosher'],
    allergens: ['wheat', 'gluten', 'tree nuts', 'nuts', 'almond'],
  },
  {
    title: 'Zucchini & Egg Hash',
    category: 'Breakfast',
    description: 'A simple, low-carb morning hash made by pan-frying diced zucchini and onions with scrambled eggs.',
    time: '15 mins',
    servings: '1 serving',
    ingredients: ['Zucchini', 'Eggs', 'Onions', 'Olive Oil'],
    tags: ['vegetarian', 'gluten-free', 'dairy-free', 'halal', 'kosher', 'high-protein'],
    allergens: ['egg'],
  },
  {
    title: 'Cottage Cheese & Tomato Toast',
    category: 'Lunch',
    description: 'A quick, high-protein lunch of toasted bread topped with a thick layer of cottage cheese and fresh tomatoes.',
    time: '5 mins',
    servings: '1 serving',
    ingredients: ['Bread', 'Cottage Cheese', 'Tomatoes'],
    tags: ['vegetarian', 'halal', 'kosher', 'high-protein'],
    allergens: ['wheat', 'gluten', 'milk', 'dairy'],
  },
  {
    title: 'Beef and Zucchini Rice Bowl',
    category: 'Dinner',
    description: 'Savory ground beef and zucchini stir-fry served over warm rice.',
    time: '20 mins',
    servings: '2 servings',
    ingredients: ['Ground Beef', 'Zucchini', 'Rice', 'Soy Sauce', 'Onions'],
    tags: ['dairy-free', 'halal', 'high-protein'],
    allergens: ['soy', 'wheat', 'gluten'], 
  },
  {
    title: 'Mushroom & Spinach Omelet',
    category: 'Breakfast',
    description: 'Fluffy omelet filled with sautéed mushrooms, spinach, and cheese.',
    time: '10 mins',
    servings: '1 serving',
    ingredients: ['Eggs', 'Mushrooms', 'Spinach', 'Cheese'],
    tags: ['vegetarian', 'gluten-free', 'halal', 'kosher', 'high-protein'],
    allergens: ['egg', 'milk', 'dairy'],
  },
  {
    title: 'Hearty Lentil Stew',
    category: 'Dinner',
    description: 'A warm, comforting stew made with lentils, carrots, and a tomato base.',
    time: '35 mins',
    servings: '4 servings',
    ingredients: ['Lentils', 'Canned Tomatoes', 'Carrots', 'Onions', 'Garlic'],
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher', 'high-protein'],
    allergens: [],
  },
  {
    title: 'Garlic Herb Chicken and Potatoes',
    category: 'Dinner',
    description: 'Oven-roasted chicken breast with crispy potatoes and broccoli.',
    time: '40 mins',
    servings: '2 servings',
    ingredients: ['Chicken Breast', 'Potatoes', 'Broccoli', 'Olive Oil', 'Garlic'],
    tags: ['gluten-free', 'dairy-free', 'halal', 'kosher', 'high-protein'],
    allergens: [],
  },
  {
    title: 'Avocado Egg Toast',
    category: 'Breakfast',
    description: 'Crispy whole grain toast topped with mashed avocado and a fried egg.',
    time: '10 mins',
    servings: '1 serving',
    ingredients: ['Whole Grain Bread', 'Avocados', 'Eggs', 'Olive Oil'],
    tags: ['vegetarian', 'dairy-free', 'halal', 'high-protein'],
    allergens: ['wheat', 'gluten', 'egg'],
  },
  {
    title: 'Tuna Salad Cucumber Boats',
    category: 'Lunch',
    description: 'Fresh cucumbers hollowed out and filled with a high-protein, yogurt-based tuna salad.',
    time: '15 mins',
    servings: '2 servings',
    ingredients: ['Tuna', 'Cucumbers', 'Greek Yogurt', 'Onions'],
    tags: ['gluten-free', 'halal', 'kosher', 'high-protein'],
    allergens: ['fish', 'milk', 'dairy'],
  },
  {
    title: 'Turkey & Sweet Potato Hash',
    category: 'Dinner',
    description: 'A hearty skillet hash made with lean ground turkey, diced sweet potatoes, and bell peppers.',
    time: '30 mins',
    servings: '3 servings',
    ingredients: ['Ground Turkey', 'Sweet Potatoes', 'Bell Peppers', 'Onions', 'Olive Oil'],
    tags: ['gluten-free', 'dairy-free', 'halal', 'high-protein'],
    allergens: [],
  },
  {
    title: 'Spicy Black Bean & Salsa Wrap',
    category: 'Lunch',
    description: 'A quick wrap loaded with black beans, fresh avocado, spinach, and salsa.',
    time: '10 mins',
    servings: '1 serving',
    ingredients: ['Tortillas', 'Black Beans', 'Salsa', 'Spinach', 'Avocados'],
    tags: ['vegetarian', 'vegan', 'dairy-free', 'halal', 'kosher'],
    allergens: ['wheat', 'gluten'],
  },
  {
    title: 'Tempeh & Mushroom Stir-Fry',
    category: 'Dinner',
    description: 'Plant-based stir-fry packed with umami flavor, served over hearty brown rice.',
    time: '25 mins',
    servings: '2 servings',
    ingredients: ['Tempeh', 'Mushrooms', 'Broccoli', 'Brown Rice', 'Soy Sauce'],
    tags: ['vegetarian', 'vegan', 'dairy-free', 'halal', 'kosher', 'high-protein'],
    allergens: ['soy', 'wheat', 'gluten'],
  },
  {
    title: 'Baked Salmon with Zucchini',
    category: 'Dinner',
    description: 'Oven-baked salmon paired with garlic-roasted zucchini and cherry tomatoes.',
    time: '25 mins',
    servings: '2 servings',
    ingredients: ['Salmon', 'Zucchini', 'Tomatoes', 'Olive Oil', 'Garlic'],
    tags: ['gluten-free', 'dairy-free', 'halal', 'kosher', 'high-protein'],
    allergens: ['fish'],
  },
  {
    title: 'Yogurt & Dark Chocolate Parfait',
    category: 'Snack',
    description: 'A sweet and satisfying snack layering creamy Greek yogurt with dark chocolate chunks and strawberries.',
    time: '5 mins',
    servings: '1 serving',
    ingredients: ['Greek Yogurt', 'Dark Chocolate', 'Strawberries'],
    tags: ['vegetarian', 'gluten-free', 'halal', 'kosher'],
    allergens: ['milk', 'dairy'],
  },
  {
    title: 'Creamy Tomato & Spinach Quinoa',
    category: 'Dinner',
    description: 'A one-pot quinoa dish simmered in crushed tomatoes with fresh spinach and a touch of cheese.',
    time: '30 mins',
    servings: '3 servings',
    ingredients: ['Quinoa', 'Canned Tomatoes', 'Spinach', 'Cheese', 'Garlic'],
    tags: ['vegetarian', 'gluten-free', 'halal', 'kosher', 'high-protein'],
    allergens: ['milk', 'dairy'],
  },
  {
    title: 'Almond Berry Smoothie',
    category: 'Breakfast',
    description: 'A dairy-free morning smoothie blended with almond milk, frozen berries, and a banana.',
    time: '5 mins',
    servings: '1 serving',
    ingredients: ['Almond Milk', 'Frozen Berries', 'Bananas'],
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: ['tree nuts', 'nuts', 'almond'],
  },
  {
    title: 'Quick Veggie Marinara Pasta',
    category: 'Lunch',
    description: 'Pasta tossed in a homemade garlic tomato sauce with fresh zucchini.',
    time: '20 mins',
    servings: '2 servings',
    ingredients: ['Pasta', 'Canned Tomatoes', 'Zucchini', 'Garlic', 'Olive Oil'],
    tags: ['vegetarian', 'vegan', 'dairy-free', 'halal', 'kosher'],
    allergens: ['wheat', 'gluten'],
  },
  {
    title: 'Mediterranean Chickpea Salad',
    category: 'Lunch',
    description: 'A fresh, light salad with chickpeas, cucumbers, and tomatoes.',
    time: '10 mins',
    servings: '2 servings',
    ingredients: ['Chickpeas', 'Cucumbers', 'Tomatoes', 'Onions', 'Olive Oil'],
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    title: 'Oatmeal Bowl',
    category: 'Breakfast',
    description: 'Warm oats with bananas and berries',
    time: '10 mins',
    servings: '1 serving',
    ingredients: ['Oats', 'Bananas', 'Frozen Berries'],
    tags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: [],
  },
  {
    title: 'Salmon Rice Plate',
    category: 'Dinner',
    description: 'Salmon served with rice and broccoli',
    time: '25 mins',
    servings: '2 servings',
    ingredients: ['Salmon', 'Rice', 'Broccoli'],
    tags: ['gluten-free', 'dairy-free', 'halal', 'kosher'],
    allergens: ['fish'],
  },
  {
    title: 'Veggie Pasta',
    category: 'Lunch',
    description: 'Pasta tossed with vegetables and olive oil',
    time: '20 mins',
    servings: '2 servings',
    ingredients: ['Pasta', 'Spinach', 'Tomatoes', 'Olive Oil'],
    tags: ['vegetarian', 'vegan'],
    allergens: ['wheat', 'gluten'],
  },
]

function normalizeFoodText(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/ies\b/g, 'y')
    .replace(/oes\b/g, 'o')
    .replace(/s\b/g, '')
}

app.post('/api/grocery-list', (req, res) => {
  const {
    budget,
    mealsPerWeek,
    dietaryPreferences,
    religiousPreferences,
    avoidFoods,
    nutritionGoal,
    itemsInFridge,
  } = req.body as GroceryRequest

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

  const avoidList = (avoidFoods || '')
    .split(',')
    .map((food) => normalizeFoodText(food))
    .filter(Boolean)

  const fridgeItems = (itemsInFridge || '')
    .split(',')
    .map((food) => normalizeFoodText(food))
    .filter(Boolean)

  let filteredDatabase = groceryDatabase.filter((item) => {
    const tags = item.tags || []
    const allergens = (item.allergens || []).map(normalizeFoodText)
    const itemName = normalizeFoodText(item.name)

    if (dietaryPreferences?.vegetarian && !tags.includes('vegetarian')) {
      return false
    }

    if (dietaryPreferences?.vegan && !tags.includes('vegan')) {
      return false
    }

    if (dietaryPreferences?.glutenFree && !tags.includes('gluten-free')) {
      return false
    }

    if (dietaryPreferences?.dairyFree && !tags.includes('dairy-free')) {
      return false
    }

    if (religiousPreferences?.halal && !tags.includes('halal')) {
      return false
    }

    if (religiousPreferences?.kosher && !tags.includes('kosher')) {
      return false
    }

    if (
      avoidList.some(
        (food) =>
          allergens.includes(food) ||
          itemName.includes(food) ||
          food.includes(itemName)
      )
    ) {
      return false
    }

    if (
      fridgeItems.some(
        (food) => itemName.includes(food) || food.includes(itemName)
      )
    ) {
      return false
    }

    return true
  })

  if (nutritionGoal.toLowerCase().includes('high protein')) {
    filteredDatabase = filteredDatabase.sort((a, b) => {
      const aProtein = a.tags?.includes('high-protein') ? 1 : 0
      const bProtein = b.tags?.includes('high-protein') ? 1 : 0
      return bProtein - aProtein
    })
  }

  if (filteredDatabase.length === 0) {
    return res.json({
      budget,
      mealsPerWeek,
      totalEstimatedCost: 0,
      estimatedCostPerMeal: '0.00',
      totalEstimatedServings: 0,
      groceryList: [],
      message: 'No groceries matched your current filters.',
    })
  }

  const selectedItems: SelectedGroceryItem[] = []
  let totalCost = 0
  let totalServings = 0

  function addItem(item: GroceryItem) {
    if (totalCost + item.price > budget) {
      return false
    }

    const existingItem = selectedItems.find(
      (selected) => selected.name === item.name
    )

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      selectedItems.push({
        ...item,
        quantity: 1,
      })
    }

    totalCost += item.price
    totalServings += item.servings
    return true
  }

  function getItemQuantity(name: string) {
    return selectedItems.find((item) => item.name === name)?.quantity ?? 0
  }

  const categories: GroceryCategory[] = [
    'protein',
    'carb',
    'fruit',
    'vegetable',
    'dairy',
    'snacks',
  ]

  for (const category of categories) {
    const itemsInCategory = filteredDatabase
      .filter((item) => item.category === category)
      .sort((a, b) => b.servings / b.price - a.servings / a.price)

    if (itemsInCategory.length > 0) {
      addItem(itemsInCategory[0])
    }
  }

  const uniqueItemsByValue = [...filteredDatabase].sort(
    (a, b) => b.servings / b.price - a.servings / a.price
  )

  for (const item of uniqueItemsByValue) {
    if (totalCost >= budget * 0.75) {
      break
    }

    const alreadySelected = selectedItems.some(
      (selected) => selected.name === item.name
    )

    if (!alreadySelected) {
      addItem(item)
    }
  }

  const sortedByValue = [...filteredDatabase].sort(
    (a, b) => b.servings / b.price - a.servings / a.price
  )

  while (totalCost < budget * 0.95) {
    let addedSomething = false

    for (const item of sortedByValue) {
      if (getItemQuantity(item.name) >= 2) {
        continue
      }

      if (addItem(item)) {
        addedSomething = true
      }

      if (totalCost >= budget * 0.95) {
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
      totalCost >= budget * 0.75
        ? 'Generated a grocery list that uses most of your budget while keeping variety.'
        : 'Generated the best grocery list possible within your filters and budget.',
  })
})

app.post('/api/meal-ideas', (req, res) => {
  const {
    groceryList,
    dietaryPreferences,
    religiousPreferences,
    avoidFoods,
  } = req.body as MealIdeasRequest

  if (!Array.isArray(groceryList)) {
    return res.status(400).json({
      error: 'Please provide a groceryList array.',
    })
  }

  const groceryNames = groceryList.map((item) => normalizeFoodText(item))

  const avoidList = (avoidFoods || '')
    .split(',')
    .map((food) => normalizeFoodText(food))
    .filter(Boolean)

  const filteredRecipes = recipes.filter((recipe) => {
    const tags = recipe.tags || []
    const allergens = (recipe.allergens || []).map(normalizeFoodText)

    if (dietaryPreferences?.vegetarian && !tags.includes('vegetarian')) {
      return false
    }

    if (dietaryPreferences?.vegan && !tags.includes('vegan')) {
      return false
    }

    if (dietaryPreferences?.glutenFree && !tags.includes('gluten-free')) {
      return false
    }

    if (dietaryPreferences?.dairyFree && !tags.includes('dairy-free')) {
      return false
    }

    if (religiousPreferences?.halal && !tags.includes('halal')) {
      return false
    }

    if (religiousPreferences?.kosher && !tags.includes('kosher')) {
      return false
    }

    if (avoidList.some((food) => allergens.includes(food))) {
      return false
    }

    return true
  })

  const matchedRecipes = filteredRecipes
    .map((recipe) => {
      const matchedIngredients = recipe.ingredients.filter((ingredient) =>
        groceryNames.includes(normalizeFoodText(ingredient))
      )

      const matchPercent = Math.round(
        (matchedIngredients.length / recipe.ingredients.length) * 100
      )

      return {
        ...recipe,
        matchedIngredients,
        matchPercent,
      }
    })
    .filter((recipe) => recipe.matchPercent >= 60)
    .sort((a, b) => b.matchPercent - a.matchPercent)

  return res.json({
    totalRecipes: matchedRecipes.length,
    recipes: matchedRecipes,
  })
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
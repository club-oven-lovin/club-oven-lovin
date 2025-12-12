// src/lib/recipeData.ts

export interface Recipe {
  id: number;
  name: string;
  image: string;
  ingredients: string;
  steps: string;
  tags: string[];
  dietaryRestrictions: string[];
  owner: string;
  createdAt: Date;
  rating?: number;     // Changed from optional to required for mock data
  time?: string;       // Changed from optional to required for mock data
  price?: string;      // Restored price field
}

export const marketingRecipes: Recipe[] = [
  {
    id: 1,
    name: "Classic Margherita Pizza",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    ingredients: "Dough, Tomato Sauce, Mozzarella, Basil",
    steps: "1. Roll dough. 2. Add sauce and cheese. 3. Bake at 450F for 15 mins. 4. Garnish with basil.",
    tags: ["Italian", "Dinner", "Vegetarian"],
    dietaryRestrictions: ["Vegetarian"],
    owner: "Chef Mario",
    createdAt: new Date(),
    rating: 4.8,
    time: "25-30 min",
    price: "$",
  },
  {
    id: 2,
    name: "Avocado Toast with Egg",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c75b?auto=format&fit=crop&w=800&q=80",
    ingredients: "Bread, Avocado, Egg, Chili Flakes",
    steps: "1. Toast bread. 2. Mash avocado. 3. Fry egg. 4. Assemble.",
    tags: ["Breakfast", "Healthy", "Quick"],
    dietaryRestrictions: ["Vegetarian"],
    owner: "HealthyEats",
    createdAt: new Date(),
    rating: 4.5,
    time: "10-15 min",
    price: "$$",
  },
  {
    id: 3,
    name: "Berry Smoothie Bowl",
    image: "https://images.unsplash.com/photo-1626078436418-d489cd649964?auto=format&fit=crop&w=800&q=80",
    ingredients: "Mixed Berries, Banana, Yogurt, Granola",
    steps: "1. Blend berries, banana, and yogurt. 2. Pour into bowl. 3. Top with granola.",
    tags: ["Breakfast", "Snack", "Vegan"],
    dietaryRestrictions: ["Vegan", "Gluten-Free"],
    owner: "SmoothieKing",
    createdAt: new Date(),
    rating: 4.9,
    time: "5-10 min",
    price: "$",
  },
  {
    id: 4,
    name: "Grilled Salmon with Asparagus",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=800&q=80",
    ingredients: "Salmon Fillet, Asparagus, Lemon, Olive Oil",
    steps: "1. Season salmon and asparagus. 2. Grill for 10-12 mins. 3. Serve with lemon.",
    tags: ["Dinner", "Seafood", "Healthy"],
    dietaryRestrictions: ["Gluten-Free", "Pescatarian"],
    owner: "SeafoodLover",
    createdAt: new Date(),
    rating: 4.7,
    time: "20-25 min",
    price: "$$$",
  }
];

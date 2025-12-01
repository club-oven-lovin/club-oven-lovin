// src/lib/recipeData.ts

export interface Recipe {
  id: number;
  name: string;
  image: string;
  rating: number; // 1-5
  time: string; // e.g., "4-8 min"
  price: string; // e.g., "USD 2.75"
}

export const recipes: Recipe[] = [
  { id: 1, name: "Veggie Quesadilla", image: "/images/recipes/veggie-quesadilla.png", rating: 5, time: "6-7 min", price: "USD 2.75" },
  { id: 2, name: "Garlic Bread Pizza", image: "/images/recipes/garlic-bread-pizza.png", rating: 4, time: "8-10 min", price: "USD 2.40" },
  { id: 3, name: "Mini Breakfast Toast", image: "/images/recipes/mini-breakfast-toast.png", rating: 4, time: "10-12 min", price: "USD 2.25" },
  { id: 4, name: "Mini Air Fryer Muffins", image: "/images/recipes/mini-air-fryer-muffins.png", rating: 5, time: "8-10 min", price: "USD 2.95" },
  { id: 5, name: "Pasta Cheese Toast", image: "/images/recipes/pasta-cheese-toast.png", rating: 4, time: "6-7 min", price: "USD 2.18" },
  { id: 6, name: "Air Fryer Chicken Pizza", image: "/images/recipes/air-fryer-chicken-pizza.png", rating: 5, time: "6-7 min", price: "USD 2.29" },
  { id: 7, name: "Avocado Egg Toast", image: "/images/recipes/avocado-egg-toast.png", rating: 4, time: "4-7 min", price: "USD 2.26" },
  { id: 8, name: "Cheesy Toast Sticks", image: "/images/recipes/cheesy-toast-sticks.png", rating: 5, time: "5-6 min", price: "USD 2.90" },
  { id: 9, name: "Pizza Potato Slices", image: "/images/recipes/pizza-potato-slices.png", rating: 5, time: "14 min", price: "USD 2.30" },
  { id: 10, name: "Toaster Oven Caprese (Tacos)", image: "/images/recipes/toaster-oven-caprese-tacos.png", rating: 4, time: "5-6 min", price: "USD 2.56" },
  { id: 11, name: "Easy Egg Burritos", image: "/images/recipes/easy-egg-burritos.png", rating: 5, time: "5-6 min", price: "USD 2.15" },
  { id: 12, name: "Mini Sausage Bites", image: "/images/recipes/mini-sausage-bites.png", rating: 5, time: "8-9 min", price: "USD 2.95" },
  { id: 13, name: "Pepperoni Toast Bagels", image: "/images/recipes/pepperoni-toast-bagles.png", rating: 4, time: "6-7 min", price: "USD 2.99" },
  { id: 14, name: "Simple Toast", image: "/images/recipes/simple-toast.png", rating: 5, time: "2-3 min", price: "USD 2.40" },
  { id: 15, name: "Toaster Oven Caprese (Flat)", image: "/images/recipes/toaster-oven-caprese-flat.png", rating: 5, time: "7-8 min", price: "USD 3.30" },
];

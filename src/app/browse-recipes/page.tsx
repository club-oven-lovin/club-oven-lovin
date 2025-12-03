// src/app/browse-recipes/page.tsx

import { prisma } from '@/lib/prisma'; // Import prisma client
import { Recipe } from '@/lib/recipeData'; // Import the updated Recipe interface
import RecipeListClient from '@/components/RecipeListClient'; // Import the new client component

// This is now an async Server Component to fetch data
export default async function RecipesPage() {
  // Fetch all recipes from the database
  const recipes: Recipe[] = await prisma.recipe.findMany({
    orderBy: { createdAt: 'desc' }, // Order by creation date to see latest first
  });

  // Pass the fetched recipes to the client component
  return (
    <RecipeListClient initialRecipes={recipes} />
  );
}

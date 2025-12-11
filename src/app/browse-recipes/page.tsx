
import { prisma } from '@/lib/prisma';
import { Recipe } from '@/lib/recipeData';
import RecipeListClient from '@/components/RecipeListClient';

export default async function RecipesPage() {
  // Fetch all recipes from the database
  const recipes: Recipe[] = await prisma.recipe.findMany({
    orderBy: { createdAt: 'desc' }, // latest first
  });

  // Pass the fetched recipes to the client component
  return <RecipeListClient initialRecipes={recipes} />;
}

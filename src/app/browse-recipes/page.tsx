
import { prisma } from '@/lib/prisma';
import RecipeListClient from '@/components/RecipeListClient';

export const dynamic = 'force-dynamic';

export default async function RecipesPage() {
  // Fetch all recipes with their reviews for average rating calculation
  const recipesWithReviews = await prisma.recipe.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  });

  // Transform recipes to include average rating
  const recipes = recipesWithReviews.map((recipe) => {
    const { reviews, ...recipeData } = recipe;
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    return {
      ...recipeData,
      averageRating,
      reviewCount: reviews.length,
    };
  });

  // Pass the fetched recipes to the client component
  return <RecipeListClient initialRecipes={recipes} />;
}

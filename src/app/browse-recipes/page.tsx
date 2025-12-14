
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import authOptions from '@/lib/authOptions';
import RecipeListClient from '@/components/RecipeListClient';

export const dynamic = 'force-dynamic';

export default async function RecipesPage() {
  // Get current user session
  const session = await getServerSession(authOptions);
  interface CustomUser {
    id?: string;
    email?: string | null;
  }
  const user = session?.user as CustomUser | undefined;
  const userId = user?.id ? Number(user.id) : null;

  // Fetch user's favorites if logged in
  const userFavorites = userId
    ? await prisma.favorite.findMany({
      where: { userId },
      select: { recipeId: true },
    })
    : [];
  const favoritedRecipeIds = new Set(userFavorites.map((f) => f.recipeId));

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

  // Transform recipes to include average rating and favorite status
  const recipes = recipesWithReviews.map((recipe) => {
    const { reviews, ...recipeData } = recipe;
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    return {
      ...recipeData,
      averageRating,
      reviewCount: reviews.length,
      isFavorited: favoritedRecipeIds.has(recipe.id),
    };
  });

  // Pass the fetched recipes and userId to the client component
  return <RecipeListClient initialRecipes={recipes} userId={userId} />;
}


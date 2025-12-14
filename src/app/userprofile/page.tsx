import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UserProfile from "@/components/UserProfile";

// Helper to calculate average rating for recipes
function addRatings<T extends { reviews?: { rating: number }[] }>(
  recipes: T[]
): Array<Omit<T, 'reviews'> & { averageRating: number; reviewCount: number }> {
  return recipes.map((recipe) => {
    const reviews = recipe.reviews ?? [];
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    const { reviews: _reviews, ...recipeData } = recipe;
    return {
      ...recipeData,
      averageRating,
      reviewCount: reviews.length,
    };
  });
}

export default async function UserProfilePage() {
  // Get the logged-in user session
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  // Fetch full user record (all fields) from the DB
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect("/auth/signin");

  // Fetch contributed recipes with reviews
  const contributedRecipesRaw = await prisma.recipe.findMany({
    where: { owner: session.user.email },
    include: {
      reviews: { select: { rating: true } },
    },
  });

  // Fetch favorite recipes with reviews
  const favoriteRecipesRaw = await prisma.recipe.findMany({
    where: {
      favorites: {
        some: { userId: user.id },
      },
    },
    include: {
      reviews: { select: { rating: true } },
    },
  });

  const contributedRecipes = addRatings(contributedRecipesRaw);
  const favoriteRecipes = addRatings(favoriteRecipesRaw);

  return (
    <UserProfile
      user={user}
      contributedRecipes={contributedRecipes}
      favoriteRecipes={favoriteRecipes}
    />
  );
}


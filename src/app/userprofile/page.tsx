import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UserProfile from "@/components/UserProfile";

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

  // Fetch full contributed recipes (all fields)
  const contributedRecipes = await prisma.recipe.findMany({
    where: { owner: session.user.email },
  });

  // TODO: Replace with real favorites once implemented
  const favoriteRecipes: typeof contributedRecipes = [];

  return (
    <UserProfile
      user={user}
      contributedRecipes={contributedRecipes}
      favoriteRecipes={favoriteRecipes}
    />
  );
}

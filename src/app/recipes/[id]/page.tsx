
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Container, Badge, Button } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';
import DeleteRecipeButton from '@/components/DeleteRecipeButton';
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";


interface RecipePageProps {
  params: { id: string };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const recipeId = Number(params.id);
  if (Number.isNaN(recipeId)) {
    notFound();
  }

  // ⭐ Get logged-in user (if any)
  interface SessionUserWithId {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const session = await getServerSession(authOptions);
const userId = session?.user ? Number((session.user as SessionUserWithId).id) : null;

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) {
    notFound();
  }

  // ⭐ Is this recipe already favorited by the user?
  let isFavorited = false;
  if (userId) {
    const fav = await prisma.favorite.findFirst({
      where: { userId, recipeId },
    });
    isFavorited = !!fav;
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center">
      <h1 className="mb-3">{recipe.name}</h1>

      {/* ⭐ Favorite Button appears here */}
        {userId && (
          <FavoriteButton
            recipeId={recipe.id}
            userId={userId}
            isFavorited={isFavorited}
          />
        )}
      </div>

      {recipe.image && (
        <div className="mb-4" style={{ maxWidth: 600 }}>
          <div className="position-relative" style={{ height: 350 }}>
            <Image
              src={recipe.image}
              alt={recipe.name}
              fill
              className="object-fit-cover rounded-4 shadow-sm"
            />
          </div>
        </div>
      )}

      {recipe.tags.length > 0 && (
        <div className="mb-3 d-flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <Badge key={tag} bg="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {recipe.dietaryRestrictions.length > 0 && (
        <div className="mb-3 d-flex flex-wrap gap-2">
          {recipe.dietaryRestrictions.map((d) => (
            <Badge key={d} bg="success">
              {d}
            </Badge>
          ))}
        </div>
      )}

      <p className="text-muted mb-4">
        By {recipe.owner} · Created on{' '}
        {recipe.createdAt.toLocaleDateString()}
      </p>

      <h2>Ingredients</h2>
      <p style={{ whiteSpace: 'pre-wrap' }}>{recipe.ingredients}</p>

      <h2 className="mt-4">Steps</h2>
      <p style={{ whiteSpace: 'pre-wrap' }}>{recipe.steps}</p>

      <div className="mt-4 d-flex gap-2">
        <Link href={`/recipes/${recipe.id}/edit`}>
          <Button variant="primary">Edit Recipe</Button>
        </Link>

        <DeleteRecipeButton id={recipe.id} />
      </div>
    </Container>
  );
}

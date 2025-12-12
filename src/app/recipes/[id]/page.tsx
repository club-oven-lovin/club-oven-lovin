
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Container, Badge, Button } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import DeleteRecipeButton from '@/components/DeleteRecipeButton';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';

interface RecipePageProps {
  params: { id: string };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const recipeId = Number(params.id);
  if (Number.isNaN(recipeId)) {
    notFound();
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) {
    notFound();
  }

  // 🔐 Auth + permissions
  const session = await getServerSession(authOptions);
  const user = session?.user as {
    email?: string;
    randomKey?: string;
  } | undefined;

  const canEdit = !!user?.email && user.email === recipe.owner;
  const canDelete = user?.randomKey === 'ADMIN';

  return (
    <Container className="py-4">
      <h1 className="mb-3">{recipe.name}</h1>

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
        {canEdit && (
          <Link href={`/recipes/${recipe.id}/edit`}>
            <Button variant="primary">Edit Recipe</Button>
          </Link>
        )}

        {canDelete && <DeleteRecipeButton id={recipe.id} />}
      </div>
    </Container>
  );
}

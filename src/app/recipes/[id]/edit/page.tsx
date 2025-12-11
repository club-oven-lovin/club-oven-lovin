
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Container } from 'react-bootstrap';
import EditRecipeForm from '@/components/EditRecipeForm';

interface EditRecipePageProps {
  params: { id: string };
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
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

  return (
    <Container className="py-4">
      <h1>Edit Recipe</h1>
      <EditRecipeForm recipe={recipe} />
    </Container>
  );
}
